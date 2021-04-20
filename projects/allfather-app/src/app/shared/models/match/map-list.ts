import { MatchMap, MatchMapId } from "./map";

export const MatchMapList: MatchMap[] = [
    new MatchMap({
        mapId: MatchMapId.KingsCanyon,
        layoutId: "MU2_REV1",
        activeDates: [
            {
                from: new Date("June 23, 2020"),
            },
        ],
        dropshipZStart: 234,
    }),
    new MatchMap({
        mapId: MatchMapId.WorldsEdge,
        layoutId: "MU1_REV1",
        activeDates: [
            {
                from: new Date("April 07, 2020"),
                to: new Date("February 1, 2021"),
            },
        ],
        dropshipZStart: -Infinity, // Unknown
    }),
    new MatchMap({
        mapId: MatchMapId.Olympus,
        layoutId: "REV1",
        activeDates: [
            {
                from: new Date("January 05, 2021"),
            },
        ],
        dropshipZStart: 119,
    }),
];
