import { MatchPlayerStatsService } from "@allfather-app/app/modules/core/match/match-player-stats.service";
import { BehaviorSubject } from "rxjs";

export class MockMatchPlayerStatsService implements MockedClass<MatchPlayerStatsService> {
    public myEliminations$: MatchPlayerStatsService["myEliminations$"] = new BehaviorSubject<
        MatchPlayerStatsService["myEliminations$"]["value"]
    >(0);
    public myAssists$: MatchPlayerStatsService["myAssists$"] = new BehaviorSubject<MatchPlayerStatsService["myAssists$"]["value"]>(0);
    public myDamage$: MatchPlayerStatsService["myDamage$"] = new BehaviorSubject<MatchPlayerStatsService["myDamage$"]["value"]>(0);
    public myPlacement$: MatchPlayerStatsService["myPlacement$"] = new BehaviorSubject<MatchPlayerStatsService["myPlacement$"]["value"]>(0);
    public victory$: MatchPlayerStatsService["victory$"] = new BehaviorSubject<MatchPlayerStatsService["victory$"]["value"]>(false);
    public mySpectators$: MatchPlayerStatsService["mySpectators$"] = new BehaviorSubject<MatchPlayerStatsService["mySpectators$"]["value"]>(
        0
    );
    public myTotalDamageDealt$: MatchPlayerStatsService["myTotalDamageDealt$"] = new BehaviorSubject<
        MatchPlayerStatsService["myTotalDamageDealt$"]["value"]
    >(0);

    public start(): void {
        throw new Error("Method not implemented.");
    }
}
