import { Injectable } from "@angular/core";
import { WeaponItem } from "@app/models/items/weapon-item.js";
import { MatchInflictionEvent } from "@app/models/match/infliction-event.js";
import { MatchRosterPlayer } from "@app/models/match/roster-player.js";
import { PlayerState } from "@app/models/player-state.js";
import { isPlayerNameEqual } from "@app/models/utilities/player.js";
import { BaseService } from "@app/modules/core/base-service.abstract.js";
import { SingletonServiceProviderFactory } from "@app/singleton-service.provider.factory.js";
import { cleanInt, isEmpty, parseBoolean } from "@shared/utilities/index.js";
import { merge, Observable, partition, Subject } from "rxjs";
import { delay, filter, map, takeUntil, tap } from "rxjs/operators";
import { OverwolfGameDataService } from "../overwolf/index.js";
import { PlayerService } from "../player.service.js";
import { MatchKillfeedService } from "./match-killfeed.service.js";
import { MatchPlayerInventoryService } from "./match-player-inventory.service.js";
import { MatchPlayerService } from "./match-player.service.js";
import { MatchRosterService } from "./match-roster.service.js";

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
    /**
     * Local user's Killfeed & damage event stream combined. Similar to RxJS's race operator.
     * Emits whichever event fires first, prevents duplicate events from firing within a certain window.
     */
    public readonly myUniqueDamageEvent$ = new Subject<MatchInflictionEvent>();
    /** Local user's Killfeed event stream */
    public readonly myKillfeedEvent$: Observable<MatchInflictionEvent>;
    /** Eliminations/knockdown event stream for all players except the local user */
    public readonly notMyKillfeedEvent$: Observable<MatchInflictionEvent>;
    /** Damage event stream for the local user */
    public readonly myDamageEvent$ = new Subject<MatchInflictionEvent>();
    /**
     * Knockdown stream for the local user
     * Does not contain weapon information.
     */
    public readonly myKnockdownEvent$ = new Subject<MatchInflictionEvent>();
    /**
     * Elimination event stream for the local user
     * Does not contain weapon information.
     */
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
        this.setupUniqueDamageEvents();
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
                        `Damage inflicted on "${rawDamageEvent.targetName}" was not found on the match roster. ...Creating new instance of roster player as substitute.`
                    );
                    rosterVictim = { name: rawDamageEvent.targetName, isMe: false } as MatchRosterPlayer;
                }
                if (!rosterMe) {
                    console.error(
                        `Could not add damage event; local player ("${this.player.myName$.value}") couldn't be found on match roster.`
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
                let victim = allRosterPlayers.find((p) => isPlayerNameEqual(p.name, actionData.victimName));
                const attacker = allRosterPlayers.find((p) => p.isMe);
                const weapon = new WeaponItem({});
                const isVictimKnocked = gameEvent.name === "knockdown";
                const isVictimEliminated = gameEvent.name === "kill";
                if (!victim) {
                    console.warn(
                        `[${this.constructor.name}] Could not find victim "${actionData.victimName}" on the match roster. ...substituting a new instance of victim`
                    );
                    victim = { name: actionData.victimName, isMe: false } as MatchRosterPlayer;
                }

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

    private setupUniqueDamageEvents(): void {
        const UNIQUE_WINDOW = 5000;
        let tempMyUniqueDamageEvents: MatchInflictionEvent[] = [];
        const hasDamage = (dmgEvt: MatchInflictionEvent) => (dmgEvt.shieldDamage ?? 0) > 0 || (dmgEvt.healthDamage ?? 0) > 0;
        const addTempMyUniqueDamageEventFn = (dmgEvt: MatchInflictionEvent) => {
            if (!hasDamage(dmgEvt)) tempMyUniqueDamageEvents.push(dmgEvt);
        };
        const findTempMyUniqueDamageEventFn = (dmgEvt: MatchInflictionEvent) => {
            if (hasDamage(dmgEvt)) return;
            return tempMyUniqueDamageEvents.find(
                (uDmgEvt) =>
                    dmgEvt.victim?.name == uDmgEvt.victim?.name &&
                    dmgEvt.isKnockdown == uDmgEvt.isKnockdown &&
                    dmgEvt.isElimination == uDmgEvt.isElimination
            );
        };
        const removeTempMyUniqueDamageEventFn = (dmgEvt: MatchInflictionEvent) => {
            tempMyUniqueDamageEvents = tempMyUniqueDamageEvents.filter(
                (uDmgEvt) =>
                    dmgEvt.victim?.name != uDmgEvt.victim?.name &&
                    dmgEvt.isKnockdown != uDmgEvt.isKnockdown &&
                    dmgEvt.isElimination != uDmgEvt.isElimination
            );
        };

        merge(this.myDamageEvent$, this.myKillfeedEvent$)
            .pipe(
                takeUntil(this.destroy$),
                filter((event) => !findTempMyUniqueDamageEventFn(event)),
                tap((event) => addTempMyUniqueDamageEventFn(event)),
                tap((event) => this.myUniqueDamageEvent$.next(event)),
                delay(UNIQUE_WINDOW),
                tap((event) => removeTempMyUniqueDamageEventFn(event))
            )
            .subscribe();
    }
}
