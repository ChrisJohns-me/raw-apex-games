import { MatchMapList } from "@allfather-app/app/common/match/map/map-list";
import { MatchMapGenericId } from "@allfather-app/app/common/match/map/map.enum";
import { supressConsoleLog } from "@allfather-app/app/common/testing-helpers";
import { fakeAsync } from "@angular/core/testing";
import { MapRotationMozambiquehereDTO } from "./map-rotation-mozambiquehere-dto";

describe("MapRotationMozambiquehereDTO", () => {
    beforeAll(() => {
        supressConsoleLog();
    });

    it("creates from JSON", fakeAsync(() => {
        // Arrange / Act
        const actual = new MapRotationMozambiquehereDTO(normalJSONResponse);

        // Assert
        expect(actual.battle_royale?.current?.start).toBe(1621951200);
        expect(actual.battle_royale?.current?.end).toBe(1621956600);
        expect(actual.battle_royale?.current?.readableDate_start).toBe("2021-05-25 14:00:00");
        expect(actual.battle_royale?.current?.readableDate_end).toBe("2021-05-25 15:30:00");
        expect(actual.battle_royale?.current?.map).toBe("Olympus");
        expect(actual.battle_royale?.current?.DurationInSecs).toBe(5400);
        expect(actual.battle_royale?.current?.DurationInMinutes).toBe(90);
        expect(actual.battle_royale?.current?.remainingSecs).toBe(586);
        expect(actual.battle_royale?.current?.remainingMins).toBe(10);
        expect(actual.battle_royale?.current?.remainingTimer).toBe("00:09:46");

        expect(actual.battle_royale?.next?.start).toBe(1621956600);
        expect(actual.battle_royale?.next?.end).toBe(1621962000);
        expect(actual.battle_royale?.next?.readableDate_start).toBe("2021-05-25 15:30:00");
        expect(actual.battle_royale?.next?.readableDate_end).toBe("2021-05-25 17:00:00");
        expect(actual.battle_royale?.next?.map).toBe("World's Edge");
        expect(actual.battle_royale?.next?.DurationInSecs).toBe(5400);
        expect(actual.battle_royale?.next?.DurationInMinutes).toBe(90);

        expect(actual.arenas?.current?.start).toBe(1621955700);
        expect(actual.arenas?.current?.end).toBe(1621956600);
        expect(actual.arenas?.current?.readableDate_start).toBe("2021-05-25 15:15:00");
        expect(actual.arenas?.current?.readableDate_end).toBe("2021-05-25 15:30:00");
        expect(actual.arenas?.current?.map).toBe("Thermal station");
        expect(actual.arenas?.current?.DurationInSecs).toBe(900);
        expect(actual.arenas?.current?.DurationInMinutes).toBe(15);
        expect(actual.arenas?.current?.remainingSecs).toBe(586);
        expect(actual.arenas?.current?.remainingMins).toBe(10);
        expect(actual.arenas?.current?.remainingTimer).toBe("00:09:46");

        expect(actual.arenas?.next?.start).toBe(1621956600);
        expect(actual.arenas?.next?.end).toBe(1621957500);
        expect(actual.arenas?.next?.readableDate_start).toBe("2021-05-25 15:30:00");
        expect(actual.arenas?.next?.readableDate_end).toBe("2021-05-25 15:45:00");
        expect(actual.arenas?.next?.map).toBe("Phase runner");
        expect(actual.arenas?.next?.DurationInSecs).toBe(900);
        expect(actual.arenas?.next?.DurationInMinutes).toBe(15);

        expect(actual.ranked?.current?.map).toBe("World's Edge");
        expect(actual.ranked?.next?.map).toBe("Olympus");
    }));

    it("can convert to MapRotation", fakeAsync(() => {
        // Arrange
        const dto = new MapRotationMozambiquehereDTO(normalJSONResponse);

        // Act
        const actual = dto.toMapRotation();

        // Assert
        expect(actual.battleRoyalePubs?.current?.startDate).toEqual(new Date(1621951200000));
        expect(actual.battleRoyalePubs?.current?.endDate).toEqual(new Date(1621956600000));
        expect(actual.battleRoyalePubs?.current?.friendlyName).toBe("Olympus");
        expect(actual.battleRoyalePubs?.current?.matchMap).toEqual(MatchMapList.find((m) => m.mapGenericId === MatchMapGenericId.Olympus));

        expect(actual.battleRoyalePubs?.next?.startDate).toEqual(new Date(1621956600000));
        expect(actual.battleRoyalePubs?.next?.endDate).toEqual(new Date(1621962000000));
        expect(actual.battleRoyalePubs?.next?.friendlyName).toBe("World's Edge");
        expect(actual.battleRoyalePubs?.next?.matchMap).toEqual(MatchMapList.find((m) => m.mapGenericId === MatchMapGenericId.WorldsEdge));

        expect(actual.arenasPubs?.current?.startDate).toEqual(new Date(1621955700000));
        expect(actual.arenasPubs?.current?.endDate).toEqual(new Date(1621956600000));
        expect(actual.arenasPubs?.current?.friendlyName).toBe("Thermal station");
        expect(actual.arenasPubs?.current?.matchMap).toEqual(MatchMapList.find((m) => m.mapGenericId === MatchMapGenericId.ThermalStation));

        expect(actual.arenasPubs?.next?.startDate).toEqual(new Date(1621956600000));
        expect(actual.arenasPubs?.next?.endDate).toEqual(new Date(1621957500000));
        expect(actual.arenasPubs?.next?.friendlyName).toBe("Phase runner");
        expect(actual.arenasPubs?.next?.matchMap).toEqual(MatchMapList.find((m) => m.mapGenericId === MatchMapGenericId.PhaseRunner));

        expect(actual.battleRoyaleRanked?.current?.friendlyName).toBe("World's Edge");
        expect(actual.battleRoyaleRanked?.next?.matchMap).toEqual(MatchMapList.find((m) => m.mapGenericId === MatchMapGenericId.Olympus));
    }));
});

const normalJSONResponse = JSON.parse(`{
    "battle_royale": {
        "current": {
            "start": 1621951200,
            "end": 1621956600,
            "readableDate_start": "2021-05-25 14:00:00",
            "readableDate_end": "2021-05-25 15:30:00",
            "map": "Olympus",
            "DurationInSecs": 5400,
            "DurationInMinutes": 90,
            "remainingSecs": 586,
            "remainingMins": 10,
            "remainingTimer": "00:09:46"
        },
        "next": {
            "start": 1621956600,
            "end": 1621962000,
            "readableDate_start": "2021-05-25 15:30:00",
            "readableDate_end": "2021-05-25 17:00:00",
            "map": "World's Edge",
            "DurationInSecs": 5400,
            "DurationInMinutes": 90
        }
    },
    "arenas": {
        "current": {
            "start": 1621955700,
            "end": 1621956600,
            "readableDate_start": "2021-05-25 15:15:00",
            "readableDate_end": "2021-05-25 15:30:00",
            "map": "Thermal station",
            "DurationInSecs": 900,
            "DurationInMinutes": 15,
            "remainingSecs": 586,
            "remainingMins": 10,
            "remainingTimer": "00:09:46"
        },
        "next": {
            "start": 1621956600,
            "end": 1621957500,
            "readableDate_start": "2021-05-25 15:30:00",
            "readableDate_end": "2021-05-25 15:45:00",
            "map": "Phase runner",
            "DurationInSecs": 900,
            "DurationInMinutes": 15
        }
    },
    "ranked": {
        "current": {
            "map": "World's Edge"
        },
        "next": {
            "map": "Olympus"
        }
    }
}`);
