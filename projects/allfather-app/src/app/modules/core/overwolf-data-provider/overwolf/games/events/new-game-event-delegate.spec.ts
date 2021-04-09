import { OWGameEvent } from "@allfather-app/app/modules/core/overwolf-data-provider/overwolf-types";
import { NewGameEventDelegate } from "./new-game-event-delegate";

type NewGameEvents = overwolf.games.events.NewGameEvents;
type GameEvent = overwolf.games.events.GameEvent;

describe("NewGameEventDelegate", () => {
    let sut: NewGameEventDelegate;

    // Game Events require to be an array of events, containing "name" and "data" properties
    it("filters non-event arrays not conforming to expected structure", () => {
        // Arrange
        let called = 0;
        sut = new NewGameEventDelegate();

        // Act
        const goodEvent: NewGameEvents = { events: [{ name: "match_start", data: "" }] };
        const badEvent = { badObj: "irrelevant" };
        const expected: OWGameEvent = { name: "match_start", data: null };

        sut.newGameEvent$.subscribe((actual) => {
            called++;
            expect(actual).toEqual(expected);
        });
        sut.onNewGameEvents(goodEvent as any);
        sut.onNewGameEvents(badEvent as any);

        // Assert
        expect(called).toBe(1);
    });

    // Game Events require to be an array of events, containing "name" and "data" properties
    it("filters data not conforming to expected structure", () => {
        // Arrange
        let called = 0;
        sut = new NewGameEventDelegate();

        // Act
        const goodEvent: NewGameEvents = { events: [{ name: "match_start", data: "" }] };
        const badEvent = { events: [{ badObj: "irrelevant" }] };
        const expected: OWGameEvent = { name: "match_start", data: null };

        sut.newGameEvent$.subscribe((actual) => {
            called++;
            expect(actual).toEqual(expected);
        });
        sut.onNewGameEvents(goodEvent as any);
        sut.onNewGameEvents(badEvent as any);

        // Assert
        expect(called).toBe(1);
    });
});
