import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { MatchPlayerStatsService } from "@allfather-app/app/modules/core/match/match-player-stats.service";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { BehaviorSubject } from "rxjs";

export class MockMatchPlayerStatsService implements MockedClass<MatchPlayerStatsService> {
    public myEliminations$: MatchPlayerStatsService["myEliminations$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerStatsService["myEliminations$"]>
    >(0);
    public myDeaths$: BehaviorSubject<number> = new BehaviorSubject<ExtractSubjectType<MatchPlayerStatsService["myDeaths$"]>>(0);
    public myAssists$: MatchPlayerStatsService["myAssists$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerStatsService["myAssists$"]>
    >(0);
    public myDamage$: MatchPlayerStatsService["myDamage$"] = new BehaviorSubject<ExtractSubjectType<MatchPlayerStatsService["myDamage$"]>>(
        0
    );
    public myPlacement$: MatchPlayerStatsService["myPlacement$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerStatsService["myPlacement$"]>
    >(0);
    public victory$: MatchPlayerStatsService["victory$"] = new BehaviorSubject<ExtractSubjectType<MatchPlayerStatsService["victory$"]>>(
        false
    );
    public mySpectators$: MatchPlayerStatsService["mySpectators$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerStatsService["mySpectators$"]>
    >(0);
    public myTotalDamageDealt$: MatchPlayerStatsService["myTotalDamageDealt$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerStatsService["myTotalDamageDealt$"]>
    >(0);
    public myKnockdowns$: MatchPlayerStatsService["myKnockdowns$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerStatsService["myKnockdowns$"]>
    >(0);

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
