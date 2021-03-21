import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { DamageAction } from "@common/damage-roster";
import { PlayerActivityService } from "@core/player-activity.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { InGameDamageCollectorService } from "./in-game-damage-collector.service";

@Component({
    selector: "app-in-game-damage-collector-window",
    templateUrl: "./in-game-damage-collector-window.component.html",
    styleUrls: ["./in-game-damage-collector-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InGameDamageCollectorWindowComponent implements OnInit, OnDestroy {
    public damageActions: DamageAction[] = [];

    private _unsubscribe = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly damageCollector: InGameDamageCollectorService,
        private readonly playerActivity: PlayerActivityService
    ) {}

    public ngOnInit(): void {
        this.setupDamageActionListener();
        this.damageCollector.myDamageAction$;
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private setupDamageActionListener(): void {
        this.damageCollector.myDamageAction$.pipe(takeUntil(this._unsubscribe)).subscribe((damageAction) => {
            this.damageActions.push(damageAction);
            this.cdr.detectChanges();
        });
    }
}
