import { Injectable } from "@angular/core";
import { MatchGameMode } from "@raw-apex-games-app/app/common/match/game-mode/game-mode";
import { Rank } from "@raw-apex-games-app/app/common/rank/rank";
import { SingletonServiceProviderFactory } from "@raw-apex-games-app/app/singleton-service.provider.factory";
import { isEmpty } from "common/utilities";
import { IndexableType } from "dexie";
import { filter, map, Observable, OperatorFunction, switchMap, takeUntil } from "rxjs";
import { MatchGameModeList } from "../../common/match/game-mode/game-mode-list";
import { BaseService } from "../core/base-service.abstract";
import { MatchDataStore } from "../core/local-database/match-data-store";
import { MatchService } from "../core/match/match.service";
import { MyPlayerAccountStatsService } from "../core/player-account-stats/my-player-account-stats.service";
import { PlayerService } from "../core/player.service";

/**
 * @class MatchRankSyncService
 * @classdesc On initialization, listens for player's rank to be reported,
 *  syncs the player's rank with latest match.
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, MyPlayerAccountStatsService, PlayerService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchRankSyncService", MatchRankSyncService, deps),
})
export class MatchRankSyncService extends BaseService {
    private readonly matchGameModeList = MatchGameModeList;

    constructor(
        private readonly match: MatchService,
        private readonly myPlayerAccountStats: MyPlayerAccountStatsService,
        private readonly player: PlayerService
    ) {
        super();
        this.setupLiveMatchListeners();
    }

    private setupLiveMatchListeners(): void {
        this.myPlayerAccountStats.myAccountStats$
            .pipe(
                takeUntil(this.destroy$),
                map((myAccountStats) => myAccountStats?.rank),
                filter((myRank) => !!myRank) as OperatorFunction<Optional<Rank>, Rank>,
                switchMap((myRank) => this.syncMyRankWithLatestMatch$(myRank))
            )
            .subscribe();
    }

    /**
     * Retrieves the player's latest match, injects the rankscore, and updates the match in the database.
     * Latest match must be ranked.
     * @returns {IndexableType} Match ID
     */
    private syncMyRankWithLatestMatch$(myRank: Rank): Observable<IndexableType> {
        return this.player.myName$.pipe(
            filter((myName) => !!myName) as OperatorFunction<Optional<string>, string>,
            switchMap((myName) => this.match.getLatestMatchDataByPlayerName$(myName)),
            filter((matchData) => !!matchData) as OperatorFunction<Optional<MatchDataStore>, MatchDataStore>,
            filter((matchData) => !matchData.rankScore), // only update if rankScore is not set
            filter((matchData) => {
                if (isEmpty(matchData.gameModeId)) return false;
                const gameMode = MatchGameMode.getFromId(this.matchGameModeList, matchData.gameModeId!);
                return !!gameMode.isRanked;
            }), // and only update if game mode is ranked,
            map((matchData) => ({ ...matchData, rankScore: myRank.score })), // inject rankScore
            switchMap((newMatchData) => this.match.storeMatchData$(newMatchData))
        );
    }
}
