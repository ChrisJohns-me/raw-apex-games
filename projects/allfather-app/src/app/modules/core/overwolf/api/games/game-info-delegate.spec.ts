import { createOverwolfObj } from "@allfather-app/app/common/testing-helpers";
import { TestScheduler } from "rxjs/testing";
import { GameInfoDelegate } from "./game-info-delegate";

describe("GameInfoDelegate", () => {
    let sut: GameInfoDelegate;
    let scheduler: TestScheduler;

    beforeEach(() => {
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
    });

    it("stops event listeners before starting new listeners", () => {
        // Arrange
        createOverwolfObj("overwolf.games", {
            getRunningGameInfo: () => {},
            onGameInfoUpdated: {
                addListener: () => {},
                removeListener: () => {},
            },
        });
        sut = new GameInfoDelegate(123456);
        const spy = spyOn(sut, "stopEventListeners");

        // Act
        sut.startEventListeners();

        // Assert
        expect(spy).toHaveBeenCalled();
    });

    it("start/stop listener functions reference the same event function", () => {
        // Arrange

        createOverwolfObj("overwolf.games", {
            getRunningGameInfo: () => {},
            onGameInfoUpdated: {
                addListener: () => {},
                removeListener: () => {},
            },
        });

        const addListenerSpy = spyOn(overwolf.games.onGameInfoUpdated, "addListener");
        const removeListenerSpy = spyOn(overwolf.games.onGameInfoUpdated, "removeListener");
        sut = new GameInfoDelegate(123456);

        // Act
        sut.startEventListeners();

        // Assert
        expect(addListenerSpy).toHaveBeenCalled();
        expect(removeListenerSpy).toHaveBeenCalled();
    });
});
