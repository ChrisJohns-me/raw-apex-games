import { WeaponItem } from "@allfather-app/app/common/items/weapon-item";
import { MatchInflictionEvent } from "@allfather-app/app/common/match/infliction-event";
import { MatchRosterPlayer } from "@allfather-app/app/common/match/roster-player";
import { PlayerState } from "@allfather-app/app/common/player-state";
import { isPlayerNameEqual } from "@allfather-app/app/common/utilities/player";
import { MatchKillfeedService } from "@allfather-app/app/modules/core/match/match-killfeed.service";
import { MatchRosterService } from "@allfather-app/app/modules/core/match/match-roster.service";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { cleanInt, isEmpty, parseBoolean } from "common/utilities/";
import { Observable, partition, Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { BaseService } from "../base-service.abstract";
import { OverwolfGameDataService } from "../overwolf";
import { MatchPlayerInventoryService } from "./match-player-inventory.service";
import { MatchPlayerService } from "./match-player.service";

/**
 * @classdesc Provides local player damage/knockdown/kill/damage events
 * Killfeed can include kill events of the local player, when the local player finished off an already knocked down player.
 */
@Injectable({
    providedIn: "root",
    deps: [
        MatchKillfeedService,
        MatchPlayerService,
        MatchPlayerInventoryService,
        MatchRosterService,
        OverwolfGameDataService,
        PlayerService,
    ],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchPlayerInflictionService", MatchPlayerInflictionService, deps),
})
export class MatchPlayerInflictionService extends BaseService {
    /** Local user's Killfeed event stream */
    public readonly myKillfeedEvent$: Observable<MatchInflictionEvent>;
    /** Eliminations/knockdown event stream for all players except the local user */
    public readonly notMyKillfeedEvent$: Observable<MatchInflictionEvent>;
    /** Damage event stream for the local user */
    public readonly myDamageEvent$ = new Subject<MatchInflictionEvent>();
    /** Knockdown stream for the local user */
    public readonly myKnockdownEvent$ = new Subject<MatchInflictionEvent>();
    /** Elimination event stream for the local user */
    public readonly myEliminationEvent$ = new Subject<MatchInflictionEvent>();

    constructor(
        private readonly matchKillfeed: MatchKillfeedService,
        private readonly matchPlayer: MatchPlayerService,
        private readonly matchPlayerInventory: MatchPlayerInventoryService,
        private readonly matchRoster: MatchRosterService,
        private readonly overwolfGameData: OverwolfGameDataService,
        private readonly player: PlayerService
    ) {
        super();
        [this.myKillfeedEvent$, this.notMyKillfeedEvent$] = partition(
            this.matchKillfeed.killfeedEvent$,
            (killfeedEvent) => !isEmpty(killfeedEvent.victim.name) && !!killfeedEvent.attacker?.isMe && !killfeedEvent.victim.isMe
        );
        this.setupMyDamageEvents();
        this.setupKillsAndKnockdowns();
    }

    /**
     * Damage events caused by the local player
     */
    private setupMyDamageEvents(): void {
        this.overwolfGameData.newGameEvent$
            .pipe(
                takeUntil(this.destroy$),
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

    /**
     * Knockdown or kill events caused by the local player, from the gameEvent name: "kill", "knockdown".
     */
    private setupKillsAndKnockdowns(): void {
        type KillOrKnockdownData = overwolf.gep.ApexLegends.GameEventKill | overwolf.gep.ApexLegends.GameEventKnockdown;

        this.overwolfGameData.newGameEvent$
            .pipe(
                takeUntil(this.destroy$),
                filter((gameEvent) => gameEvent.name === "knockdown" || gameEvent.name === "kill"),
                filter((gameEvent) => !!gameEvent.data && typeof gameEvent.data === "object"),
                filter((gameEvent) => !!(gameEvent.data as KillOrKnockdownData).victimName)
            )
            .subscribe((gameEvent) => {
                if (!this.player.myName$.value) return;
                const actionData = gameEvent.data as KillOrKnockdownData;
                const allRosterPlayers = this.matchRoster.matchRoster$.value.allPlayers;
                const victim = allRosterPlayers.find((p) => isPlayerNameEqual(p.name, actionData.victimName));
                const attacker = allRosterPlayers.find((p) => p.isMe);
                const weapon = new WeaponItem({});
                const isVictimKnocked = gameEvent.name === "knockdown";
                const isVictimEliminated = gameEvent.name === "kill";
                if (!victim) return;

                const newMatchInflictionEvent: MatchInflictionEvent = {
                    timestamp: new Date(),
                    victim: victim,
                    attacker: attacker,
                    isKnockdown: isVictimKnocked,
                    isElimination: isVictimEliminated,
                    weapon,
                };

                if (isVictimEliminated) {
                    this.myEliminationEvent$.next(newMatchInflictionEvent);
                } else if (isVictimKnocked) {
                    this.myKnockdownEvent$.next(newMatchInflictionEvent);
                }
            });
    }
}
