export interface DamageAction {
    timestamp: Date;
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

export class DamageRoster {
    public damageActions: RosterDamageActions = {};

    public get activePlayerDamageInflicted(): number {
        return this.getPlayerDamageInflicted(this.activePlayerName);
    }
    public get activePlayerKnockdownsInflicted(): number {
        return this.getPlayerKnockdownsInflicted(this.activePlayerName);
    }
    public get activePlayerEliminationsInflicted(): number {
        return this.getPlayerEliminationsInflicted(this.activePlayerName);
    }
    public get activePlayerHeadshotsInflicted(): number {
        return this.getPlayerHeadshotsInflicted(this.activePlayerName);
    }

    constructor(public activePlayerName: string = "") {}

    public inflictPlayerDamage(data: {
        attackerName?: string;
        victimName: string;
        hasShield?: boolean;
        isHeadshot?: boolean;
        shieldDamage?: number;
        healthDamage?: number;
    }): void {
        if (!this.damageActions[data.victimName]) this.damageActions[data.victimName] = [];
        this.damageActions[data.victimName].push({
            timestamp: new Date(),
            attackerName: data.attackerName ?? this.activePlayerName,
            hasShield: data.hasShield,
            isHeadshot: data.isHeadshot,
            shieldDamage: data.shieldDamage,
            healthDamage: data.healthDamage,
        });
    }

    public knockdownPlayer(victimName: string, attackerName?: string): void {
        if (!this.damageActions[victimName]) this.damageActions[victimName] = [];
        this.damageActions[victimName].push({
            timestamp: new Date(),
            attackerName: attackerName,
            isKnocked: true,
        });
    }

    public eliminatePlayer(victimName: string, attackerName?: string): void {
        if (!this.damageActions[victimName]) this.damageActions[victimName] = [];
        this.damageActions[victimName].push({
            timestamp: new Date(),
            attackerName: attackerName,
            isEliminated: true,
        });
    }

    //#region Player Stats
    public getPlayerDamageInflicted(playerName: string): number {
        const callbackFn = (action: DamageAction): number => (action.shieldDamage ?? 0) + (action.healthDamage ?? 0);
        return this.damageActionReduce(playerName, callbackFn);
    }

    public getPlayerKnockdownsInflicted(playerName: string): number {
        const callbackFn = (action: DamageAction): number => (action.isKnocked ? 1 : 0);
        return this.damageActionReduce(playerName, callbackFn);
    }

    public getPlayerEliminationsInflicted(playerName: string): number {
        const callbackFn = (action: DamageAction): number => (action.isEliminated ? 1 : 0);
        return this.damageActionReduce(playerName, callbackFn);
    }

    public getPlayerHeadshotsInflicted(playerName: string): number {
        const callbackFn = (action: DamageAction): number => (action.isHeadshot ? 1 : 0);
        return this.damageActionReduce(playerName, callbackFn);
    }

    /**
     * Calls the specified callback function for all of the `damageActions`.
     * The return value of the callback function is totaled.
     * @param {string} attackerName Attacking player to use as the filter.
     * @param {Function} callbackFn Callback function that is called, and should return the needed value.
     * @returns {number} Totaled result
     */
    private damageActionReduce(attackerName: string, callbackFn: (action: DamageAction) => number): number {
        let value = 0;
        Object.values(this.damageActions).forEach((victimActions) => {
            victimActions.filter((v) => v.attackerName === attackerName).forEach((v) => (value += callbackFn(v)));
        });
        return value;
    }
    //#endregion
}
