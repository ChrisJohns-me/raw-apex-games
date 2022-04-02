import { MatchGameModeGenericId } from "../../game-mode/game-mode.enum";
import { MatchMapFriendlyName, MatchMapGenericId } from "../map.enum";
import { MatchMap } from "../match-map";

export const MatchMapListControlMaps = [
    new MatchMap({
        mapName: MatchMapFriendlyName.KingsCanyon,
        mapGenericId: MatchMapGenericId.KingsCanyon,
        mapId: "mp_rr_canyonlands_mu3",
        isBattleRoyaleMap: false,
        isArenasMap: false,
        isControlMap: true,
        isChartable: false,
        gameModeTypes: [MatchGameModeGenericId.Control],
        activeDates: [
            {
                from: new Date("Mar 2, 2022"),
            },
        ],
    }),
];
