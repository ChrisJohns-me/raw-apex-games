import { MatchMapService } from "@allfather-app/app/modules/core/match/match-map.service";
import { BehaviorSubject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";

export class MockMatchMapService implements MockedClass<MatchMapService> {
    public map$: MatchMapService["map$"] = new BehaviorSubject<ExtractSubjectType<MatchMapService["map$"]>>(undefined);

    public init(): void {
        throw new Error("Method not implemented.");
    }
}
