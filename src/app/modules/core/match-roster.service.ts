import { Injectable, OnDestroy } from "@angular/core";
import { DamageEvent } from "@common/damage-event";
import { MatchState } from "@common/match";
import { MatchRoster } from "@common/match-roster";
import { Player, PlayerStatus } from "@common/player";
import { Team } from "@common/team";
import { WeaponItem } from "@common/weapon-item";
import { addSeconds } from "date-fns";
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
    public readonly roster$ = new BehaviorSubject<MatchRoster>(new MatchRoster());
    public readonly killfeedEvent$ = new Subject<DamageEvent>();
    public readonly killfeedEventList$ = new BehaviorSubject<DamageEvent[]>([]);
    // TODO:
    public readonly teammates$ = new BehaviorSubject<Optional<MatchRoster>>(undefined);
    public readonly numTeams$ = new BehaviorSubject<number>(0);
    /** 0 if "fair-play" mode is on (<5 players remain) */
    public readonly numPlayers$ = new BehaviorSubject<number>(0);

    private _owRawRoster: Partial<OWMatchInfo> = {};
    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly match: MatchService,
        private readonly overwolf: OverwolfDataProviderService,
        private readonly player: PlayerService
    ) {}

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
     *  - Should be used against killfeed events, where `player` is the attacker;
     *  - Or used against inflicted damage events, where `player` is the victim.
     * ...which would indicate that the player has respawned, knocked/eliminated another player, or has been damaged by local player.
     */
    public setPlayerHasActivity(player: Player): void {
        if (!player.name) return;
        const foundPlayer = this.roster$.value.players.find((ep) => ep.name === player.name);

        if (foundPlayer?.status === PlayerStatus.Eliminated) {
            console.debug(
                `[${this.constructor.name}] Player "${foundPlayer.name}" possibly respawned. ` +
                    `Player has activity after status was eliminated.`
            );

            const newRoster = this.roster$.value;
            newRoster.respawnPlayer(foundPlayer);
            this.roster$.next(newRoster);
        }

        if (foundPlayer) foundPlayer.lastActivity = new Date();
    }

    private setupMatchStateEvents(): void {
        // Reset state on match start
        this.match.started$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this.numPlayers$.next(0);
            this.numTeams$.next(0);
            this.killfeedEventList$.next([]);
            // Roster should be ready to be created
            this.roster$.next(this.createRoster(this._owRawRoster));
        });

        // Clear Overwolf roster only
        this.match.ended$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this._owRawRoster = {};
        });
    }

    private setupInfoTabs(): void {
        this.overwolf.infoUpdates$
            .pipe(
                filter((infoUpdate) => infoUpdate.feature === "match_info" && !!infoUpdate.info.match_info?.tabs),
                map((infoUpdate) => infoUpdate.info.match_info?.tabs)
            )
            .subscribe((tabs) => {
                if (!tabs || !Object.keys(tabs).length) return;
                this.numTeams$.next(cleanInt(tabs.teams));
                this.numPlayers$.next(cleanInt(tabs.players));
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
     * Occurs when there's a any update to the roster
     * @param {OWMatchInfo} matchInfo Incoming Overwolf match info
     */
    private rawRosterUpdate(matchInfo?: OWMatchInfo): void {
        if (!matchInfo) return;
        const rosterKey = Object.keys(matchInfo)[0];
        const rosterItem: OWMatchInfoRoster = (matchInfo as any)[rosterKey];
        const isDeletingRosterItem = typeof matchInfo === "object" && String(rosterItem) == "null";
        const player = this.roster$.value.players.find((p) => !!rosterItem?.name && p.name === rosterItem?.name);

        if (rosterItem?.state === "dead") {
            if (player) this.eliminatePlayerOnRoster(player);
        } else if (rosterItem?.state === "knockedout") {
            if (player) this.knockdownPlayerOnRoster(player);
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
        this.roster$.next(this.roster$.value);
    }

    private createRoster(owRawRoster: Optional<Partial<OWMatchInfo>>): MatchRoster {
        if (!owRawRoster || typeof owRawRoster !== "object") return new MatchRoster();
        const teams: Team[] = [];

        for (const [rosterId, owRostPlayer] of Object.entries(owRawRoster) as [[string, OWMatchInfoRoster]]) {
            const me = this.player.me$.value;
            if (!/^roster/.test(rosterId)) continue;
            if (!owRostPlayer || isNaN(owRostPlayer.team_id)) continue;
            const newPlayer = new Player({
                name: owRostPlayer.name,
                rosterId: rosterId,
                isMe: owRostPlayer.name === me.name,
                teamId: owRostPlayer.team_id,
                status: PlayerStatus.Alive,
                platformHardware: owRostPlayer.platform_hw,
                platformSoftware: owRostPlayer.platform_sw,
            });

            if (me.name && owRostPlayer.name === me.name) this.player.setMe(newPlayer);

            const foundTeam = teams.find((t) => t.teamId === owRostPlayer.team_id);
            if (!foundTeam) {
                const newTeam = new Team({
                    teamId: owRostPlayer.team_id,
                    isMyTeam: owRostPlayer.isTeammate,
                    members: [newPlayer],
                });
                teams.push(newTeam);
            } else {
                foundTeam.members.push(newPlayer);
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
        const owDeletedRosterPlayer: Optional<OWMatchInfoRoster> =
            Object.keys(this._owRawRoster).length && typeof (this._owRawRoster as AnyObject)[rosterId] === "object"
                ? (this._owRawRoster as AnyObject)[rosterId]
                : undefined;
        const deletedPlayerName = owDeletedRosterPlayer?.name;
        const deletedPlayerRoster =
            deletedPlayerName && this.roster$.value.players.find((p) => p.name === deletedPlayerName);
        if (!deletedPlayerName) return;

        if (deletedPlayerRoster) this.eliminatePlayerOnRoster(deletedPlayerRoster);

        // Generate a kill feed event from last known knockdown
        //  only if an elimination is not found after the knockdown
        const deletedPlayerKillfeed = [...this.killfeedEventList$.value]
            .filter((e) => e.victim.name === deletedPlayerName)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        const deletedPlayerLastKnockdown = deletedPlayerKillfeed.find((e) => e.isKnocked);
        const deletedPlayerLastElimination = deletedPlayerKillfeed.find((e) => e.isEliminated);

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
        const newDamageEvent: DamageEvent = {
            ...deletedPlayerLastKnockdown,
            timestamp: new Date(),
            isEliminated: true,
            isKnocked: false,
            weapon: new WeaponItem({ fromInGameEventName: "Bleed Out" }),
        };
        this.killfeedEvent$.next(newDamageEvent);
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
                const victim = this.roster$.value.players.find((p) => p.name === killfeed.victimName);
                const attacker = this.roster$.value.players.find((p) => p.name === killfeed.attackerName);
                const weapon = new WeaponItem({ fromInGameEventName: killfeed.weaponName });
                const act = killfeed.action;
                const isVictimKnocked = !!(act === "Melee" || act === "Caustic Gas" || act === "knockdown");
                const isVictimEliminated = !!(act === "Bleed Out" || act === "kill" || act === "headshot_kill");

                if (!victim) return;

                if (isVictimKnocked) this.knockdownPlayerOnRoster(victim);
                else if (isVictimEliminated) this.eliminatePlayerOnRoster(victim);

                if (attacker?.lastActivity && new Date() > addSeconds(attacker.lastActivity, 30)) {
                    this.setPlayerHasActivity(attacker); // Enough time to get a kill, and be respawned
                }
                if (victim.lastActivity && new Date() > addSeconds(victim.lastActivity, 90)) {
                    this.setPlayerHasActivity(victim); // Enough time to bleed out, and be respawned
                }

                const newDamageEvent: DamageEvent = {
                    timestamp: new Date(),
                    victim: victim,
                    attacker: attacker,
                    isKnocked: isVictimKnocked,
                    isEliminated: isVictimEliminated,
                    weapon,
                };

                this.killfeedEvent$.next(newDamageEvent);
                const newKillfeedEventList = [...this.killfeedEventList$.value, newDamageEvent];
                this.killfeedEventList$.next(newKillfeedEventList);
            });
    }
    //#endregion
    private eliminatePlayerOnRoster(victim: Player): void {
        this.roster$.value.eliminatePlayer(victim);
        this.roster$.next(this.roster$.value);
    }

    private knockdownPlayerOnRoster(victim: Player): void {
        this.roster$.value.knockdownPlayer(victim);
        this.roster$.next(this.roster$.value);
    }
}
