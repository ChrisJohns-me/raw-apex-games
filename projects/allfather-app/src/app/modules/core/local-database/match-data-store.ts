/*
 * To prevent object stores from becoming stale,
 *  all database interfaces should be explicit (ie. no imported interfaces).
 * Dates should be stored as their primitive self (provides compression).
 */

/**
 * @interface MatchDataStore
 * @description Match data object store, saved within the local database.
 */
export interface MatchDataStore {
    matchId?: string;
    startDate?: Date;
    endDate?: Date;
    myName?: string;
    gameModeId?: string;
    mapId?: string;
    legendId?: string;
    assists?: number;
    damage?: number;
    eliminations?: number;
    knockdowns?: number;
    maxPlacement?: number;
    placement?: number;
    damageEventsHistory?: TimestampedStream<DamageEvent>;
    killfeedHistory?: TimestampedStream<MatchKillfeed>;
    locationHistory?: TimestampedStream<LocationHistory>;
    matchRoster?: Stream<MatchRosterPlayer>;
    teamRoster?: TeamRosterPlayer[];
    ultimateUsageDates?: Stream<Date>;
    weaponIdsHistory?: TimestampedStream<WeaponIds>;
}

type Stream<T> = T[];
type TimestampedStream<T> = { timestamp: number; value: T }[];

enum PlatformHardware {
    Xbox = 0,
    PlayStation = 1,
    PC = 2,
    Switch = 9,
}

enum PlatformSoftware {
    Xbox = 0,
    PlayStation = 1,
    Origin = 2,
    Steam = 7,
    Switch = 9,
}

interface MatchRosterPlayer {
    isMe: boolean;
    name: string;
    teamId: number;
    hw?: PlatformHardware;
    sw?: PlatformSoftware;
}

interface TeamRosterPlayer {
    isMe: boolean;
    legendId: string;
    name: string;
}

interface MatchKillfeed {
    victimName: string;
    attackerName?: string;
    isKnockdown?: boolean;
    isElimination?: boolean;
    weaponId?: string;
}

interface DamageEvent {
    hasShield?: boolean;
    healthDamage?: number;
    shieldDamage?: number;
    victimName: string;
    weaponId?: string;
}

interface Coordinates {
    x: number;
    y: number;
    z: number;
}

export enum LocationPhaseNum {
    Dropship,
    Dropping,
    HasLanded,
}

interface LocationHistory extends Coordinates {
    phaseNum: LocationPhaseNum;
}

interface WeaponIds {
    [id: number]: string;
}
