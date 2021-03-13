export interface DamageAction {
    timestamp: Date;
    hasShield?: boolean;
    isKnocked?: boolean;
    isEliminated?: boolean;
    shieldDamage?: number;
    healthDamage?: number;
}

export interface RosterDamageActions {
    [victimName: string]: DamageAction[];
}

export class DamageRoster {
    public actions: RosterDamageActions = {};

    public inflictPlayerDamage(data: {
        attackerName: string;
        victimName: string;
        shieldDamage?: number;
        healthDamage?: number;
        hasShield?: boolean;
    }): void {
        if (!this.actions[data.victimName]) this.actions[data.victimName] = [];
        this.actions[data.victimName].push({
            timestamp: new Date(),
            hasShield: data.hasShield,
            shieldDamage: data.shieldDamage,
            healthDamage: data.healthDamage,
        });
    }

    public knockdownPlayer(victimName: string): void {
        if (!this.actions[victimName]) this.actions[victimName] = [];
        this.actions[victimName].push({
            timestamp: new Date(),
            isKnocked: true,
        });
    }

    public eliminatePlayer(victimName: string): void {
        if (!this.actions[victimName]) this.actions[victimName] = [];
        this.actions[victimName].push({
            timestamp: new Date(),
            isEliminated: true,
        });
    }
}
