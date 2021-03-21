import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { VictimDamageEvents } from "@common/victim-damage-events";
import { PlayerActivityService } from "@core/player-activity.service";
import { BehaviorSubject, Subject } from "rxjs";
import { InGameDamageCollectorService } from "./in-game-damage-collector.service";

// WIP

@Component({
    selector: "app-in-game-damage-collector-window",
    templateUrl: "./in-game-damage-collector-window.component.html",
    styleUrls: ["./in-game-damage-collector-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InGameDamageCollectorWindowComponent implements OnInit, OnDestroy {
    public get damageEvents$(): BehaviorSubject<VictimDamageEvents[]> {
        return this.damageCollector.victimDamageEventsList$;
    }

    private _unsubscribe = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly damageCollector: InGameDamageCollectorService,
        private readonly playerActivity: PlayerActivityService
    ) {}

    public ngOnInit(): void {}

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }
}
