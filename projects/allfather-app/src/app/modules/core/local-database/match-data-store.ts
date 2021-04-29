/**
 * To prevent object stores from becoming stale,
 *  all database interfaces should be explicit (ie. no imported interfaces).
 * Dates should be stored as their primitive self (provides compression).
 */
export interface MatchDataStore {
    matchId: string;
    startDate: Date;
    endDate: Date;
    myName: string;
    gameModeId: string;
    mapId: string;
    legendId: string;
    assists: number;
    damage: number;
    eliminations: number;
    knockdowns: number;
    maxPlacement: number;
    placement: number;
    damageEventsHistory: TimestampedStream<DamageEvent>;
    gameEventsHistory: TimestampedStream<string>;
    killfeedHistory: TimestampedStream<MatchKillfeed>;
    locationHistory: TimestampedStream<LocationHistory>;
    matchRoster: Stream<MatchRosterPlayer>;
    teamRoster: TeamRosterPlayer[];
    ultimateUsageDates: Stream<Date>;
    weaponIdsHistory: TimestampedStream<WeaponIds>;
}

type Stream<T> = T[];
type TimestampedStream<T> = { timestamp: number; value: T }[];

interface MatchRosterPlayer {
    isMe: boolean;
    name: string;
    teamId: number;
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
    phaseNum: LocationPhaseNum;
}

enum LocationPhaseNum {
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
