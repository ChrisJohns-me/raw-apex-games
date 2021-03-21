import { cleanInt } from "src/utilities/number";
import { DamageEvent } from "./damage-event";
import { Player } from "./player";

/**
 * Container for all outgoing damage events and their raw values,
 *  with a specific player in mind (typically the local player).
 */
export class DamageRoster {
    public damageEvents: DamageEvent[] = [];

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

    /** @returns {DamageEvent} Action that was added to damageEvents */
    public inflictPlayerDamage({
        attacker,
        victim,
        hasShield,
        isHeadshot,
        shieldDamage,
        healthDamage,
    }: Omit<DamageEvent, "timestamp">): DamageEvent {
        const damageEvent: DamageEvent = {
            timestamp: new Date(),
            attacker: attacker ?? this.primaryAttacker,
            victim: victim,
            hasShield: hasShield,
            isHeadshot: isHeadshot,
            shieldDamage: cleanInt(shieldDamage),
            healthDamage: cleanInt(healthDamage),
        };
        this.damageEvents.push(damageEvent);
        return damageEvent;
    }

    /** @returns {DamageEvent} Action that was added to damageEvents */
    public knockdownPlayer(victim: Player, attacker?: Player): DamageEvent {
        const damageEvent: DamageEvent = {
            timestamp: new Date(),
            attacker: attacker,
            victim: victim,
            isKnocked: true,
        };
        this.damageEvents.push(damageEvent);
        return damageEvent;
    }

    /** @returns {DamageEvent} Action that was added to damageEvents */
    public eliminatePlayer(victim: Player, attacker?: Player): DamageEvent {
        const damageEvent: DamageEvent = {
            timestamp: new Date(),
            attacker: attacker,
            victim: victim,
            isEliminated: true,
        };
        this.damageEvents.push(damageEvent);
        return damageEvent;
    }

    //#region Player Stats
    /**
     * Damage amount does not take into consideration victim's HP, only the raw inflicted amount.
     *  eg. A victim's HP at 1 and a damage amount of 20 is still recorded at 20 and not 1; even though the
     *  damage required to knockdown the victim is 1.
     * The contained damage amount will then appear to be inflated.
     */
    public getDamageInflictedSumByPlayer(player: Player): number {
        const callbackFn = (event: DamageEvent): number => (event.shieldDamage ?? 0) + (event.healthDamage ?? 0);
        return this.damageEventReduce(player, callbackFn);
    }

    public getKnockdownsInflictedSumByPlayer(player: Player): number {
        const callbackFn = (event: DamageEvent): number => (event.isKnocked ? 1 : 0);
        return this.damageEventReduce(player, callbackFn);
    }

    /** Does not take into consideration of victims still spectating and still connected to the match. */
    public getEliminationsInflictedSumByPlayer(player: Player): number {
        const callbackFn = (event: DamageEvent): number => (event.isEliminated ? 1 : 0);
        return this.damageEventReduce(player, callbackFn);
    }

    public getHeadshotsInflictedSumPlayer(player: Player): number {
        const callbackFn = (event: DamageEvent): number => (event.isHeadshot ? 1 : 0);
        return this.damageEventReduce(player, callbackFn);
    }

    /**
     * Calls the specified callback function for all of the `damageEvents`.
     * The return value of the callback function is totaled.
     * @param {string} attacker Attacking player to use as the filter.
     * @param {Function} callbackFn Callback function that is called, and should return the needed value.
     * @returns {number} Totaled result.
     */
    private damageEventReduce(attacker: Player, callbackFn: (event: DamageEvent) => number): number {
        if (!attacker || !attacker.name) return 0;
        const value: number = this.damageEvents
            .filter((v) => v.attacker === attacker)
            .reduce((sum, dmgEvent) => {
                const internalValue = cleanInt(callbackFn(dmgEvent));
                return sum + internalValue;
            }, 0);
        return value;
    }
    //#endregion
}
