import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { BehaviorSubject } from "rxjs";
import { MatchPlayerLocationService } from "../../match/match-player-location.service";

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

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
