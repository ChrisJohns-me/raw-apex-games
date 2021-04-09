import { MatchPlayerLocationService } from "@allfather-app/app/modules/core/match/match-player-location.service";
import { BehaviorSubject } from "rxjs";

export class MockMatchPlayerLocationService implements MockedClass<MatchPlayerLocationService> {
    public myCoordinates$: MatchPlayerLocationService["myCoordinates$"] = new BehaviorSubject<
        MatchPlayerLocationService["myCoordinates$"]["value"]
    >(undefined);
    public myLocationPhase$: MatchPlayerLocationService["myLocationPhase$"] = new BehaviorSubject<
        MatchPlayerLocationService["myLocationPhase$"]["value"]
    >(undefined);
    public myStartingCoordinates$: MatchPlayerLocationService["myStartingCoordinates$"] = new BehaviorSubject<
        MatchPlayerLocationService["myStartingCoordinates$"]["value"]
    >(undefined);
    public myLandingCoordinates$: MatchPlayerLocationService["myLandingCoordinates$"] = new BehaviorSubject<
        MatchPlayerLocationService["myLandingCoordinates$"]["value"]
    >(undefined);
    public myEndingCoordinates$: MatchPlayerLocationService["myEndingCoordinates$"] = new BehaviorSubject<
        MatchPlayerLocationService["myEndingCoordinates$"]["value"]
    >(undefined);

    public start(): void {
        throw new Error("Method not implemented.");
    }
}
