import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "@shared-app/services/base-service.abstract";
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { ReportReason } from "@shared/player-report/report-reason";
import { ReportedPlayer } from "@shared/player-report/reported-player";
import { environment } from "@siren-app/environments/environment";
import { IndexableType } from "dexie";
import { PostPlayerReportDTO } from "projects/allfather-func/functions/src/player-report/post-player-report-dto";
import { defer, from, Observable } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { LocalDatabaseService } from "../local-database/local-database.service";
import { ReportedPlayerDataStore } from "../local-database/reported-player-data-store";

const DEFAULT_LATEST_DAYS = 14;

@Injectable({
    providedIn: "root",
    deps: [HttpClient, LocalDatabaseService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("ReportedPlayersService", ReportedPlayersService, deps),
})
export class ReportedPlayersService extends BaseService {
    constructor(private readonly http: HttpClient, private readonly localDatabase: LocalDatabaseService) {
        super();
    }

    public getLatestReportedPlayers$(numDays: number = DEFAULT_LATEST_DAYS): Observable<ReportedPlayer[]> {
        const params = { numDays };
        return this.http.get<ReportedPlayer[]>(`${environment.apiUrl}/latestReportedPlayers`, { params });
    }

    /**
     * @returns {Observable<string>} Report Id
     */
    public reportPlayer$(
        reportedPlayerInGameUsername: string,
        reportedReason: ReportReason,
        rosterHash: string,
        myOverwolfUsername: string,
        myInGameUsername: string
    ): Observable<string> {
        const postPlayerReportDTO: PostPlayerReportDTO = {
            rosterHash,
            myOverwolfUsername,
            myInGameUsername,
            reportedPlayerInGameUsername,
            reportedReason,
        };
        return this.http
            .post<{ reportedPlayerId: string }>(`${environment.apiUrl}/playerReport`, postPlayerReportDTO)
            .pipe(map(({ reportedPlayerId }) => reportedPlayerId));
    }

    public getLocalReportedPlayers$(): Observable<ReportedPlayer[]> {
        return defer(() => from(this.localDatabase.reportedPlayers.toArray()));
    }

    public storeLocalReportedPlayer$(
        id: string,
        reportedPlayerInGameUsername: string,
        reportedReason: ReportReason,
        rosterHash: string
    ): Observable<IndexableType> {
        const existingReportedPlayer$ = defer(() =>
            from(this.localDatabase.reportedPlayers.get({ inGameUsername: reportedPlayerInGameUsername }))
        );

        return existingReportedPlayer$.pipe(
            takeUntil(this.destroy$),
            switchMap((existingReportedPlayer) => {
                if (!existingReportedPlayer)
                    return this.createLocalReportedPlayer(id, reportedPlayerInGameUsername, rosterHash, reportedReason);
                else return this.updateLocalReportedPlayer(existingReportedPlayer, rosterHash, reportedReason);
            })
        );
    }

    private createLocalReportedPlayer(
        id: string,
        inGameUsername: string,
        rosterHash: string,
        reportedReason: ReportReason
    ): Observable<IndexableType> {
        const newReportedPlayer: ReportedPlayerDataStore = {
            id,
            inGameUsername,
            firstReportedDate: new Date(),
            lastReportedDate: new Date(),
            rosterHashes: [rosterHash],
            reportedReasons: {
                [reportedReason]: 1,
            },
        };
        return defer(() => from(this.localDatabase.reportedPlayers.put(newReportedPlayer)));
    }

    private updateLocalReportedPlayer(
        existingReportedPlayer: ReportedPlayerDataStore,
        rosterHash: string,
        reportedReason: ReportReason
    ): Observable<IndexableType> {
        const updatedReportedPlayer: ReportedPlayerDataStore = {
            ...existingReportedPlayer,
            lastReportedDate: new Date(),
            rosterHashes: [...existingReportedPlayer.rosterHashes, rosterHash],
            reportedReasons: {
                ...existingReportedPlayer.reportedReasons,
                [reportedReason]: (existingReportedPlayer.reportedReasons[reportedReason] || 0) + 1,
            },
        };
        return defer(() => from(this.localDatabase.reportedPlayers.put(updatedReportedPlayer)));
    }
}
