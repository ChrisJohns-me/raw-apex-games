import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { MatchService } from "@core/match.service";
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
    private _unsubscribe = new Subject<void>();

    constructor(private readonly match: MatchService, public readonly damageCollector: InGameDamageCollectorService) {}

    public ngOnInit(): void {
        this.setupOnMatchEnd();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    /**
     * Reset state on match end
     */
    private setupOnMatchEnd(): void {
        this.match.endedEvent$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this.damageCollector.clearDamageEventList();
        });
    }
}
