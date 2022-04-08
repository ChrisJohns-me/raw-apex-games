import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { ArenasScoreboard } from "@allfather-app/app/common/match/arenas-scoreboard";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { BehaviorSubject, Subject } from "rxjs";
import { MatchArenasScoreboardService } from "../../match/match-arenas-scoreboard.service";

export class MockMatchArenasScoreboardService implements MockedClass<MatchArenasScoreboardService> {
    public currentRoundNum$: MatchArenasScoreboardService["currentRoundNum$"] = new BehaviorSubject<
        ExtractSubjectType<MatchArenasScoreboardService["currentRoundNum$"]>
    >(0);
    public roundLoseEvent$: MatchArenasScoreboardService["roundLoseEvent$"] = new Subject<
        ExtractSubjectType<MatchArenasScoreboardService["roundLoseEvent$"]>
    >();
    public roundWinEvent$: MatchArenasScoreboardService["roundWinEvent$"] = new Subject<
        ExtractSubjectType<MatchArenasScoreboardService["roundWinEvent$"]>
    >();
    public matchLoseEvent$: MatchArenasScoreboardService["matchLoseEvent$"] = new Subject<
        ExtractSubjectType<MatchArenasScoreboardService["matchLoseEvent$"]>
    >();
    public matchWinEvent$: MatchArenasScoreboardService["matchWinEvent$"] = new Subject<
        ExtractSubjectType<MatchArenasScoreboardService["matchWinEvent$"]>
    >();
    public scoreboard$: MatchArenasScoreboardService["scoreboard$"] = new BehaviorSubject<
        ExtractSubjectType<MatchArenasScoreboardService["scoreboard$"]>
    >(new ArenasScoreboard());

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
