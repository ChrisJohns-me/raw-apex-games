import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { EnemyBadge } from "../../windows/damage-collector-window.component";

@Component({
    selector: "app-player-damage-box",
    templateUrl: "./player-damage-box.component.html",
    styleUrls: ["./player-damage-box.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerDamageBoxComponent implements OnDestroy {
    @Input("badgeData") public set badge(value: Optional<EnemyBadge>) {
        this._badge = value;
        this.cdr.detectChanges();
    }

    public get badge(): Optional<EnemyBadge> {
        return this._badge;
    }

    public primaryTitle = "Player Damage Box";
    public secondaryTitle = "";

    private _badge?: EnemyBadge;
    private _unsubscribe$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public changeDetectionRan(): void {
        console.log(`PLAYER BOX -> CHANGE DETECTION`);
    }
}
