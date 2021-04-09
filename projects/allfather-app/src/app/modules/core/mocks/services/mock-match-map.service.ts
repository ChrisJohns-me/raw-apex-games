import { MatchMapService } from "@allfather-app/app/modules/core/match/match-map.service";
import { BehaviorSubject } from "rxjs";

export class MockMatchMapService implements MockedClass<MatchMapService> {
    public map$: MatchMapService["map$"] = new BehaviorSubject<MatchMapService["map$"]["value"]>(undefined);

    public start(): void {
        throw new Error("Method not implemented.");
    }
}
