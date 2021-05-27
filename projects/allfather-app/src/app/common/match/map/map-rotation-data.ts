import { MatchGameModeType } from "../game-mode";
import { MatchMap } from "./match-map";

export interface MapRotationInfo {
    friendlyName: string;
    matchMap?: MatchMap;
    startDate?: Date;
    endDate?: Date;
}

export interface MapRotationIteration {
    current?: MapRotationInfo;
    next?: MapRotationInfo;
}

export class MapRotationData {
    constructor(
        public arenasPubs?: MapRotationIteration,
        public battleRoyalePubs?: MapRotationIteration,
        public battleRoyaleRanked?: MapRotationIteration
    ) {}

    /**
     * Gets the closest upcoming start date from the given date.
     * @param gameModeType if empty, checks all game modes
     * @returns undefined if none available
     */
    public static getSoonestMapRotationInfo(
        mapRotationData: MapRotationData,
        gameModeType?: MatchGameModeType,
        baseDate: Date = new Date()
    ): Optional<MapRotationInfo> {
        let earliestMapInfo: Optional<MapRotationInfo>;
        let filteredMapRotation: MapRotationData;
        if (gameModeType === MatchGameModeType.Arenas) {
            filteredMapRotation = { arenasPubs: mapRotationData.arenasPubs };
        } else if (gameModeType === MatchGameModeType.BattleRoyale_Trios || gameModeType === MatchGameModeType.BattleRoyale_Duos) {
            filteredMapRotation = { battleRoyalePubs: mapRotationData.battleRoyalePubs };
        } else if (gameModeType === MatchGameModeType.BattleRoyale_Ranked) {
            filteredMapRotation = { battleRoyaleRanked: mapRotationData.battleRoyaleRanked };
        } else {
            filteredMapRotation = mapRotationData;
        }

        Object.values(filteredMapRotation)
            .filter((mapIter) => !!mapIter)
            .flatMap((mapIter: MapRotationIteration) => [mapIter!.current!, mapIter!.next!])
            .forEach((mapInfo) => {
                if (!mapInfo.startDate) return;
                if (!earliestMapInfo) earliestMapInfo = mapInfo;
                if (earliestMapInfo.startDate && mapInfo.startDate < earliestMapInfo.startDate && earliestMapInfo.startDate > baseDate) {
                    earliestMapInfo = mapInfo;
                }
            });

        return earliestMapInfo;
    }
}
