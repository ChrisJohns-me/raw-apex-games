import { Injectable, OnDestroy } from "@angular/core";
import { DamageAction } from "@common/damage-roster";
import { PlayerActivityService } from "@core/player-activity.service";
import { PlayerService } from "@core/player.service";
import { Observable, Subject } from "rxjs";
import { filter } from "rxjs/operators";

// MAAYYBE:
// TODO; This service will house the aggregate data from victims. It will make the data consumable for the component.
// -----

export interface VictimSummary {
    victimName: string;
    myDamageActions: DamageAction[];
    notMyDamageActions: DamageAction[];
}

@Injectable({
    providedIn: "root",
})
export class InGameDamageCollectorService implements OnDestroy {
    public myDamageAction$: Observable<DamageAction>;

    private readonly _unsubscribe = new Subject<void>();

    constructor(private readonly player: PlayerService, private readonly playerActivity: PlayerActivityService) {
        this.myDamageAction$ = this.playerActivity.myDamageAction$.pipe(
            // Filter only if PlayerName is set
            filter((damageAction) => !!this.player.me$.value.name),
            filter((damageAction) => damageAction.attacker?.name === this.player.me$.value.name)
        );
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }
}
