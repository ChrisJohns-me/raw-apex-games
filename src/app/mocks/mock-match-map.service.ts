import { MatchMap } from "@common/match/match-map";
import { BehaviorSubject } from "rxjs";

export class MockMatchMapService {
    public map$ = new BehaviorSubject<Optional<MatchMap>>(undefined);
}
