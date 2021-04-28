import { MatchMap } from "./map";

export enum MatchMapName {
    FiringRange = "The Firing Range",
    KingsCanyon = "Kings Canyon",
    WorldsEdge = "World's Edge",
    Olympus = "Olympus",
}

export const MatchMapList: MatchMap[] = [
    new MatchMap({
        mapName: MatchMapName.FiringRange,
        mapId: "mp_rr_canyonlands_staging",
        activeDates: [
            {
                from: new Date(0),
            },
        ],
        dropshipZStart: -Infinity,
    }),
    new MatchMap({
        mapName: MatchMapName.KingsCanyon,
        mapId: "mp_rr_canyonlands_mu3",
        activeDates: [
            {
                from: new Date("June 23, 2020"),
            },
        ],
        dropshipZStart: 234,
        chartConfig: {
            imageAxisScale: {
                xStart: -373,
                xEnd: 442,
                yStart: -371,
                yEnd: 441,
            },
        },
    }),
    new MatchMap({
        mapName: MatchMapName.WorldsEdge,
        mapId: "mp_rr_desertlands_mu2",
        activeDates: [
            {
                from: new Date("April 07, 2020"),
                to: new Date("February 1, 2021"),
            },
        ],
        dropshipZStart: -Infinity, // Unknown
    }),
    new MatchMap({
        mapName: MatchMapName.Olympus,
        mapId: "mp_rr_olympus",
        activeDates: [
            {
                from: new Date("January 05, 2021"),
            },
        ],
        dropshipZStart: 119,
        chartConfig: {
            imageAxisScale: {
                xStart: -520,
                xEnd: 378,
                yStart: -421,
                yEnd: 480,
            },
        },
    }),
];
