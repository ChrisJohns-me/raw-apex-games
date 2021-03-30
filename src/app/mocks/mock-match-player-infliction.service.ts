import { WeaponItem } from "@common/items/weapon-item";
import { MatchInflictionEvent } from "@common/match/match-infliction-event";
import { MatchRosterPlayer } from "@common/match/match-roster-player";
import { Subject } from "rxjs";

export class MockMatchPlayerInflictionService {
    public readonly myKillfeedEvent$ = new Subject<MatchInflictionEvent>();
    public readonly myDamageEvent$ = new Subject<MatchInflictionEvent>();

    public mockDamageEvent(damageEvent?: Partial<MatchInflictionEvent>): MatchInflictionEvent {
        const newDamageEvent: MatchInflictionEvent = {
            timestamp: damageEvent?.timestamp ?? new Date(),
            victim: damageEvent?.victim ?? ({ name: "Victim" } as MatchRosterPlayer),
            attacker: damageEvent?.attacker ?? { name: "Me" },
            hasShield: damageEvent?.hasShield ?? (damageEvent?.shieldDamage ?? 0) > 0,
            isHeadshot: damageEvent?.isHeadshot ?? false,
            shieldDamage: damageEvent?.shieldDamage ?? 0,
            healthDamage: damageEvent?.healthDamage ?? 0,
            isKnockdown: damageEvent?.isKnockdown ?? undefined,
            isElimination: damageEvent?.isElimination ?? undefined,
            weapon: damageEvent?.weapon ?? new WeaponItem({}),
        };
        this.myDamageEvent$.next(newDamageEvent);
        return newDamageEvent;
    }

    public mockKillfeedEvent(damageEvent?: Partial<MatchInflictionEvent>): MatchInflictionEvent {
        const newKillfeedEvent: MatchInflictionEvent = {
            timestamp: damageEvent?.timestamp ?? new Date(),
            victim: damageEvent?.victim ?? ({ name: "Victim" } as MatchRosterPlayer),
            attacker: damageEvent?.attacker ?? { name: "Me" },
            hasShield: damageEvent?.hasShield ?? undefined,
            isHeadshot: damageEvent?.isHeadshot ?? undefined,
            shieldDamage: damageEvent?.shieldDamage ?? undefined,
            healthDamage: damageEvent?.healthDamage ?? undefined,
            isKnockdown: damageEvent?.isKnockdown ?? false,
            isElimination: damageEvent?.isElimination ?? false,
            weapon: damageEvent?.weapon ?? new WeaponItem({}),
        };
        this.myKillfeedEvent$.next(newKillfeedEvent);
        return newKillfeedEvent;
    }
}
