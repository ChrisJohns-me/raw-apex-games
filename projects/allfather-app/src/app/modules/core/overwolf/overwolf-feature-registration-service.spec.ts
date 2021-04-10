import { createOverwolfSpyObj } from "@allfather-app/app/shared/testing/helpers";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { TestScheduler } from "rxjs/testing";
import { OWConfig, OW_CONFIG } from "./overwolf-config";
import { OverwolfFeatureRegistrationService, OWFeatureRegistrationStatus } from "./overwolf-feature-registration.service";

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

    it("provides registration status on success", () => {
        scheduler.run(({ cold, expectObservable }) => {
            // Arrange
            const eventsSpy = createOverwolfSpyObj<typeof overwolf.games.events>("overwolf.games.events", ["setRequiredFeatures"]);
            eventsSpy.setRequiredFeatures.and.callFake((features, callback) => {
                cold("5s -c").subscribe(() => {
                    callback({
                        success: true,
                        supportedFeatures: features,
                    });
                });
            });

            // Act
            cold("10s -b").subscribe(() => {
                sut.registerFeatures().subscribe();
            });

            // Assert
            expectObservable(sut.registrationStatus$).toBe("a 10s b 5s c", {
                a: OWFeatureRegistrationStatus.NOT_REGISTERED,
                b: OWFeatureRegistrationStatus.IN_PROGRESS,
                c: OWFeatureRegistrationStatus.SUCCESS,
            });
        });
    });
});
