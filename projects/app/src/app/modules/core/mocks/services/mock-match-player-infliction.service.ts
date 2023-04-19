import { Subject } from "rxjs";
import { OverwolfFeatureDep } from "../../../../common/feature-status";
import { WeaponItem } from "../../../../common/items/weapon-item";
import { MatchInflictionEvent } from "../../../../common/match/infliction-event";
import { MatchRosterPlayer } from "../../../../common/match/roster-player";
import { MatchPlayerInflictionService } from "../../match/match-player-infliction.service";

export class MockMatchPlayerInflictionService implements MockedClass<MatchPlayerInflictionService> {
    public myUniqueDamageEvent$: MatchPlayerInflictionService["myUniqueDamageEvent$"] = new Subject();
    public myKillfeedEvent$: MatchPlayerInflictionService["myKillfeedEvent$"];
    public notMyKillfeedEvent$: MatchPlayerInflictionService["notMyKillfeedEvent$"];
    public myDamageEvent$: MatchPlayerInflictionService["myDamageEvent$"] = new Subject();
    public myKnockdownEvent$: MatchPlayerInflictionService["myKnockdownEvent$"] = new Subject();
    public myEliminationEvent$: MatchPlayerInflictionService["myEliminationEvent$"] = new Subject();

    private _myKillfeedEvent$ = new Subject<MatchInflictionEvent>();
    private _notMyKillfeedEvent$ = new Subject<MatchInflictionEvent>();

    constructor() {
        this.myKillfeedEvent$ = this._myKillfeedEvent$.asObservable();
        this.notMyKillfeedEvent$ = this._notMyKillfeedEvent$.asObservable();
    }

    public mockDamageEvent(damageEvent?: Partial<MatchInflictionEvent>): MatchInflictionEvent {
        const newDamageEvent: MatchInflictionEvent = {
            timestamp: damageEvent?.timestamp ?? new Date(),
            victim: damageEvent?.victim ?? ({ name: "Victim" } as MatchRosterPlayer),
            attacker: damageEvent?.attacker ?? ({ name: "Me", isMe: true } as MatchRosterPlayer),
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
            attacker: damageEvent?.attacker ?? ({ name: "Me" } as MatchRosterPlayer),
            hasShield: damageEvent?.hasShield ?? undefined,
            isHeadshot: damageEvent?.isHeadshot ?? undefined,
            shieldDamage: damageEvent?.shieldDamage ?? undefined,
            healthDamage: damageEvent?.healthDamage ?? undefined,
            isKnockdown: damageEvent?.isKnockdown ?? false,
            isElimination: damageEvent?.isElimination ?? false,
            weapon: damageEvent?.weapon ?? new WeaponItem({}),
        };
        this._myKillfeedEvent$.next(newKillfeedEvent);
        return newKillfeedEvent;
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
