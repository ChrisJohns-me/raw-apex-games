import { Injectable, OnDestroy } from "@angular/core";
import { KillfeedEvent } from "@common/killfeed-event";
import { MatchState } from "@common/match";
import { MatchRoster } from "@common/match-roster";
import { Player } from "@common/player";
import { Team } from "@common/team";
import { WeaponItem } from "@common/weapon-item";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { findValueByKeyRegEx } from "src/utilities";
import { cleanInt } from "src/utilities/number";
import { MatchService } from "./match.service";
import {
    OverwolfDataProviderService,
    OWGameEventKillFeed,
    OWMatchInfo,
    OWMatchInfoRoster,
} from "./overwolf-data-provider";
import { PlayerService } from "./player.service";

@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfDataProviderService, PlayerService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchRosterService", MatchRosterService, deps),
})
export class MatchRosterService implements OnDestroy {
    public readonly roster$;
    public readonly killfeedEvent$ = new Subject<KillfeedEvent>();
    public readonly killfeedEventList$ = new BehaviorSubject<KillfeedEvent[]>([]);
    // TODO:
    public readonly teammates$ = new BehaviorSubject<Optional<MatchRoster>>(undefined);
    public readonly numTeams$ = new BehaviorSubject<number>(0);
    public readonly numPlayers$ = new BehaviorSubject<number>(0);

    private _roster = new MatchRoster();
    private _killfeedList: KillfeedEvent[] = [];
    private _owRawRoster: Partial<OWMatchInfo> = {};
    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly match: MatchService,
        private readonly overwolf: OverwolfDataProviderService,
        private readonly player: PlayerService
    ) {
        this.roster$ = new BehaviorSubject<MatchRoster>(this._roster);
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupMatchStateEvents();
        this.setupInfoTabs();
        this.setupRoster();
        this.setupKillfeed();
    }

    /**
     * Makes sure that the player's status is Alive (since there's activity been detected); checks for if the player has been previously eliminated.
     *  - Should be used against killfeed events, where `playerName` is the attacker;
     *  - Or used against inflicted damage events, where `playerName` is the victim.
     * ...which would indicate that the player has respawned, knocked/eliminated another player, or has been damaged by local player.
     */
    public setPlayerHasActivity(playerName: string): void {
        if (!playerName) return;
        const foundPlayer = this._roster.eliminatedPlayers.find((ep) => ep.name === playerName);

        if (foundPlayer) {
            console.debug(
                `[${this.constructor.name}] Player "${foundPlayer.name}" possibly respawned. ` +
                    `Player has activity after status was eliminated.`
            );
            this._roster.respawnPlayer(foundPlayer.name);
        }
    }

    private setupMatchStateEvents(): void {
        // Reset state on match start
        this.match.started$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this.numPlayers$.next(0);
            this.numTeams$.next(0);
            this._killfeedList = [];
            this._roster = this.createRoster(this._owRawRoster);
            this.roster$.next(this._roster);
        });

        // Clear Overwolf roster only
        this.match.ended$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this._owRawRoster = {};
        });
    }

    private setupInfoTabs(): void {
        const setTabsHigherAmountFn = (newAmount: number, subject: BehaviorSubject<number>): void => {
            newAmount = cleanInt(newAmount);
            if (newAmount > subject.value) subject.next(newAmount);
        };

        this.overwolf.infoUpdates$
            .pipe(
                filter((infoUpdate) => infoUpdate.feature === "match_info" && !!infoUpdate.info.match_info?.tabs),
                map((infoUpdate) => infoUpdate.info.match_info?.tabs)
            )
            .subscribe((tabs) => {
                if (!tabs || !Object.keys(tabs).length) return;
                setTabsHigherAmountFn(tabs.teams, this.numTeams$);
                setTabsHigherAmountFn(tabs.players, this.numPlayers$);
            });
    }

    //#region Roster
    private setupRoster(): void {
        // Get all Overwolf roster items
        this.overwolf.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((infoUpdate) => infoUpdate.feature === "roster"),
                filter(
                    (infoUpdate) => !!findValueByKeyRegEx<OWMatchInfoRoster>(infoUpdate.info.match_info, /^roster_/)
                ),
                map((infoUpdate) => infoUpdate.info.match_info)
            )
            .subscribe((matchInfo) => {
                this.rawRosterUpdate(matchInfo);
            });
    }

    /**
     * Occurs when there's a any update item for the roster
     * @param {OWMatchInfo} matchInfo Incoming Overwolf match info
     */
    private rawRosterUpdate(matchInfo?: OWMatchInfo): void {
        if (!matchInfo) return;
        // const rosterItem = findValueByKeyRegEx<Optional<OWMatchInfoRoster>>(matchInfo, /^roster_/);
        const rosterKey = Object.keys(matchInfo)[0];
        const rosterItem: OWMatchInfoRoster = (matchInfo as any)[rosterKey];
        const isDeletingRosterItem = typeof matchInfo === "object" && String(rosterItem) == "null";
        const playerName = rosterItem?.name;

        if (rosterItem?.state === "dead") {
            if (playerName) this.eliminatePlayerOnRoster(playerName);
        } else if (rosterItem?.state === "knockedout") {
            if (playerName) this.knockdownPlayerOnRoster(playerName);
        } else if (isDeletingRosterItem) {
            if (this.match.currentState$.value.state === MatchState.Active) {
                // Roster item was deleted during the match, indicating that the player has quit the game
                this.rosterPlayerQuit(Object.keys(matchInfo)[0]);
            }
        }

        // Perform the action to Add / Remove roster item from roster list
        if (isDeletingRosterItem) {
            if (Object.keys(this._owRawRoster).length) delete (this._owRawRoster as any)[rosterKey];
        } else {
            this._owRawRoster = { ...this._owRawRoster, ...matchInfo };
        }
        this.roster$.next(this._roster);
    }

    private createRoster(owRawRoster: Optional<Partial<OWMatchInfo>>): MatchRoster {
        if (!owRawRoster || typeof owRawRoster !== "object") return new MatchRoster();
        const teams: Team[] = [];

        for (const [k, p] of Object.entries(owRawRoster)) {
            const player = p as OWMatchInfoRoster;
            if (!/^roster/.test(k)) continue;
            if (!player.name || isNaN(player.team_id)) continue;

            const newPlayer = new Player(player.name, {
                isLocalPlayer: player.name === this.player.playerName$.value,
                teamId: player.team_id,
                isTeammate: player.isTeammate,
                platformHardware: player.platform_hw,
                platformSoftware: player.platform_sw,
            });

            const foundTeam = teams.find((t) => t.teamId === player.team_id);
            if (!foundTeam) {
                const newTeam = new Team({
                    teamId: player.team_id,
                    isFriendly: player.isTeammate,
                    members: [newPlayer],
                });
                teams.push(newTeam);
            } else {
                foundTeam.addMember(newPlayer);
            }
        }

        return new MatchRoster(teams);
    }

    /**
     * Takes roster deletion events.
     * Ensures player is eliminated from the roster.
     * Generates an elimination killfeed event (if it does not already exist) from the last knockdown killfeed event.
     * @param rosterId Roster key from "match_info", ie. "roster_0"
     */
    private rosterPlayerQuit(rosterId: string): void {
        const deletedPlayer =
            Object.keys(this._owRawRoster).length && typeof (this._owRawRoster as AnyObject)[rosterId] === "object"
                ? (this._owRawRoster as AnyObject)[rosterId]
                : undefined;
        const deletedPlayerName = deletedPlayer?.name;
        if (!deletedPlayerName) return;

        this.eliminatePlayerOnRoster(deletedPlayerName);

        // Generate a kill feed event from last known knockdown
        //  only if an elimination is not found after the knockdown
        const deletedPlayerKillfeed = [...this._killfeedList]
            .filter((e) => e.victimName === deletedPlayerName)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        const deletedPlayerLastKnockdown = deletedPlayerKillfeed.find((e) => e.isKnockdown);
        const deletedPlayerLastElimination = deletedPlayerKillfeed.find((e) => e.isElimination);

        if (!deletedPlayerLastKnockdown) return; // Deleted player has no knockdown event
        if (
            deletedPlayerLastElimination &&
            deletedPlayerLastKnockdown.timestamp.getTime() < deletedPlayerLastElimination.timestamp.getTime()
        ) {
            // Deleted player's elimination killfeed event has already been recorded
            return;
        }

        console.debug(
            `[${this.constructor.name}] Player quit; Auto-generated elimination killfeed event from knockdown for victim: "${deletedPlayerName}"`
        );
        const newKillfeedEvent: KillfeedEvent = {
            ...deletedPlayerLastKnockdown,
            timestamp: new Date(),
            isElimination: true,
            isKnockdown: false,
            weapon: new WeaponItem({ fromInGameEventName: "Bleed Out" }),
        };
        this.killfeedEvent$.next(newKillfeedEvent);
    }
    //#endregion

    //#region Killfeed
    private setupKillfeed(): void {
        this.overwolf.newGameEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((gameEvent) => gameEvent.name === "kill_feed"),
                map((gameEvent) => gameEvent.data as OWGameEventKillFeed)
            )
            .subscribe((killfeed) => {
                const victim = this._roster.players.find((p) => p.name === killfeed.victimName);
                const weapon = new WeaponItem({ fromInGameEventName: killfeed.weaponName });
                const act = killfeed.action;
                const isKnockdown = !!(act === "Melee" || act === "Caustic Gas" || act === "knockdown");
                const isElimination = !!(act === "Bleed Out" || act === "kill" || act === "headshot_kill");

                this.setPlayerHasActivity(killfeed.attackerName);

                if (!victim) return;
                if (isKnockdown) this.knockdownPlayerOnRoster(victim.name);
                else if (isElimination) this.eliminatePlayerOnRoster(victim.name);

                const newKillfeedEvent: KillfeedEvent = {
                    timestamp: new Date(),
                    attackerName: killfeed.attackerName,
                    victimName: killfeed.victimName,
                    isKnockdown,
                    isElimination,
                    weapon,
                };

                this.killfeedEvent$.next(newKillfeedEvent);

                this._killfeedList.push(newKillfeedEvent);
                this.killfeedEventList$.next(this._killfeedList);
            });
    }

    //#endregion

    private eliminatePlayerOnRoster(victimName: string): void {
        this._roster.eliminatePlayer(victimName);
        this.roster$.next(this._roster);
    }

    private knockdownPlayerOnRoster(victimName: string): void {
        this._roster.knockdownPlayer(victimName);
        this.roster$.next(this._roster);
    }
}
