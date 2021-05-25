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

export class MapRotation {
    constructor(
        public arenasPubs?: MapRotationIteration,
        public battleRoyalePubs?: MapRotationIteration,
        public battleRoyaleRanked?: MapRotationIteration
    ) {}
}
