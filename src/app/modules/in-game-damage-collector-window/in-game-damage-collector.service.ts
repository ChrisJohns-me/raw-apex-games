import { Injectable } from "@angular/core";
import { MatchDamageEvent } from "@common/match/match-damage-event";
import { DamageTimelyAggregator } from "@common/utilities/damage-timely-aggregator";
import { isPlayerNameEqual } from "@common/utilities/player";
import { MatchPlayerDamageService } from "@core/match-player-damage.service";
import { Observable, Observer } from "rxjs";

const ACCUM_EXPIRE = 5000;

@Injectable({
    providedIn: "root",
})
export class InGameDamageCollectorService {
    public damageEventList$ = new Observable((observer: Observer<MatchDamageEvent[]>) => {
        this.damageEventListCleared = () => observer.next([]);
        const aggregatorSubscription = this.damageAggregator
            .getDamageAggregate$([this.matchPlayerDamage.myDamageEvent$, this.matchPlayerDamage.myKillfeedEvent$])
            .subscribe((inflictionEvent) => {
                this.damageEventListValue = [
                    ...this.damageEventListValue.filter((e) => !isPlayerNameEqual(e.victim.name, inflictionEvent.victim.name)),
                    inflictionEvent,
                ];
                observer.next(this.damageEventListValue);
            });
        return () => aggregatorSubscription.unsubscribe();
    });
    private damageEventListValue: MatchDamageEvent[] = [];
    private damageEventListCleared?: () => void;

    private readonly damageAggregator = new DamageTimelyAggregator({
        expireAggregateMs: ACCUM_EXPIRE,
        emitOnExpire: true,
    });

    constructor(private readonly matchPlayerDamage: MatchPlayerDamageService) {}

    public clearDamageEventList(): void {
        this.damageEventListValue = [];
        if (typeof this.damageEventListCleared === "function") this.damageEventListCleared();
    }
}
