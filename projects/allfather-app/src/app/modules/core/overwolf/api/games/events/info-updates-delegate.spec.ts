import { createOverwolfObj } from "@allfather-app/app/common/testing-helpers";
import { InfoUpdatesDelegate } from "@allfather-app/app/modules/core/overwolf";
import { TestScheduler } from "rxjs/testing";

type InfoUpdates2Event = overwolf.games.events.InfoUpdates2Event;

describe("InfoUpdatesDelegate", () => {
    let sut: InfoUpdatesDelegate;
    let scheduler: TestScheduler;

    beforeEach(() => {
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });

        createOverwolfObj("overwolf.games", {
            events: {
                getInfo: () => {},
                onInfoUpdates2: {
                    addListener: () => {},
                    removeListener: () => {},
                },
            },
        });
    });

    // InfoUpdates are required to at least contain the "info" and "feature" properties
    it("filters data not conforming to expected structure", () => {
        scheduler.run(({ expectObservable, cold }) => {
            // Arrange
            const badEvent = { badObj: {}, feature: "bad" };
            const goodEvent: InfoUpdates2Event = { info: { me: { name: "Me" } }, feature: "me" };
            const expected = { info: { me: { name: "Me" } }, feature: "me" };
            const infoUpdatesSpy = spyOn(overwolf.games.events.onInfoUpdates2, "addListener");
            infoUpdatesSpy.and.callFake((callback) => {
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
        sut = new InfoUpdatesDelegate();
        const spy = spyOn(sut, "stopEventListeners");

        // Act
        sut.startEventListeners();

        // Assert
        expect(spy).toHaveBeenCalled();
    });

    it("prepopulates data from Overwolf's 'getInfo'", () => {
        scheduler.run(({ expectObservable, cold }) => {
            // Arrange
            const infoUpdate: overwolf.gep.ApexLegends.InfoUpdates2 = {
                me: { name: "Me" },
            };
            const getInfoData: overwolf.games.events.GetInfoResult<any> = {
                res: infoUpdate,
                success: true,
            };
            const expected = { info: { me: { name: "Me" } }, feature: "me" };
            const getInfoSpy = spyOn(overwolf.games.events, "getInfo");
            getInfoSpy.and.callFake((callback) => {
                callback(getInfoData);
            });

            // Act
            sut = new InfoUpdatesDelegate();
            cold("-a--").subscribe(() => {
                sut.startEventListeners();
            });

            // Assert
            expectObservable(sut.infoUpdates$).toBe("-a--", { a: expected });
        });
    });
});
