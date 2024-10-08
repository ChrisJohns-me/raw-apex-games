import { MatchState } from "@allfather-app/app/common/match/state";
import { PlayerState } from "@allfather-app/app/common/player-state";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { cleanInt, isEmpty, parseBoolean } from "common/utilities/";
import { BehaviorSubject } from "rxjs";
import { filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { BaseService } from "../base-service.abstract";
import { OverwolfGameDataService } from "../overwolf";
import { MatchArenasScoreboardService } from "./match-arenas-scoreboard.service";
import { MatchPlayerInflictionService } from "./match-player-infliction.service";
import { MatchPlayerService } from "./match-player.service";
import { MatchService } from "./match.service";

/**
 * @classdesc Provides damage/deaths/knockdown/kill, etc. count updates
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, MatchArenasScoreboardService, MatchPlayerService, MatchPlayerInflictionService, OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchPlayerStatsService", MatchPlayerStatsService, deps),
})
export class MatchPlayerStatsService extends BaseService {
    /** Data from Overwolf's "tabs". Reset on match start. */
    public readonly myEliminations$ = new BehaviorSubject<number>(0);
    /** Inferred from Overwolf event. Reset on match start. */
    public readonly myDeaths$ = new BehaviorSubject<number>(0);
    /** Data from Overwolf's "tabs". Reset on match start. */
    public readonly myAssists$ = new BehaviorSubject<number>(0);
    /** Data from Overwolf's "tabs". Reset on match start. */
    public readonly myDamage$ = new BehaviorSubject<number>(0);
    /**
     * Arenas: Grabbed from ArenasScoreboard service
     * BattleRoyale: Data from Overwolf's "tabs". Reset on match start.
     */
    public readonly myPlacement$ = new BehaviorSubject<number>(0);
    /** Data from Overwolf's "tabs". Reset on match start. May not work in Arenas. */
    public readonly victory$ = new BehaviorSubject<boolean>(false);
    /** @deprecated May not work; Feature is unavailable in game-UI. */
    public readonly mySpectators$ = new BehaviorSubject<number>(0);
    /** Inferred from player infliction. Reset on match start. */
    public readonly myKnockdowns$ = new BehaviorSubject<number>(0);
    /**
     * Does not take into consideration victim's HP, only the raw inflicted amount.
     * The contained damage amount will then appear to be inflated.
     * Info directly from Overwolf's me.totalDamageDealt data.
     */
    public readonly myTotalDamageDealt$ = new BehaviorSubject<number>(0);

    constructor(
        private readonly match: MatchService,
        private readonly matchArenasScoreboard: MatchArenasScoreboardService,
        private readonly matchPlayer: MatchPlayerService,
        private readonly matchPlayerInfliction: MatchPlayerInflictionService,
        private readonly overwolfGameData: OverwolfGameDataService
    ) {
        super();
        this.setupMatchStateEvents();
        this.setupInfoTabs();
        this.setupTotalDamageDealt();
        this.setupDeaths();
        this.setupVictory();
        this.setupMyKnockdowns();
        this.setupArenasScoreboard();
    }

    private setupMatchStateEvents(): void {
        this.match.startedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.myDamage$.next(0);
            this.myEliminations$.next(0);
            this.myDeaths$.next(0);
            this.myAssists$.next(0);
            this.mySpectators$.next(0);
            this.myPlacement$.next(0);
            this.victory$.next(false);
            this.myKnockdowns$.next(0);
        });
    }

    private setupInfoTabs(): void {
        const setAmountFn = (newAmount: number, subject: BehaviorSubject<number>): void => {
            newAmount = cleanInt(newAmount);
            subject.next(newAmount);
        };

        this.overwolfGameData.infoUpdates$
            .pipe(
                filter((infoUpdate) => infoUpdate.feature === "match_info" && !!infoUpdate.info.match_info?.tabs),
                map((infoUpdate) => infoUpdate.info.match_info?.tabs)
            )
            .subscribe((tabs) => {
                if (!tabs || isEmpty(tabs)) return;
                setAmountFn(tabs.kills, this.myEliminations$);
                setAmountFn(tabs.assists, this.myAssists$);
                setAmountFn(tabs.damage, this.myDamage$);
                this.mySpectators$.next(cleanInt(tabs.spectators));

                if (!this.match.gameMode$.value?.isArenasGameMode) {
                    this.myPlacement$.next(cleanInt(tabs.teams));
                }
            });
    }

    private setupTotalDamageDealt(): void {
        this.overwolfGameData.infoUpdates$
            .pipe(
                takeUntil(this.destroy$),
                filter((infoUpdate) => infoUpdate.feature === "damage" && !!infoUpdate.info.me?.totalDamageDealt),
                map((infoUpdate) => cleanInt(infoUpdate.info.me?.totalDamageDealt))
            )
            .subscribe((totalDamageDealt) => this.myTotalDamageDealt$.next(totalDamageDealt));
    }

    private setupDeaths(): void {
        this.overwolfGameData.newGameEvent$
            .pipe(
                takeUntil(this.destroy$),
                filter((gameEvent) => gameEvent.name === "death")
            )
            .subscribe(() => {
                this.myDeaths$.next(this.myDeaths$.value + 1);
            });
    }

    private setupVictory(): void {
        const setVictoryFn = (newValue: boolean): void => {
            if (newValue !== this.victory$.value) this.victory$.next(newValue);
        };

        this.match.state$
            .pipe(
                takeUntil(this.destroy$),
                tap((stateChanged) => (stateChanged.state === MatchState.Active ? setVictoryFn(false) : null)),
                switchMap(() => this.overwolfGameData.infoUpdates$),
                filter(() => {
                    const myState = this.matchPlayer.myState$.value;
                    return myState !== PlayerState.Eliminated && myState !== PlayerState.Disconnected;
                }),
                filter((infoUpdate) => infoUpdate.feature === "rank"),
                map((infoUpdate) => infoUpdate.info.match_info),
                filter((matchInfo) => !!matchInfo && !!Object.keys(matchInfo).includes("victory")),
                filter((matchInfo) => !isEmpty(matchInfo?.victory)),
                map((matchInfo) => parseBoolean(matchInfo?.victory))
            )
            .subscribe((isVictory) => {
                this.myPlacement$.next(1);
                this.victory$.next(isVictory);
            });
    }

    private setupMyKnockdowns(): void {
        this.matchPlayerInfliction.myKillfeedEvent$
            .pipe(
                takeUntil(this.destroy$),
                filter((myKillfeedEvent) => !!myKillfeedEvent.isKnockdown)
            )
            .subscribe(() => {
                this.myKnockdowns$.next(this.myKnockdowns$.value + 1);
            });
    }

    private setupArenasScoreboard(): void {
        this.matchArenasScoreboard.scoreboard$.pipe(takeUntil(this.destroy$)).subscribe((scoreboard) => {
            if (Number.isFinite(scoreboard.placement)) {
                this.myPlacement$.next(cleanInt(scoreboard.placement));
            }
        });
    }
}
