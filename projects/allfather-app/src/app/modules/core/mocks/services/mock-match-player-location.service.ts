import { MatchPlayerLocationService } from "@allfather-app/app/modules/core/match/match-player-location.service";
import { BehaviorSubject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";

export class MockMatchPlayerLocationService implements MockedClass<MatchPlayerLocationService> {
    public myCoordinates$: MatchPlayerLocationService["myCoordinates$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerLocationService["myCoordinates$"]>
    >(undefined);
    public myLocationPhase$: MatchPlayerLocationService["myLocationPhase$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerLocationService["myLocationPhase$"]>
    >(undefined);
    public myStartingCoordinates$: MatchPlayerLocationService["myStartingCoordinates$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerLocationService["myStartingCoordinates$"]>
    >(undefined);
    public myLandingCoordinates$: MatchPlayerLocationService["myLandingCoordinates$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerLocationService["myLandingCoordinates$"]>
    >(undefined);
    public myEndingCoordinates$: MatchPlayerLocationService["myEndingCoordinates$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerLocationService["myEndingCoordinates$"]>
    >(undefined);

    public init(): void {
        throw new Error("Method not implemented.");
    }
}
