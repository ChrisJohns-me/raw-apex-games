import { MatchGameModeType } from "@allfather-app/app/common/match/game-mode";
import { MapRotationData, MapRotationInfo } from "@allfather-app/app/common/match/map/map-rotation-data";
import { MatchMap } from "@allfather-app/app/common/match/map/match-map";
import { cleanInt } from "shared/utilities";

interface MapRotationInfoDTO {
    map: string; // "Olympus"
    start?: number; // 1621857600
    end?: number; // 1621863000
    readableDate_start?: string; // "2021-05-24 12:00:00"
    readableDate_end?: string; // "2021-05-24 13:30:00"
    DurationInSecs?: number; // 5400
    DurationInMinutes?: number; // 90
    remainingSecs?: number; // 4605
    remainingMins?: number; // 77
    remainingTimer?: string; // "01:16:45"
}

interface MapRotationIterationDTO {
    current?: MapRotationInfoDTO;
    next?: MapRotationInfoDTO;
}

export class MapRotationMozambiquehereDTO {
    public arenas?: MapRotationIterationDTO;
    public battle_royale?: MapRotationIterationDTO;
    public ranked?: MapRotationIterationDTO;

    constructor(json: unknown) {
        if (!isMapRotationMozambiquehereDTO(json)) throw Error(`Unable to create API MozambiqueHe.re Map Rotation data transfer object.`);
        this.arenas = this.sanitizeMapRotationIteration(json.arenas);
        this.battle_royale = this.sanitizeMapRotationIteration(json.battle_royale);
        this.ranked = this.sanitizeMapRotationIteration(json.ranked);
    }

    public toMapRotation(): MapRotationData {
        const convertMapRotationInfoFn = (mapIteration: MapRotationInfoDTO, gameMode?: MatchGameModeType): MapRotationInfo => {
            console.debug(`[${this.constructor.name}] Attempting to find map based on "${mapIteration.map}" (${gameMode})`);
            return {
                friendlyName: mapIteration.map,
                matchMap: MatchMap.getFromFriendlyName(mapIteration.map, gameMode),
                startDate: mapIteration.start ? new Date(mapIteration.start * 1000) : undefined,
                endDate: mapIteration.end ? new Date(mapIteration.end * 1000) : undefined,
            };
        };

        const arenasPubs: MapRotationData["arenasPubs"] = {};
        arenasPubs.current = this.arenas?.current?.map
            ? convertMapRotationInfoFn(this.arenas.current, MatchGameModeType.Arenas)
            : undefined;
        arenasPubs.next = this.arenas?.next?.map ? convertMapRotationInfoFn(this.arenas.next, MatchGameModeType.Arenas) : undefined;

        const battleRoyalePubs: MapRotationData["battleRoyalePubs"] = {};
        battleRoyalePubs.current = this.battle_royale?.current?.map
            ? convertMapRotationInfoFn(this.battle_royale.current, MatchGameModeType.BattleRoyale_Trios)
            : undefined;
        battleRoyalePubs.next = this.battle_royale?.next?.map
            ? convertMapRotationInfoFn(this.battle_royale.next, MatchGameModeType.BattleRoyale_Trios)
            : undefined;

        const battleRoyaleRanked: MapRotationData["battleRoyaleRanked"] = {};
        battleRoyaleRanked.current = this.ranked?.current?.map
            ? convertMapRotationInfoFn(this.ranked.current, MatchGameModeType.BattleRoyale_Ranked)
            : undefined;
        battleRoyaleRanked.next = this.ranked?.next?.map
            ? convertMapRotationInfoFn(this.ranked.next, MatchGameModeType.BattleRoyale_Ranked)
            : undefined;

        return new MapRotationData(arenasPubs, battleRoyalePubs, battleRoyaleRanked);
    }

    private sanitizeMapRotationIteration(input?: MapRotationIterationDTO): Optional<MapRotationIterationDTO> {
        const current: Optional<MapRotationInfoDTO> = this.sanitizeMapRotationInfo(input?.current);
        const next: Optional<MapRotationInfoDTO> = this.sanitizeMapRotationInfo(input?.next);
        return { current, next };
    }

    private sanitizeMapRotationInfo(input?: MapRotationInfoDTO): Optional<MapRotationInfoDTO> {
        if (!input?.map) return;

        return {
            map: input.map ?? "",
            start: input.start ? cleanInt(input.start) : undefined,
            end: input.end ? cleanInt(input.end) : undefined,
            readableDate_start: input.readableDate_start?.length ? this.sanitizeReadableDate(input.readableDate_start) : undefined,
            readableDate_end: input.readableDate_end?.length ? this.sanitizeReadableDate(input.readableDate_end) : undefined,
            DurationInSecs: input.DurationInSecs ? cleanInt(input.DurationInSecs) : undefined,
            DurationInMinutes: input.DurationInMinutes ? cleanInt(input.DurationInMinutes) : undefined,
            remainingSecs: input.remainingSecs ? cleanInt(input.remainingSecs) : undefined,
            remainingMins: input.remainingMins ? cleanInt(input.remainingMins) : undefined,
            remainingTimer: input.remainingTimer?.length ? this.sanitizeRemainingTimer(input.remainingTimer) : undefined,
        };
    }

    private sanitizeReadableDate(input?: string): string {
        return input?.replace(/[^\d\-: ]/gi, "") ?? "";
    }

    private sanitizeRemainingTimer(input?: string): string {
        return input?.replace(/[^\d:]/gi, "") ?? "";
    }
}

function isMapRotationMozambiquehereDTO(value: unknown): value is MapRotationMozambiquehereDTO {
    if (typeof value !== "object") return false;
    if (
        isMapRotationIteration((value as MapRotationMozambiquehereDTO).arenas) ||
        isMapRotationIteration((value as MapRotationMozambiquehereDTO).battle_royale) ||
        isMapRotationIteration((value as MapRotationMozambiquehereDTO).ranked)
    )
        return true;
    return false;
}

function isMapRotationIteration(value: unknown): value is MapRotationIterationDTO {
    if (typeof value !== "object") return false;
    if (isMapRotationInfo((value as MapRotationIterationDTO).current) || isMapRotationInfo((value as MapRotationIterationDTO).next))
        return true;
    return false;
}

function isMapRotationInfo(value: unknown): value is MapRotationInfoDTO {
    if (typeof value !== "object") return false;
    if (typeof (value as MapRotationInfoDTO).map !== "string") return false;
    return true;
}
