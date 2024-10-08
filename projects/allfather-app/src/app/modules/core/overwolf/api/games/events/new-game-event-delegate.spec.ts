import { createOverwolfObj, createOverwolfSpyObj, supressConsoleLog } from "@allfather-app/app/common/testing-helpers";
import { TestScheduler } from "rxjs/testing";
import { OWGameEvent } from "../../../types/overwolf-types";
import { NewGameEventDelegate } from "./new-game-event-delegate";

type NewGameEvents = overwolf.games.events.NewGameEvents;
type GameEvent = overwolf.games.events.GameEvent;

describe("NewGameEventDelegate", () => {
    let scheduler: TestScheduler;
    let sut: NewGameEventDelegate;

    beforeAll(() => {
        supressConsoleLog();
    });

    beforeEach(() => {
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });

    // Game Events require to be an array of events, containing "name" and "data" properties
    it("filters non-event arrays not conforming to expected structure", () => {
        scheduler.run(({ expectObservable, cold }) => {
            // Arrange
            const badEvent = { badObj: "irrelevant" };
            const goodEvent: NewGameEvents = { events: [{ name: "match_start", data: "" }] };
            const expected: OWGameEvent = { name: "match_start", data: null };
            const onNewEventsSpyObj = createOverwolfSpyObj<typeof overwolf.games.events.onNewEvents>("overwolf.games.events.onNewEvents", [
                "addListener",
                "removeListener",
            ]);
            onNewEventsSpyObj.addListener.and.callFake((callback) => {
                callback(badEvent as any);
                callback(goodEvent);
            });

            // Act
            sut = new NewGameEventDelegate();
            cold("-a").subscribe(() => sut.startEventListeners());

            // Assert
            expectObservable(sut.newGameEvent$).toBe("-a", { a: expected });
        });
    });

    // Game Events require to be an array of events, containing "name" and "data" properties
    it("filters data not conforming to expected structure", () => {
        scheduler.run(({ expectObservable, cold }) => {
            // Arrange
            const badEvent = { events: [{ badObj: "irrelevant" }] };
            const goodEvent: NewGameEvents = { events: [{ name: "match_start", data: "" }] };
            const expected: OWGameEvent = { name: "match_start", data: null };
            const onNewEventsSpyObj = createOverwolfSpyObj<typeof overwolf.games.events.onNewEvents>("overwolf.games.events.onNewEvents", [
                "addListener",
                "removeListener",
            ]);
            onNewEventsSpyObj.addListener.and.callFake((callback) => {
                callback(badEvent as any);
                callback(goodEvent);
            });

            // Act
            sut = new NewGameEventDelegate();
            cold("-a").subscribe(() => sut.startEventListeners());

            // Assert
            expectObservable(sut.newGameEvent$).toBe("-a", { a: expected });
        });
    });

    it("stops event listeners before starting new listeners", () => {
        // Arrange
        createOverwolfObj("overwolf.games.events.onNewEvents.addListener", () => {});
        sut = new NewGameEventDelegate();
        const spy = spyOn(sut, "stopEventListeners");

        // Act
        sut.startEventListeners();

        // Assert
        expect(spy).toHaveBeenCalled();
    });
});
