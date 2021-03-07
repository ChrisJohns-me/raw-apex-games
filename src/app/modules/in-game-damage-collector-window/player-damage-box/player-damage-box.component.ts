import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    selector: "app-player-damage-box",
    templateUrl: "./player-damage-box.component.html",
    styleUrls: ["./player-damage-box.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerDamageBoxComponent implements OnInit, OnDestroy {
    public primaryTitle = "Player Damage Box";
    public secondaryTitle = "";

    private _unsubscribe = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef) {
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
