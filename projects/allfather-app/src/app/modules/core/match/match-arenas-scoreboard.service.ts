import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { ArenasScoreboard } from "@allfather-app/app/common/match/arenas-scoreboard";
import { MatchInflictionEvent } from "@allfather-app/app/common/match/infliction-event";
import { MatchRoster } from "@allfather-app/app/common/match/roster";
import { MatchRosterTeammate } from "@allfather-app/app/common/match/roster-teammate";
import { PlayerState } from "@allfather-app/app/common/player-state";
import { isPlayerNameEqual } from "@allfather-app/app/common/utilities/player";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, Subject } from "rxjs";
import { filter, pairwise, switchMap, takeUntil } from "rxjs/operators";
import { BaseService } from "../base-service.abstract";
import { MatchKillfeedService } from "./match-killfeed.service";
import { MatchPlayerService } from "./match-player.service";
import { MatchRosterService } from "./match-roster.service";
import { MatchService } from "./match.service";

/**
 * @class MatchArenasScoreboardService
 * @classdesc Keeps track of the Arenas Scoreboard: rounds, tiebreakers, sudden death
 * "To win an Arenas match, you need to win at least three rounds and be ahead of the enemy team by two points.
 * The easiest way is to win three rounds without dropping more than one round to your opponent.
 * In other words, go 3-0 or 3-1 and the match is over.
 * However, if your opponent is able to win at least two rounds, things get interesting.
 * You’ll have to pull ahead by two full rounds to win. Going 3-2 or 4-3 won’t cut it.
 * Instead, you’ll have to go 4-2 or 5-3 to secure victory. Rounds will continue until one team pulls ahead by two rounds.
 * If this continues all the way to the ninth round (by going 4-4) the game kicks into sudden death mode.
 * Whoever wins round nine takes home all the glory."
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, MatchKillfeedService, MatchPlayerService, MatchRosterService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchArenasScoreboardService", MatchArenasScoreboardService, deps),
})
export class MatchArenasScoreboardService extends BaseService {
    /** 0 = not in Arenas Match */
    public currentRoundNum$ = new BehaviorSubject<number>(0);
    public roundLoseEvent$ = new Subject<void>();
    public roundWinEvent$ = new Subject<void>();
    public matchLoseEvent$ = new Subject<void>();
    public matchWinEvent$ = new Subject<void>();
    public scoreboard$ = new BehaviorSubject<ArenasScoreboard>(new ArenasScoreboard());

    protected allFeatureDeps: OverwolfFeatureDep[] = [
        OverwolfFeatureDep.Damage,
        OverwolfFeatureDep.Death,
        OverwolfFeatureDep.GameMode,
        OverwolfFeatureDep.Respawn,
        OverwolfFeatureDep.Roster,
    ];

    private get isServiceEnabled(): boolean {
        return !!this.match.gameMode$.value?.isArenasGameMode && !!this.match.gameMode$.value.isAFSupported;
    }
    private myTeamRoster$ = new BehaviorSubject<MatchRoster<MatchRosterTeammate>>(new MatchRoster<MatchRosterTeammate>());
    private enemyTeamRoster$ = new BehaviorSubject<MatchRoster>(new MatchRoster());
    private lastKillfeedEvent?: MatchInflictionEvent;

    constructor(
        private readonly match: MatchService,
        private readonly matchKillfeed: MatchKillfeedService,
        private readonly matchPlayer: MatchPlayerService,
        private readonly matchRoster: MatchRosterService
    ) {
        super();
        this.setupKillfeedEvents();
        this.setupMatchRoster();
        this.setupOnMatchStart();
        this.setupOnRoundStart();
        this.setupOnMatchEnd();
    }

    private setupKillfeedEvents(): void {
        this.matchKillfeed.killfeedEvent$.pipe(takeUntil(this.destroy$)).subscribe((killfeedEvent) => {
            this.lastKillfeedEvent = killfeedEvent;
        });
    }

    private setupMatchRoster(): void {
        this.match.startedEvent$
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.isServiceEnabled),
                switchMap(() => combineLatest([this.matchRoster.matchRoster$, this.matchRoster.teammateRoster$])),
                filter(([matchRoster, teammateRoster]) => !!matchRoster.allPlayers.length && !!teammateRoster.allPlayers.length)
            )
            .subscribe(([matchRoster, teammateRoster]) => {
                console.debug(
                    `[${this.constructor.name}] Setting rosters, using: [${matchRoster.allPlayers
                        .map((p) => p.name)
                        .join()}] and [${teammateRoster.allPlayers.map((p) => p.name).join()}]`
                );
                const enemyRoster = new MatchRoster();

                matchRoster.allPlayers.forEach((matchRosterPlayer) => {
                    const foundTeammate = teammateRoster.allPlayers.find((t) => isPlayerNameEqual(t.name, matchRosterPlayer.name));
                    if (!foundTeammate) enemyRoster.addPlayer(matchRosterPlayer);
                });

                this.myTeamRoster$.next(teammateRoster);
                this.enemyTeamRoster$.next(enemyRoster);
            });
    }

    private setupOnMatchStart(): void {
        this.match.startedEvent$
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.isServiceEnabled)
            )
            .subscribe(() => {
                this.scoreboard$.next(new ArenasScoreboard());
                this.currentRoundNum$.next(1);
                this.myTeamRoster$.next(new MatchRoster());
                this.enemyTeamRoster$.next(new MatchRoster<MatchRosterTeammate>());
            });
    }

    private setupOnRoundStart(): void {
        this.matchPlayer.myState$
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.isServiceEnabled),
                pairwise(),
                filter(([previousState, currentState]) => previousState === PlayerState.Eliminated && currentState === PlayerState.Alive)
            )
            .subscribe(() => {
                console.debug(`[${this.constructor.name}] New Round Started`);
                this.doRoundCalculation();
            });
    }

    private setupOnMatchEnd(): void {
        this.match.endedEvent$
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.isServiceEnabled)
            )
            .subscribe(() => {
                this.doRoundCalculation();
            });
    }

    private doRoundCalculation(): void {
        console.debug(`[${this.constructor.name}] Running doRoundCalculation()`);
        if (!this.lastKillfeedEvent) {
            console.error(`[${this.constructor.name}] no last killfeed event to calculate!`);
            return;
        }
        const roundWon = !this.matchRoster.teammateRoster$.value.allPlayers.find((p) =>
            isPlayerNameEqual(p.name, this.lastKillfeedEvent!.victim.name)
        );

        this.updateScoreboard(roundWon);
        this.updateCurrentRoundNum(this.scoreboard$.value);
        this.updateRoundEvents(roundWon);
        this.updateMatchEvents(this.scoreboard$.value);
        this.bigDebug();
    }

    private updateScoreboard(roundWon: boolean): void {
        const scoreboard = this.scoreboard$.value;
        scoreboard.addRoundResult(roundWon);
        this.scoreboard$.next(scoreboard);
        console.debug(`[${this.constructor.name}] Scoreboard updated; won: ${scoreboard.numRoundsWon}, lost: ${scoreboard.numRoundsLost}`);
    }

    private updateCurrentRoundNum(scoreboard: ArenasScoreboard): void {
        this.currentRoundNum$.next(scoreboard.numRoundsPlayed + 1);
        console.debug(`[${this.constructor.name}] Round number updated: ${this.currentRoundNum$.value}`);
    }

    private updateRoundEvents(roundWon: boolean): void {
        if (roundWon) {
            this.roundWinEvent$.next();
            console.debug(`[${this.constructor.name}] Emitting roundWinEvent$`);
        } else {
            this.roundLoseEvent$.next();
            console.debug(`[${this.constructor.name}] Emitting roundLoseEvent$`);
        }
    }

    private updateMatchEvents(scoreboard: ArenasScoreboard): void {
        const matchWon = scoreboard.hasWon;
        const matchLost = scoreboard.hasLost;

        if (matchWon && matchLost) {
            console.error(`[${this.constructor.name}] ArenasScoreboard class shows both won and lost`);
        } else if (matchWon) {
            console.debug(`[${this.constructor.name}] Emitting matchWinEvent$`);
            this.matchWinEvent$.next();
        } else if (matchLost) {
            console.debug(`[${this.constructor.name}] Emitting matchLoseEvent`);
            this.matchLoseEvent$.next();
        }
    }

    private bigDebug(): void {
        const numRounds = this.scoreboard$.value.numRoundsPlayed;
        const numRoundsWon = this.scoreboard$.value.numRoundsWon;
        const numRoundsLost = this.scoreboard$.value.numRoundsLost;
        const winArray = this.scoreboard$.value.roundsResult;
        console.debug(
            `##### Scoreboard (Round ${numRounds + 1})#####\n` +
                `Scoreboard: ${winArray}\n` +
                `Score: ${numRoundsWon} Won, ${numRoundsLost} Lost\n` +
                `Rounds Played: ${numRounds}`
        );
    }
}
