import { Injectable } from "@angular/core";
import { SingletonServiceProviderFactory } from "@app/app/singleton-service.provider.factory";
import { cleanInt } from "common/utilities";
import { BehaviorSubject, debounceTime, filter, map, switchMap, takeUntil, tap } from "rxjs";
import { BaseService } from "./base-service.abstract";
import { MatchPlayerInflictionService } from "./match/match-player-infliction.service";
import { MatchService } from "./match/match.service";
import { OverwolfInputTrackingService } from "./overwolf/overwolf-input-tracking.service";

const MOUSE_MOVEMENT_THRESHOLD_PX = 10000;
const DAMAGE_BURST_DEBOUNCE_TIME = 60000;

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
    /** Per every debounced damage event, checks mouse movement to verify that there has been mouse movement */
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

                if (damageBurstMouseDistance > MOUSE_MOVEMENT_THRESHOLD_PX) {
                    console.info(`Damage burst window of ${DAMAGE_BURST_DEBOUNCE_TIME / 1000}seconds detected mouse movement`);
                    this.isMouseInputDetectedOnDamageBurst$.next(true);
                } else {
                    console.error(`Damage burst window of ${DAMAGE_BURST_DEBOUNCE_TIME / 1000}seconds detected no mouse movement`);
                    this.isMouseInputDetectedOnDamageBurst$.next(false);
                }

                this.damageBurstStartingMouseDistance = undefined;
            });
    }
}
