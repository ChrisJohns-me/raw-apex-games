export interface MatchRing {
    ringNumber: number;
    /** Time in ms when ring is waiting to close */
    holdStartTime: number;
    /** Time in ms when ring is closed */
    holdEndTime: number;
    /** Time in ms when ring starts to shrink; since match start */
    shrinkStartTime: number;
    /** Time in ms when ring stops shrinking; since match start */
    shrinkEndTime: number;
    damagePerTick: number;
}
