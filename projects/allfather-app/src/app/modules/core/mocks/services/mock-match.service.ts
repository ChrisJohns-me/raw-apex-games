import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MatchGameModeType } from "@allfather-app/app/shared/models/match/game-mode";
import { MatchState } from "@allfather-app/app/shared/models/match/state";
import { IndexableType } from "dexie";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";
import { MatchDataStore } from "../../local-database/match-data-store";

export class MockMatchService implements MockedClass<MatchService> {
    public matchId$: MatchService["matchId$"] = new BehaviorSubject<ExtractSubjectType<MatchService["matchId$"]>>("");
    public startedEvent$: MatchService["startedEvent$"] = new Subject();
    public endedEvent$: MatchService["endedEvent$"] = new Subject();
    public state$: MatchService["state$"] = new BehaviorSubject<ExtractSubjectType<MatchService["state$"]>>({
        state: MatchState.Inactive,
        matchId: "test",
    });
    public gameMode$: MatchService["gameMode$"] = new BehaviorSubject<ExtractSubjectType<MatchService["gameMode$"]>>({
        gameModeId: "",
        baseType: MatchGameModeType.RANKED,
    });
    public get isActive(): MatchService["isActive"] {
        return this.state$.value.state === MatchState.Active;
    }

    public init(): void {
        throw new Error("Method not implemented.");
    }

    public storeMatchData(matchData: MatchDataStore): Observable<IndexableType> {
        return of();
    }

    public getMatchDataByMatchId(matchId: string): Observable<MatchDataStore | undefined> {
        return of();
    }

    public getAllMatchData(): Observable<MatchDataStore[]> {
        return of();
    }
}
