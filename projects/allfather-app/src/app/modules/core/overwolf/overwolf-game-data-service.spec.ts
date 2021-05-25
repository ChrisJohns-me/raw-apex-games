import { supressConsoleLog } from "@allfather-app/app/common/testing-helpers";
import { TestBed } from "@angular/core/testing";
import { TestScheduler } from "rxjs/testing";
import { MockOverwolfFeatureRegistrationService } from "../mocks/services/mock-overwolf-feature-registration.service";
import { OverwolfFeatureRegistrationService } from "./overwolf-feature-registration.service";
import { OverwolfGameDataService } from "./overwolf-game-data.service";

describe("OverwolfGameDataService", () => {
    let sut: OverwolfGameDataService;
    let scheduler: TestScheduler;

    beforeAll(() => {
        supressConsoleLog();
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [{ provide: OverwolfFeatureRegistrationService, useClass: MockOverwolfFeatureRegistrationService }],
        });
    });

    beforeEach(() => {
        sut = TestBed.inject(OverwolfGameDataService);
    });
});
