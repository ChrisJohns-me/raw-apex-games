import { cleanInt } from "src/utilities/number";
import { DamageEvent } from "./damage-event";
import { Player } from "./player";

export class VictimDamageEvents extends Player {
    public damageEvents: DamageEvent[] = [];

    public get lastEventDate(): Optional<Date> {
        const dmgEvents = this.damageEvents;
        if (!dmgEvents || !Array.isArray(dmgEvents)) return;
        const lastEvent = dmgEvents[dmgEvents.length - 1];
        return lastEvent.timestamp;
    }
    public get hasShield(): Optional<boolean> {
        return this.damageEvents.find((d) => d.hasShield != null)?.hasShield;
    }
    public get isKnocked(): Optional<boolean> {
        return !this.isEliminated && this.damageEvents.find((d) => d.isKnocked != null)?.isKnocked;
    }
    public get isEliminated(): Optional<boolean> {
        return this.damageEvents.find((d) => d.isEliminated != null)?.isEliminated;
    }
    public get damageSum(): number {
        return this.shieldDamageSum + this.healthDamageSum;
    }
    public get shieldDamageSum(): number {
        return this.damageEvents.reduce((sum, dmgEvent) => sum + cleanInt(dmgEvent.shieldDamage), 0);
    }
    public get healthDamageSum(): number {
        return this.damageEvents.reduce((sum, dmgEvent) => sum + cleanInt(dmgEvent.healthDamage), 0);
    }

    public get attackers(): Player[] {
        const attackers: Player[] = [];
        this.damageEvents.forEach((dmgEvent) => {
            if (dmgEvent.attacker && !attackers.find((a) => a.name === dmgEvent.attacker?.name))
                attackers.push(dmgEvent.attacker);
        });
        return attackers;
    }

    constructor(victimPlayer: Player, damageEvent?: DamageEvent) {
        super({ ...victimPlayer });
        if (damageEvent) this.addDamageEvent(damageEvent);
    }

    public addDamageEvent(damageEvent: DamageEvent): void {
        this.damageEvents.push(damageEvent);
        this.sortDamageEvents();
    }

    private sortDamageEvents(): void {
        this.damageEvents = [...this.damageEvents].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }
}
