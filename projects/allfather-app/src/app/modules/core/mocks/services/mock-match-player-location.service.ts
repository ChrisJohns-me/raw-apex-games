import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { BehaviorSubject } from "rxjs";
import { MatchPlayerLocationService } from "../../match/match-player-location.service";

export class MockMatchPlayerLocationService implements MockedClass<MatchPlayerLocationService> {
    public myLocationPhase$: MatchPlayerLocationService["myLocationPhase$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerLocationService["myLocationPhase$"]>
    >(undefined);
    public myStartingCoordinates$: MatchPlayerLocationService["myStartingCoordinates$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerLocationService["myStartingCoordinates$"]>
    >(undefined);
    public myCoordinates$: MatchPlayerLocationService["myCoordinates$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerLocationService["myCoordinates$"]>
    >(undefined);
    public myLandingCoordinates$: MatchPlayerLocationService["myLandingCoordinates$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerLocationService["myLandingCoordinates$"]>
    >(undefined);
    public myDeathCoordinates$: MatchPlayerLocationService["myDeathCoordinates$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerLocationService["myDeathCoordinates$"]>
    >(undefined);
    public myEliminationCoordinates$: MatchPlayerLocationService["myEliminationCoordinates$"] = new BehaviorSubject<
        ExtractSubjectType<MatchPlayerLocationService["myEliminationCoordinates$"]>
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
