import { MatchLocationPhase } from "@shared/models/match/match-location";
import { MatchMapCoordinates } from "@shared/models/match/match-map-coordinates";
import { BehaviorSubject } from "rxjs";

export class MockMatchPlayerLocationService {
    public myCoordinates$ = new BehaviorSubject<Optional<MatchMapCoordinates>>(undefined);
    public myLocationPhase$ = new BehaviorSubject<Optional<MatchLocationPhase>>(undefined);
    public myStartingCoordinates$ = new BehaviorSubject<Optional<MatchMapCoordinates>>(undefined);
    public myLandingCoordinates$ = new BehaviorSubject<Optional<MatchMapCoordinates>>(undefined);
    public myEndingCoordinates$ = new BehaviorSubject<Optional<MatchMapCoordinates>>(undefined);
}
