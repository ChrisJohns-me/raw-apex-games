import { GameMap, GameMapId } from "./game-map";

export const GameMapList: GameMap[] = [
    new GameMap(GameMapId.KingsCanyon, {
        layoutId: "MU2_REV1",
        activeDates: [
            {
                from: new Date("June 23, 2020"),
            },
        ],
        dropshipZStart: 234,
    }),
    new GameMap(GameMapId.WorldsEdge, {
        layoutId: "MU1_REV1",
        activeDates: [
            {
                from: new Date("April 07, 2020"),
                to: new Date("February 1, 2021"),
            },
        ],
        dropshipZStart: -Infinity, // Unknown
    }),
    new GameMap(GameMapId.Olympus, {
        layoutId: "REV1",
        activeDates: [
            {
                from: new Date("January 05, 2021"),
            },
        ],
        dropshipZStart: 119,
    }),
];
