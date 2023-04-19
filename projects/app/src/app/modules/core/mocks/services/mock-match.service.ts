import { IndexableType } from "dexie";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { ExtractSubjectType } from "../../../../../../../../common/types/rxjs-utilities";
import { OverwolfFeatureDep } from "../../../../common/feature-status";
import { MatchState } from "../../../../common/match/state";
import { MatchDataStore } from "../../local-database/match-data-store";
import { MatchService } from "../../match/match.service";

export class MockMatchService implements MockedClass<MatchService> {
    public matchId$: MatchService["matchId$"] = new BehaviorSubject<ExtractSubjectType<MatchService["matchId$"]>>("");
    public startedEvent$: MatchService["startedEvent$"] = new Subject();
    public endedEvent$: MatchService["endedEvent$"] = new Subject();
    public state$: MatchService["state$"] = new BehaviorSubject<ExtractSubjectType<MatchService["state$"]>>({
        state: MatchState.Inactive,
        matchId: "test",
    });
    public gameMode$: MatchService["gameMode$"] = new BehaviorSubject<ExtractSubjectType<MatchService["gameMode$"]>>(undefined);
    public get isActive(): MatchService["isActive"] {
        return this.state$.value.state === MatchState.Active;
    }
    public onMatchDataStoreChanged$: MatchService["onMatchDataStoreChanged$"] = new BehaviorSubject<
        ExtractSubjectType<MatchService["onMatchDataStoreChanged$"]>
    >("");

    public storeMatchData$(matchData: MatchDataStore): Observable<IndexableType> {
        return of();
    }

    public getMatchDataByMatchId$(matchId: string): Observable<Optional<MatchDataStore>> {
        return of();
    }

    public getMatchDataByLegendId$(legendId: string, limit?: number): Observable<MatchDataStore[]> {
        return of();
    }

    public getAllMatchData$(limit?: number): Observable<MatchDataStore[]> {
        return of();
    }

    public getLatestMatchData$(): Observable<Optional<MatchDataStore>> {
        return of();
    }

    public getLatestMatchDataByPlayerName$(playerName: string): Observable<Optional<MatchDataStore>> {
        return of();
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
