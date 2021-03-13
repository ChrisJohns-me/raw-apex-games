import { Injectable, OnDestroy } from "@angular/core";
import { KillfeedEvent } from "@common/killfeed-event";
import { MatchState } from "@common/match";
import { MatchRoster } from "@common/match-roster";
import { Player } from "@common/player";
import { Team } from "@common/team";
import { Weapon } from "@common/weapon";
import { BehaviorSubject, Subject } from "rxjs";
import { distinctUntilChanged, filter, map, takeUntil } from "rxjs/operators";
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
    public readonly killfeed$ = new Subject<KillfeedEvent>();
    public readonly teammates$ = new BehaviorSubject<Optional<MatchRoster>>(undefined);

    private _roster: Optional<MatchRoster>;
    private _owRawRoster: Optional<Partial<OWMatchInfo>>;

    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly match: MatchService,
        private readonly overwolf: OverwolfDataProviderService,
        private readonly player: PlayerService
    ) {
        console.debug(`[${this.constructor.name}] Instantiated`);

        this.start();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private start(): void {
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
        this.match.state$.pipe(takeUntil(this._unsubscribe), distinctUntilChanged()).subscribe((newMatchState) => {
            if (!this._owRawRoster) return;
            if (newMatchState === MatchState.Active) {
                const newRoster = this.createRoster(this._owRawRoster);
                this._roster = newRoster;
                this.roster$.next(newRoster);
            } else if (newMatchState === MatchState.Inactive) {
                this.roster$.next(undefined);
            }
            this._owRawRoster = undefined;
        });
    }

    /**
     * Occurs when there's a any update item for the roster
     * @param OWMatchInfo Incoming Overwolf match info
     */
    private rawRosterUpdate(matchInfo?: OWMatchInfo): void {
        if (!matchInfo) return;
        const rosterItem = findValueByKeyRegEx<OWMatchInfoRoster>(matchInfo, /^roster_/);
        const playerName = rosterItem?.name;

        if (rosterItem?.state === "dead") {
            if (playerName) this.eliminatePlayerOnRoster(playerName);
        } else if (rosterItem?.state === "knockedout") {
            if (playerName) this.knockdownPlayerOnRoster(playerName);
        } else if (typeof rosterItem === "object" && rosterItem == null) {
            // Roster item was deleted, indicating that the player has left the game
            if (playerName) this.eliminatePlayerOnRoster(playerName);
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

            if (!teams.find((t) => t.teamId === player.team_id)) {
                const newTeam = new Team(player.team_id, {
                    isFriendly: player.isTeammate,
                    members: [newPlayer],
                });
                teams.push(newTeam);
            }
        }

        return new MatchRoster(teams);
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
                const attacker = this._roster?.players.find((p) => p.name === killfeed.attackerName);
                const victim = this._roster?.players.find((p) => p.name === killfeed.victimName);
                const weapon = new Weapon({ fromKillfeedName: killfeed.weaponName });
                const act = killfeed.action;
                const isKnockdown = !!(act === "Melee" || act === "Caustic Gas" || act === "knockdown");
                const isElimination = !!(act === "Bleed Out" || act === "kill" || act === "headshot_kill");

                if (!victim) return;
                if (isKnockdown) this.knockdownPlayerOnRoster(victim.name);
                else if (isElimination) this.eliminatePlayerOnRoster(victim.name);

                const newKillfeedEvent: KillfeedEvent = {
                    attacker,
                    victim,
                    isKnockdown,
                    isElimination,
                    weapon,
                };

                this.killfeed$.next(newKillfeedEvent);
            });
    }
    //#endregion

    private eliminatePlayerOnRoster(playerName: string): void {
        this._roster?.eliminatePlayer(playerName);
        this.roster$.next(this._roster);
    }

    private knockdownPlayerOnRoster(playerName: string): void {
        this._roster?.knockdownPlayer(playerName);
        this.roster$.next(this._roster);
    }
}
