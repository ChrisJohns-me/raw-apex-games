export interface DamageAction {
    timestamp: Date;
    victimName: string;
    attackerName?: string;
    hasShield?: boolean;
    isHeadshot?: boolean;
    shieldDamage?: number;
    healthDamage?: number;
    isKnocked?: boolean;
    isEliminated?: boolean;
}

export interface RosterDamageActions {
    [victimName: string]: DamageAction[];
}

/**
 * Container for all outgoing damage events and their raw values,
 *  with a specific player in mind (typically the local player).
 */
export class DamageRoster {
    public damageActions: RosterDamageActions = {};

    /**
     * Damage amount does not take into consideration victim's HP, only the raw inflicted amount.
     *  eg. A victim's HP at 1 and a damage amount of 20 is still recorded at 20 and not 1; even though the
     *  damage required to knockdown the victim is 1.
     * The contained damage amount will then appear to be inflated.
     */
    public get activePlayerDamageInflictedSum(): number {
        return this.getPlayerDamageInflictedTotal(this.activePlayerName);
    }
    public get activePlayerKnockdownsInflictedSum(): number {
        return this.getPlayerKnockdownsInflictedTotal(this.activePlayerName);
    }
    /**
     * Does not take into consideration of victims still spectating and still connected to the match.
     */
    public get activePlayerEliminationsInflictedSum(): number {
        return this.getPlayerEliminationsInflictedTotal(this.activePlayerName);
    }
    public get activePlayerHeadshotsInflictedSum(): number {
        return this.getPlayerHeadshotsInflictedTotal(this.activePlayerName);
    }

    constructor(public activePlayerName: string = "") {}

    public inflictPlayerDamage({
        attackerName,
        victimName,
        hasShield,
        isHeadshot,
        shieldDamage,
        healthDamage,
    }: {
        attackerName?: string;
        victimName: string;
        hasShield?: boolean;
        isHeadshot?: boolean;
        shieldDamage?: number;
        healthDamage?: number;
    }): void {
        if (!this.damageActions[victimName]) this.damageActions[victimName] = [];
        this.damageActions[victimName].push({
            timestamp: new Date(),
            attackerName: attackerName ?? this.activePlayerName,
            victimName: victimName,
            hasShield: hasShield,
            isHeadshot: isHeadshot,
            shieldDamage: parseInt(String(shieldDamage)),
            healthDamage: parseInt(String(healthDamage)),
        });
    }

    public knockdownPlayer(victimName: string, attackerName?: string): void {
        if (!this.damageActions[victimName]) this.damageActions[victimName] = [];
        this.damageActions[victimName].push({
            timestamp: new Date(),
            attackerName: attackerName,
            victimName: victimName,
            isKnocked: true,
        });
    }

    public eliminatePlayer(victimName: string, attackerName?: string): void {
        if (!this.damageActions[victimName]) this.damageActions[victimName] = [];
        this.damageActions[victimName].push({
            timestamp: new Date(),
            attackerName: attackerName,
            victimName: victimName,
            isEliminated: true,
        });
    }

    //#region Player Stats
    private getPlayerDamageInflictedTotal(playerName: string): number {
        const callbackFn = (action: DamageAction): number => (action.shieldDamage ?? 0) + (action.healthDamage ?? 0);
        return this.damageActionReduce(playerName, callbackFn);
    }

    private getPlayerKnockdownsInflictedTotal(playerName: string): number {
        const callbackFn = (action: DamageAction): number => (action.isKnocked ? 1 : 0);
        return this.damageActionReduce(playerName, callbackFn);
    }

    private getPlayerEliminationsInflictedTotal(playerName: string): number {
        const callbackFn = (action: DamageAction): number => (action.isEliminated ? 1 : 0);
        return this.damageActionReduce(playerName, callbackFn);
    }

    private getPlayerHeadshotsInflictedTotal(playerName: string): number {
        const callbackFn = (action: DamageAction): number => (action.isHeadshot ? 1 : 0);
        return this.damageActionReduce(playerName, callbackFn);
    }

    /**
     * Calls the specified callback function for all of the `damageActions`.
     * The return value of the callback function is totaled.
     * @param {string} attackerName Attacking player to use as the filter.
     * @param {Function} callbackFn Callback function that is called, and should return the needed value.
     * @returns {number} Totaled result.
     */
    private damageActionReduce(attackerName: string, callbackFn: (action: DamageAction) => number): number {
        let value = 0;
        Object.values(this.damageActions).forEach((victimActions) => {
            victimActions
                .filter((v) => v.attackerName === attackerName)
                .forEach((v) => {
                    return (value += parseInt(String(callbackFn(v))));
                });
        });
        return value;
    }
    //#endregion
}
