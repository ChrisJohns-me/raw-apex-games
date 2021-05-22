import { MatchMapFriendlyName, MatchMapGenericId } from "./map.enum";
import { MatchMap } from "./match-map";

export const MatchMapList: MatchMap[] = [
    new MatchMap({
        mapName: MatchMapFriendlyName.FiringRange,
        genericId: MatchMapGenericId.FiringRange,
        mapId: "mp_rr_canyonlands_staging",
        activeDates: [
            {
                from: new Date(0),
            },
        ],
        dropshipZStart: -Infinity,
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.KingsCanyon,
        genericId: MatchMapGenericId.KingsCanyon,
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
        mapName: MatchMapFriendlyName.WorldsEdge,
        genericId: MatchMapGenericId.WorldsEdge,
        mapId: "mp_rr_desertlands_mu2",
        activeDates: [
            {
                from: new Date("May 04, 2021"),
            },
        ],
        dropshipZStart: 146,
    }),
    new MatchMap({
        mapName: MatchMapFriendlyName.Olympus,
        genericId: MatchMapGenericId.Olympus,
        mapId: "mp_rr_olympus",
        activeDates: [
            {
                from: new Date("January 04, 2021"),
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
