import { Injectable, OnDestroy } from "@angular/core";
import { MatchDamageEvent } from "@common/match/match-damage-event";
import { MatchRosterPlayer } from "@common/match/match-roster-player";
import { PlayerStatus } from "@common/player";
import { Observable, of, Subject } from "rxjs";
import { filter, map, takeUntil, timeout } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { MatchActivityService } from "./match-activity.service";
import { MatchPlayerInventoryService } from "./match-player-inventory.service";
import { MatchRosterService } from "./match-roster.service";
import { MatchService } from "./match.service";
import { OverwolfDataProviderService } from "./overwolf-data-provider";
import { PlayerService } from "./player.service";

/**
 * @classdesc Provides local player damage/knockdown/kill events, and damage calculation
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, MatchActivityService, MatchRosterService, OverwolfDataProviderService, PlayerService],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("MatchPlayerDamageService", MatchPlayerDamageService, deps),
})
export class MatchPlayerDamageService implements OnDestroy {
    /** Eliminations/knockdown event stream for the local user */
    public readonly myKillfeedEvent$ = new Subject<MatchDamageEvent>();
    /** Damage event stream for the local user */
    public readonly myDamageEvent$ = new Subject<MatchDamageEvent>();

    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly match: MatchService,
        private readonly matchActivity: MatchActivityService,
        private readonly matchPlayerInventory: MatchPlayerInventoryService,
        private readonly matchRoster: MatchRosterService,
        private readonly overwolf: OverwolfDataProviderService,
        private readonly player: PlayerService
    ) {}

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupMatchReset();
        this.setupMyKillfeedEvents();
        this.setupMyDamageEvents();
    }

    // Possible usage in a UI Alert, showing basic damage done (on the latest victim) in x seconds (above screen)
    // Possible usage in Damage Collector.

    /**
     * Creates a stream
     * External inflictions made to the victim are ignored.
     */
    public getDamageAccumDuration$(accumDurationMs: number): Observable<MatchDamageEvent> {
        of().pipe(timeout);
    }

    /**
     * Reset on Match Start
     */
    private setupMatchReset(): void {
        // this.match.startedEvent$.pipe(takeUntil(this._unsubscribe)).subscribe();
    }

    /**
     * Killfeed events that are caused by the local player
     */
    private setupMyKillfeedEvents(): void {
        this.matchActivity.killfeedEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((killfeedEvent) => killfeedEvent.attacker === this.player.me$.value.name)
            )
            .subscribe((killfeedEvent) => this.myKillfeedEvent$.next(killfeedEvent));
    }

    /**
     * Damage events caused by the local player
     */
    private setupMyDamageEvents(): void {
        this.overwolf.newGameEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((gameEvent) => gameEvent.name === "damage"),
                map((gameEvent) => gameEvent.data as overwolf.gep.ApexLegends.GameEventDamage),
                filter(() => this.player.me$.value.status !== PlayerStatus.Eliminated)
            )
            .subscribe((rawDamageEvent) => {
                if (!rawDamageEvent || !rawDamageEvent.targetName) return;
                if (!this.player.me$.value.name) return;
                const matchRoster = this.matchRoster.matchRoster$.value;
                let rosterVictim = matchRoster.findPlayer(rawDamageEvent.targetName);
                const rosterMe = matchRoster.findPlayer(this.player.me$.value.name);

                if (!rosterVictim) {
                    console.warn(
                        `Damage inflicted on "${rawDamageEvent.targetName}" was not found on the match roster. ...Creating new instance of roster player as substitute.`,
                        rawDamageEvent,
                        matchRoster
                    );
                    rosterVictim = { name: rawDamageEvent.targetName } as MatchRosterPlayer;
                }
                if (!rosterMe) {
                    console.error(
                        `Could not add damage event; local player ("${this.player.me$.value.name}") couldn't be found on match roster.`,
                        this.player.me$.value,
                        matchRoster
                    );
                }
                const primaryWeapon = this.matchPlayerInventory.myWeaponSlots$.value[0]?.item;

                const newDamageEvent: MatchDamageEvent = {
                    timestamp: new Date(),
                    victim: rosterVictim as MatchRosterPlayer,
                    attacker: rosterMe,
                    hasShield: rawDamageEvent.armor,
                    isHeadshot: rawDamageEvent.headshot,
                    shieldDamage: rawDamageEvent.armor ? rawDamageEvent.damageAmount : 0,
                    healthDamage: !rawDamageEvent.armor ? rawDamageEvent.damageAmount : 0,
                    weapon: primaryWeapon,
                };
                this.myDamageEvent$.next(newDamageEvent);
            });
    }
}
