import { Injectable, OnDestroy } from "@angular/core";
import { VictimDamageEvents } from "@common/victim-damage-events";
import { MatchRosterService } from "@core/match-roster.service";
import { MatchService } from "@core/match.service";
import { PlayerActivityService } from "@core/player-activity.service";
import { PlayerService } from "@core/player.service";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class InGameDamageCollectorService implements OnDestroy {
    public victimDamageEventsList$ = new BehaviorSubject<VictimDamageEvents[]>([]);

    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly match: MatchService,
        private readonly matchRoster: MatchRosterService,
        private readonly player: PlayerService,
        private readonly playerActivity: PlayerActivityService
    ) {
        this.setupMatchReset();
        this.setupMyDamageListener();
        this.setupKillfeedListener();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private setupMatchReset(): void {
        this.match.started$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this.victimDamageEventsList$.next([]);
        });
    }

    private setupMyDamageListener(): void {
        this.playerActivity.myDamageEvent$.pipe(takeUntil(this._unsubscribe)).subscribe((damageEvent) => {
            console.log(`[${this.constructor.name}] Received damageEvent data:`, damageEvent);
            const victimName = damageEvent.victim.name;
            const newEventsList = [...this.victimDamageEventsList$.value];
            const foundVictim = !!victimName && newEventsList.find((v) => v.name === victimName);

            if (foundVictim) foundVictim.addDamageEvent(damageEvent);
            else newEventsList.push(new VictimDamageEvents(damageEvent.victim, damageEvent));

            this.victimDamageEventsList$.next(newEventsList);
        });
    }

    private setupKillfeedListener(): void {
        this.matchRoster.killfeedEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((killfeedEvent) => !!killfeedEvent.victim.name)
            )
            .subscribe((killfeedEvent) => {
                const newEventsList = [...this.victimDamageEventsList$.value];
                const foundVictim = newEventsList.find((v) => v.name === killfeedEvent.victim.name);
                if (!foundVictim) return;
                foundVictim.addDamageEvent(killfeedEvent);

                this.victimDamageEventsList$.next(newEventsList);
            });
    }
}
