import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { InGameDamageCollectorService } from "./in-game-damage-collector.service";

@Component({
    selector: "app-in-game-damage-collector-window",
    templateUrl: "./in-game-damage-collector-window.component.html",
    styleUrls: ["./in-game-damage-collector-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InGameDamageCollectorWindowComponent implements OnInit, OnDestroy {
    public primaryTitle = "In Game Damage Collector";
    public secondaryTitle = "";

    private _unsubscribe = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly damageCollector: InGameDamageCollectorService
    ) {
        console.debug(`[${this.constructor.name}] instantiated`);
    }

    public ngOnInit(): void {
        this.registerGameEvents();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private registerGameEvents(): void {
        // ...
    }
}
