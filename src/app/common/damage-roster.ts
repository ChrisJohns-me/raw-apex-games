import { Player } from "./player";

export interface DamageAction {
    timestamp: Date;
    victim: Player;
    attacker?: Player;
    hasShield?: boolean;
    isHeadshot?: boolean;
    shieldDamage?: number;
    healthDamage?: number;
    isKnocked?: boolean;
    isEliminated?: boolean;
}

/**
 * Container for all outgoing damage events and their raw values,
 *  with a specific player in mind (typically the local player).
 */
export class DamageRoster {
    public damageActions: DamageAction[] = [];

    /** Damage inflicted from the `primaryAttacker` */
    public get damageInflictedSum(): number {
        return this.getDamageInflictedSumByPlayer(this.primaryAttacker);
    }
    /** Knockdowns inflicted from the `primaryAttacker` */
    public get knockdownsInflictedSum(): number {
        return this.getKnockdownsInflictedSumByPlayer(this.primaryAttacker);
    }
    /**
     * Eliminations inflicted from the `primaryAttacker`
     */
    public get eliminationsInflictedSum(): number {
        return this.getEliminationsInflictedSumByPlayer(this.primaryAttacker);
    }
    /** Headshots inflicted by the `primaryAttacker` */
    public get headshotsInflictedSum(): number {
        return this.getHeadshotsInflictedSumPlayer(this.primaryAttacker);
    }

    constructor(public primaryAttacker: Player = new Player()) {}

    /** @returns {DamageAction} Action that was added to damageActions */
    public inflictPlayerDamage({
        attacker,
        victim,
        hasShield,
        isHeadshot,
        shieldDamage,
        healthDamage,
    }: Omit<DamageAction, "timestamp">): DamageAction {
        const damageAction: DamageAction = {
            timestamp: new Date(),
            attacker: attacker ?? this.primaryAttacker,
            victim: victim,
            hasShield: hasShield,
            isHeadshot: isHeadshot,
            shieldDamage: parseInt(String(shieldDamage)),
            healthDamage: parseInt(String(healthDamage)),
        };
        this.damageActions.push(damageAction);
        return damageAction;
    }

    /** @returns {DamageAction} Action that was added to damageActions */
    public knockdownPlayer(victim: Player, attacker?: Player): DamageAction {
        const damageAction: DamageAction = {
            timestamp: new Date(),
            attacker: attacker,
            victim: victim,
            isKnocked: true,
        };
        this.damageActions.push(damageAction);
        return damageAction;
    }

    /** @returns {DamageAction} Action that was added to damageActions */
    public eliminatePlayer(victim: Player, attacker?: Player): DamageAction {
        const damageAction: DamageAction = {
            timestamp: new Date(),
            attacker: attacker,
            victim: victim,
            isEliminated: true,
        };
        this.damageActions.push(damageAction);
        return damageAction;
    }

    //#region Player Stats
    /**
     * Damage amount does not take into consideration victim's HP, only the raw inflicted amount.
     *  eg. A victim's HP at 1 and a damage amount of 20 is still recorded at 20 and not 1; even though the
     *  damage required to knockdown the victim is 1.
     * The contained damage amount will then appear to be inflated.
     */
    public getDamageInflictedSumByPlayer(player: Player): number {
        const callbackFn = (action: DamageAction): number => (action.shieldDamage ?? 0) + (action.healthDamage ?? 0);
        return this.damageActionReduce(player, callbackFn);
    }

    public getKnockdownsInflictedSumByPlayer(player: Player): number {
        const callbackFn = (action: DamageAction): number => (action.isKnocked ? 1 : 0);
        return this.damageActionReduce(player, callbackFn);
    }

    /** Does not take into consideration of victims still spectating and still connected to the match. */
    public getEliminationsInflictedSumByPlayer(player: Player): number {
        const callbackFn = (action: DamageAction): number => (action.isEliminated ? 1 : 0);
        return this.damageActionReduce(player, callbackFn);
    }

    public getHeadshotsInflictedSumPlayer(player: Player): number {
        const callbackFn = (action: DamageAction): number => (action.isHeadshot ? 1 : 0);
        return this.damageActionReduce(player, callbackFn);
    }

    /**
     * Calls the specified callback function for all of the `damageActions`.
     * The return value of the callback function is totaled.
     * @param {string} attacker Attacking player to use as the filter.
     * @param {Function} callbackFn Callback function that is called, and should return the needed value.
     * @returns {number} Totaled result.
     */
    private damageActionReduce(attacker: Player, callbackFn: (action: DamageAction) => number): number {
        if (!attacker || !attacker.name) return 0;
        const value: number = this.damageActions
            .filter((v) => v.attacker === attacker)
            .reduce((sum, damageAction) => {
                const internalValue = parseInt(String(callbackFn(damageAction)));
                return sum + internalValue;
            }, 0);
        return value;
    }
    //#endregion
}
