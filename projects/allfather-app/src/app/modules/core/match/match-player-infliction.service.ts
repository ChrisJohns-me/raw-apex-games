import { MatchInflictionEvent } from "@allfather-app/app/common/match/infliction-event";
import { MatchRosterPlayer } from "@allfather-app/app/common/match/roster-player";
import { PlayerState } from "@allfather-app/app/common/player-state";
import { isPlayerNameEqual } from "@allfather-app/app/common/utilities/player";
import { OverwolfGameDataService } from "@allfather-app/app/modules/core/overwolf";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { Observable, partition, Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { cleanInt, isEmpty, parseBoolean } from "shared/utilities";
import { AllfatherService } from "../allfather-service.abstract";
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
        OverwolfGameDataService,
        PlayerService,
    ],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchPlayerInflictionService", MatchPlayerInflictionService, deps),
})
export class MatchPlayerInflictionService extends AllfatherService {
    /** Eliminations/knockdown event stream for the local user */
    public readonly myKillfeedEvent$: Observable<MatchInflictionEvent>;
    /** Eliminations/knockdown event stream for all players except the local user */
    public readonly notMyKillfeedEvent$: Observable<MatchInflictionEvent>;
    /** Damage event stream for the local user */
    public readonly myDamageEvent$ = new Subject<MatchInflictionEvent>();

    constructor(
        private readonly matchActivity: MatchActivityService,
        private readonly matchPlayer: MatchPlayerService,
        private readonly matchPlayerInventory: MatchPlayerInventoryService,
        private readonly matchRoster: MatchRosterService,
        private readonly overwolfGameData: OverwolfGameDataService,
        private readonly player: PlayerService
    ) {
        super();
        [this.myKillfeedEvent$, this.notMyKillfeedEvent$] = partition(
            this.matchActivity.killfeedEvent$,
            (killfeedEvent) => !isEmpty(killfeedEvent.victim.name) && !!killfeedEvent.attacker?.isMe && !killfeedEvent.victim.isMe
        );
        this.setupMyDamageEvents();
    }

    /**
     * Damage events caused by the local player
     */
    private setupMyDamageEvents(): void {
        this.overwolfGameData.newGameEvent$
            .pipe(
                takeUntil(this.isDestroyed$),
                filter((gameEvent) => gameEvent.name === "damage"),
                map((gameEvent) => gameEvent.data as overwolf.gep.ApexLegends.GameEventDamage),
                filter(() => {
                    const myState = this.matchPlayer.myState$.value;
                    return myState !== PlayerState.Eliminated && myState !== PlayerState.Disconnected;
                })
            )
            .subscribe((rawDamageEvent) => {
                if (!rawDamageEvent || !rawDamageEvent.targetName) return;
                if (!this.player.myName$.value) return;
                const matchRoster = this.matchRoster.matchRoster$.value;
                const rosterMe = matchRoster.allPlayers.find((p) => p.isMe);
                let rosterVictim = matchRoster.allPlayers.find((p) => isPlayerNameEqual(p.name, rawDamageEvent.targetName));

                if (!rosterVictim) {
                    console.warn(
                        `Damage inflicted on "${rawDamageEvent.targetName}" was not found on the match roster. ...Creating new instance of roster player as substitute.`,
                        rawDamageEvent,
                        matchRoster
                    );
                    rosterVictim = { name: rawDamageEvent.targetName, isMe: false } as MatchRosterPlayer;
                }
                if (!rosterMe) {
                    console.error(
                        `Could not add damage event; local player ("${this.player.myName$.value}") couldn't be found on match roster.`,
                        this.player.myName$.value,
                        matchRoster
                    );
                }
                const primaryWeapon = this.matchPlayerInventory.myWeaponSlots$.value[0]?.item;

                const newDamageEvent: MatchInflictionEvent = {
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
