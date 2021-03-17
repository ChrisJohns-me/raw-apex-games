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
    public readonly roster$ = new BehaviorSubject<Optional<MatchRoster>>(undefined);
    public readonly killfeedEvent$ = new Subject<KillfeedEvent>();
    public readonly killfeedEventList$ = new BehaviorSubject<KillfeedEvent[]>([]);
    // TODO:
    public readonly teammates$ = new BehaviorSubject<Optional<MatchRoster>>(undefined);

    private _roster?: MatchRoster;
    private _killfeedList: KillfeedEvent[] = [];
    private _owRawRoster?: Partial<OWMatchInfo>;

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
        this.setupRoster();
        this.setupKillfeed();
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
            .subscribe((matchInfo) => this.rawRosterUpdate(matchInfo));

        // Clear or emit roster from match state change
        this.match.state$.pipe(takeUntil(this._unsubscribe)).subscribe((newMatchState) => {
            if (!this._owRawRoster) return;
            if (newMatchState === MatchState.Active) {
                const newRoster = this.createRoster(this._owRawRoster);
                this._roster = newRoster;
                this.roster$.next(newRoster);
            } else if (newMatchState === MatchState.Inactive) {
                this.roster$.next(undefined);
                this._owRawRoster = undefined;
            }
        });
    }

    /**
     * Occurs when there's a any update item for the roster
     * @param {OWMatchInfo} matchInfo Incoming Overwolf match info
     */
    private rawRosterUpdate(matchInfo?: OWMatchInfo): void {
        if (!matchInfo) return;
        const rosterItem = findValueByKeyRegEx<OWMatchInfoRoster>(matchInfo, /^roster_/);
        const playerName = rosterItem?.name;

        if (rosterItem?.state === "dead") {
            if (playerName) this.eliminatePlayerOnRoster(playerName);
        } else if (rosterItem?.state === "knockedout") {
            if (playerName) this.knockdownPlayerOnRoster(playerName);
        } else if (
            typeof matchInfo === "object" &&
            (String(rosterItem) == "null" || String(rosterItem) == "undefined")
        ) {
            // Roster item was deleted, indicating that the player has quit the game
            this.rosterPlayerQuit(Object.keys(matchInfo)[0]);
        }

        // Perform the action to Add / Remove roster item from roster list
        this._owRawRoster = { ...this._owRawRoster, ...matchInfo };
        this.roster$.next(this._roster);
    }

    private createRoster(owRawRoster?: Optional<Partial<OWMatchInfo>>): Optional<MatchRoster> {
        if (!owRawRoster) return;
        const teams: Team[] = [];

        for (const [k, p] of Object.entries(owRawRoster)) {
            const player = p as OWMatchInfoRoster;
            if (!/^roster/.test(k)) continue;

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
            typeof (this._owRawRoster as AnyObject)[rosterId] === "object"
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
        this.match.state$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((matchState) => matchState === MatchState.Active)
            )
            .subscribe(() => (this._killfeedList = []));

        this.overwolf.newGameEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((gameEvent) => gameEvent.name === "kill_feed"),
                map((gameEvent) => gameEvent.data as OWGameEventKillFeed)
            )
            .subscribe((killfeed) => {
                const victim = this._roster?.players.find((p) => p.name === killfeed.victimName);
                const weapon = new WeaponItem({ fromInGameEventName: killfeed.weaponName });
                const act = killfeed.action;
                const isKnockdown = !!(act === "Melee" || act === "Caustic Gas" || act === "knockdown");
                const isElimination = !!(act === "Bleed Out" || act === "kill" || act === "headshot_kill");

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
        this._roster?.eliminatePlayer(victimName);
        this.roster$.next(this._roster);
    }

    private knockdownPlayerOnRoster(victimName: string): void {
        this._roster?.knockdownPlayer(victimName);
        this.roster$.next(this._roster);
    }
}
