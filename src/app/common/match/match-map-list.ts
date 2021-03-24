import { MatchMap, MatchMapId } from "./match-map";

export const MatchMapList: MatchMap[] = [
    new MatchMap({
        id: MatchMapId.KingsCanyon,
        layoutId: "MU2_REV1",
        activeDates: [
            {
                from: new Date("June 23, 2020"),
            },
        ],
        dropshipZStart: 234,
    }),
    new MatchMap({
        id: MatchMapId.WorldsEdge,
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
        id: MatchMapId.Olympus,
        layoutId: "REV1",
        activeDates: [
            {
                from: new Date("January 05, 2021"),
            },
        ],
        dropshipZStart: 119,
    }),
];
