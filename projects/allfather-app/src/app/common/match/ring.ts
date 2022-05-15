/** Damage is not increased UNTIL the ring BEGINS to shrink. */
export interface MatchRing {
    ringNumber: number;
    /** Time in seconds when ring starts to shrink; since match start */
    startTimeSec: number;
    /** Time in seconds when ring is closed + right before next ring shrink; since match start */
    endTimeSec: number;
    damagePerTick: number;
}
