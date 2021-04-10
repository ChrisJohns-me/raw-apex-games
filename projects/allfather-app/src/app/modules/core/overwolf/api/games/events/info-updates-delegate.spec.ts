import { InfoUpdatesDelegate } from "@allfather-app/app/modules/core/overwolf";
import { createOverwolfObj, createOverwolfSpyObj } from "@allfather-app/app/shared/testing/helpers";
import { TestScheduler } from "rxjs/testing";

type InfoUpdates2Event = overwolf.games.events.InfoUpdates2Event;

describe("InfoUpdatesDelegate", () => {
    let sut: InfoUpdatesDelegate;
    let scheduler: TestScheduler;

    beforeEach(() => {
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });

    // InfoUpdates are required to at least contain the "info" and "feature" properties
    it("filters data not conforming to expected structure", () => {
        scheduler.run(({ expectObservable, cold }) => {
            // Arrange
            const badEvent = { badObj: {}, feature: "bad" };
            const goodEvent: InfoUpdates2Event = { info: { match_info: { me: '{"name":"Me"}' } }, feature: "roster" };
            const expected = { info: { match_info: { me: { name: "Me" } } }, feature: "roster" };
            const infoUpdatesSpyObj = createOverwolfSpyObj<typeof overwolf.games.events.onInfoUpdates2>(
                "overwolf.games.events.onInfoUpdates2",
                ["addListener", "removeListener"]
            );
            infoUpdatesSpyObj.addListener.and.callFake((callback) => {
                callback(badEvent as any);
                callback(goodEvent);
            });

            // Act
            sut = new InfoUpdatesDelegate();
            cold("-a").subscribe(() => sut.startEventListeners());

            // Assert
            expectObservable(sut.infoUpdates$).toBe("-a", { a: expected });
        });
    });

    it("stops event listeners before starting new listeners", () => {
        // Arrange
        createOverwolfObj("overwolf.games.events.onInfoUpdates2.addListener", () => {});
        sut = new InfoUpdatesDelegate();
        const spy = spyOn(sut, "stopEventListeners");

        // Act
        sut.startEventListeners();

        // Assert
        expect(spy).toHaveBeenCalled();
    });
});
