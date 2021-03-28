import { Injectable, OnDestroy } from "@angular/core";
import { MatchDamageEvent } from "@common/match/match-damage-event";
import { MatchRosterPlayer } from "@common/match/match-roster-player";
import { PlayerState } from "@common/player-state";
import { isPlayerNameEqual } from "@common/utilities/player";
import { OverwolfDataProviderService } from "@core/overwolf-data-provider";
import { PlayerService } from "@core/player.service";
import { Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { cleanInt, isEmpty, parseBoolean } from "src/utilities";
import { MatchActivityService } from "./match-activity.service";
import { MatchPlayerInventoryService } from "./match-player-inventory.service";
import { MatchPlayerService } from "./match-player.service";
import { MatchRosterService } from "./match-roster.service";

/**
 * @classdesc Provides local player damage/knockdown/kill events, and damage calculation
 */
@Injectable({
    providedIn: "root",
    deps: [
        MatchActivityService,
        MatchPlayerService,
        MatchPlayerInventoryService,
        MatchRosterService,
        OverwolfDataProviderService,
        PlayerService,
    ],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchPlayerDamageService", MatchPlayerDamageService, deps),
})
export class MatchPlayerDamageService implements OnDestroy {
    /** Eliminations/knockdown event stream for the local user */
    public readonly myKillfeedEvent$ = new Subject<MatchDamageEvent>();
    /** Damage event stream for the local user */
    public readonly myDamageEvent$ = new Subject<MatchDamageEvent>();

    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly matchActivity: MatchActivityService,
        private readonly matchPlayer: MatchPlayerService,
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
        this.setupMyKillfeedEvents();
        this.setupMyDamageEvents();
    }

    /**
     * Killfeed events that are caused by the local player
     */
    private setupMyKillfeedEvents(): void {
        this.matchActivity.killfeedEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((killfeedEvent) => !isEmpty(killfeedEvent.victim.name)),
                filter((killfeedEvent) => isPlayerNameEqual(killfeedEvent.attacker?.name, this.player.myName$.value)),
                filter((killfeedEvent) => !isPlayerNameEqual(killfeedEvent.victim.name, this.player.myName$.value))
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
                filter(() => this.matchPlayer.myState$.value !== PlayerState.Eliminated)
            )
            .subscribe((rawDamageEvent) => {
                if (!rawDamageEvent || !rawDamageEvent.targetName) return;
                if (!this.player.myName$.value) return;
                const matchRoster = this.matchRoster.matchRoster$.value;
                const rosterMe = matchRoster.allPlayers.find((p) => isPlayerNameEqual(p.name, this.player.myName$.value));
                let rosterVictim = matchRoster.allPlayers.find((p) => isPlayerNameEqual(p.name, rawDamageEvent.targetName));

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
                        `Could not add damage event; local player ("${this.player.myName$.value}") couldn't be found on match roster.`,
                        this.player.myName$.value,
                        matchRoster
                    );
                }
                const primaryWeapon = this.matchPlayerInventory.myWeaponSlots$.value[0]?.item;

                const newDamageEvent: MatchDamageEvent = {
                    timestamp: new Date(),
                    victim: rosterVictim as MatchRosterPlayer,
                    attacker: rosterMe,
                    hasShield: parseBoolean(rawDamageEvent.armor),
                    isHeadshot: parseBoolean(rawDamageEvent.headshot),
                    shieldDamage: rawDamageEvent.armor ? cleanInt(rawDamageEvent.damageAmount) : 0,
                    healthDamage: !rawDamageEvent.armor ? cleanInt(rawDamageEvent.damageAmount) : 0,
                    weapon: primaryWeapon,
                };
                this.myDamageEvent$.next(newDamageEvent);
            });
    }
}
