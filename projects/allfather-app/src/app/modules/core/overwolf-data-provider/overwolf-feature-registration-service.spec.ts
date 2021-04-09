import { createOverwolfSpyObj } from "@allfather-app/app/shared/testing/helpers";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { TestScheduler } from "rxjs/testing";
import { OverwolfFeatureRegistrationService } from "./overwolf-feature-registration.service";
import { OWConfig, OW_CONFIG } from "./overwolf/overwolf-config";

const mockOWConfig: OWConfig = {
    REQUIRED_FEATURES_RETRY_COUNT: 3,
    REQUIRED_FEATURES_RETRY_DELAY_MULTIPLIER: 1000,
    REQUIRED_FEATURES: ["test1", "test2"],
    HEALTHCHECK_TIME: 0,
    APEXLEGENDSCLASSID: 0,
};

describe("OverwolfFeatureRegistrationService", () => {
    let sut: OverwolfFeatureRegistrationService;
    let scheduler: TestScheduler;

    beforeEach(async () => {
        jasmine.clock().uninstall();
        jasmine.clock().install();
        await TestBed.configureTestingModule({
            providers: [{ provide: OW_CONFIG, useValue: mockOWConfig }],
        });
    });

    beforeEach(() => {
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
        sut = TestBed.inject(OverwolfFeatureRegistrationService);
    });

    it("calls Overwolf's 'setRequiredFeatures'", () => {
        // Arrange
        createOverwolfSpyObj<typeof overwolf.games.events>("overwolf.games.events", ["setRequiredFeatures"]);

        // Act
        sut.registerFeatures().subscribe();

        // Assert
        expect(overwolf.games.events.setRequiredFeatures).toHaveBeenCalled();
    });

    it("retries at least 3 times after failure", fakeAsync(() => {
        // Arrange
        const eventsSpy = createOverwolfSpyObj<typeof overwolf.games.events>("overwolf.games.events", ["setRequiredFeatures"]);
        eventsSpy.setRequiredFeatures.and.throwError("Mocked error");

        // Act
        sut.registerFeatures().subscribe();
        tick(60000);

        // Assert
        expect(eventsSpy.setRequiredFeatures).toHaveBeenCalledTimes(3);
    }));

    // it("provides registration status on success", (done) => {
    //     scheduler.run(({ flush, cold, hot, expectObservable }) => {
    //         // Arrange
    //         const eventsSpy = createOverwolfSpyObj<typeof overwolf.games.events>("overwolf.games.events", ["setRequiredFeatures"]);
    //         eventsSpy.setRequiredFeatures.and.callFake((features, callback) => {
    //             callback({
    //                 success: true,
    //                 supportedFeatures: features,
    //             });
    //             done();
    //         });

    //         // Act
    //         cold("-----a").subscribe(() => {
    //             sut.registerFeatures().subscribe();
    //         });

    //         // Assert
    //         expectObservable(sut.registrationStatus$).toBe("a----bc", {
    //             a: OWFeatureRegistrationStatus.NOT_REGISTERED,
    //             b: OWFeatureRegistrationStatus.IN_PROGRESS,
    //             c: OWFeatureRegistrationStatus.SUCCESS,
    //         });
    //     });
    // });
});
