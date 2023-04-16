import { OverwolfFeatureDep } from "@app/app/common/feature-status";
import { OverwolfProfileService } from "@app/app/modules/core/overwolf/overwolf-profile.service";
import { Observable, of } from "rxjs";

export class MockOverwolfProfileService implements MockedClass<OverwolfProfileService> {
    public getCurrentUser(): Observable<overwolf.profile.GetCurrentUserResult> {
        const currentUser: overwolf.profile.GetCurrentUserResult = {
            avatar: "https://avatar.overwolf.com/DefaultAvatarEnjoyWinning_m.jpg",
            channel: "website3",
            displayName: "MasterKriff",
            installerExtension: "eobgllocdoafbamifhbngdafgpcognhcpkjlokak",
            machineId: "c36c0c76-1069-4cff-8961-938e3f8c7a37",
            partnerId: 0,
            success: true,
            userId: "OW_d7e690be-759a-4633-b412-c7a26a8b3341",
            username: "masterkriff",
        };
        return of(currentUser);
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
