import { Injectable } from "@angular/core";
import { BaseService } from "@app/modules/core/base-service.abstract.js";
import { MatchService } from "@app/modules/core/match/match.service.js";
import { SingletonServiceProviderFactory } from "@app/singleton-service.provider.factory.js";
import { cleanInt } from "@shared/utilities/primitives/number.js";
import { BehaviorSubject, debounceTime, filter, map, switchMap, takeUntil, tap } from "rxjs";
import { MatchPlayerInflictionService } from "./match/match-player-infliction.service.js";
import { OverwolfInputTrackingService } from "./overwolf/overwolf-input-tracking.service.js";

const MOUSE_MOVEMENT_THRESHOLD_PX = 1000;
const DAMAGE_BURST_DEBOUNCE_TIME = 10000;

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
    /**
     * Per every debounced damage event, checks mouse movement to verify that there has been mouse movement.
     * Emits `undefined` on match start.
     */
    public readonly isMouseInputDetectedOnDamageBurst$ = new BehaviorSubject<Optional<boolean>>(undefined);

    private damageBurstStartingMouseDistance: Optional<number>;

    constructor(
        private readonly match: MatchService,
        private readonly matchPlayerInfliction: MatchPlayerInflictionService,
        private readonly overwolfInputTracking: OverwolfInputTrackingService
    ) {
        super();
        this.setupMatchStateEvents();
        this.setupDetectedInputOnDamage();
    }

    private setupMatchStateEvents(): void {
        this.match.startedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.isMouseInputDetectedOnDamageBurst$.next(undefined);
        });
    }

    private setupDetectedInputOnDamage(): void {
        this.matchPlayerInfliction.myDamageEvent$
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.match.isActive),
                switchMap(() => this.overwolfInputTracking.getActivityInformation()),
                map((inputActivity) => cleanInt(inputActivity.mouse.dist)),
                tap((mouseDist) => {
                    if (this.damageBurstStartingMouseDistance === undefined) this.damageBurstStartingMouseDistance = mouseDist;
                }),
                filter((mouseDist) => this.damageBurstStartingMouseDistance !== mouseDist),
                debounceTime(DAMAGE_BURST_DEBOUNCE_TIME)
            )
            .subscribe((endingMouseDist) => {
                const damageBurstMouseDistance = endingMouseDist - this.damageBurstStartingMouseDistance!;

                console.debug(`Damage burst ended with mouse distance of ${damageBurstMouseDistance}`);
                if (damageBurstMouseDistance > MOUSE_MOVEMENT_THRESHOLD_PX) {
                    console.info(`Damage burst window of ${DAMAGE_BURST_DEBOUNCE_TIME / 1000}sec detected mouse movement`);
                    this.isMouseInputDetectedOnDamageBurst$.next(true);
                } else {
                    console.error(`Damage burst window of ${DAMAGE_BURST_DEBOUNCE_TIME / 1000}sec detected no mouse movement`);
                    this.isMouseInputDetectedOnDamageBurst$.next(false);
                }

                this.damageBurstStartingMouseDistance = undefined;
            });
    }
}
