import { BaseService } from "#app/modules/core/base-service.abstract.js";
import { MatchService } from "#app/modules/core/match/match.service.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { cleanInt } from "#shared/utilities/primitives/number.js";
import { Injectable } from "@angular/core";
import { debounceTime, filter, map, Observable, switchMap, takeUntil, tap } from "rxjs";
import { MatchPlayerInflictionService } from "./match/match-player-infliction.service.js";
import { OverwolfInputTrackingService } from "./overwolf/overwolf-input-tracking.service.js";

/**
 * @classdesc Service for detecting inputs from the user.
 * @todo Detect macros from keyboard
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, MatchPlayerInflictionService, OverwolfInputTrackingService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("GameplayInputService", GameplayInputService, deps),
})
export class GameplayInputService extends BaseService {
    constructor(
        private readonly match: MatchService,
        private readonly matchPlayerInfliction: MatchPlayerInflictionService,
        private readonly overwolfInputTracking: OverwolfInputTrackingService
    ) {
        super();
    }

    /**
     * Given mouseMovementThresholdPx and debounceTimeMs, returns an observable that emits true if mouse
     *  movement is detected within the debounce time (from a burst of damage events).
     * Avoid setting the debounce time too low, as it will cause false positives.
     * Avoid setting the debounce time too high, as it will group the bursts too
     *  closely and only fire once after a long period.
     * @example { mouseMovementThresholdPx: 500, debounceTimeMs: 10000 }
     */
    public mouseMovementDetectedOnDamageBurst({
        mouseMovementThresholdPx,
        debounceTimeMs,
    }: {
        mouseMovementThresholdPx: number;
        debounceTimeMs: number;
    }): Observable<boolean> {
        let startingMouseDistance: Optional<number>;

        return this.matchPlayerInfliction.myDamageEvent$
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.match.isActive),
                switchMap(() => this.overwolfInputTracking.getActivityInformation()),
                map((inputActivity) => cleanInt(inputActivity.mouse.dist)),
                tap((mouseDist) => (startingMouseDistance = startingMouseDistance ?? mouseDist)),
                debounceTime(debounceTimeMs)
            )
            .pipe(
                switchMap(() => this.overwolfInputTracking.getActivityInformation()),
                map((inputActivity) => cleanInt(inputActivity.mouse.dist)),
                map((endingMouseDist) => {
                    const mouseDistance = endingMouseDist - startingMouseDistance!;
                    startingMouseDistance = undefined;

                    console.debug(`Damage burst ended with mouse distance of ${mouseDistance}px`);
                    if (mouseDistance > mouseMovementThresholdPx) {
                        return true;
                    } else {
                        return false;
                    }
                })
            );
    }
}
