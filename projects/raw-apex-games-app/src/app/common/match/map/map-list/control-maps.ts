import { MatchGameModeGenericId } from "../../game-mode/game-mode.enum";
import { MatchMapFriendlyName, MatchMapGenericId } from "../map.enum";
import { MatchMap } from "../match-map";

export const MatchMapListControlMaps = [
    new MatchMap({
        mapName: MatchMapFriendlyName.CausticTreatment,
        mapGenericId: MatchMapGenericId.CausticTreatment,
        mapId: "mp_rr_canyonlands_mu3_control", // TODO: Check
        isBattleRoyaleMap: false,
        isArenasMap: false,
        isControlMap: true,
        isChartable: false,
        gameModeTypes: [MatchGameModeGenericId.Control],
        activeDates: [
            {
                from: new Date("Mar 2, 2022"),
                to: new Date("Apr 12, 2022"),
            },
        ],
    }),
];
