import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PlayerService } from "../../../core/player.service";

@Component({
    selector: "app-dashboard-page",
    templateUrl: "./dashboard-page.component.html",
    styleUrls: ["./dashboard-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
    public playerName?: string;

    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly player: PlayerService) {}

    public ngOnInit(): void {
        this.setupPlayerName();
    }

    private setupPlayerName(): void {
        this.player.myName$.pipe(takeUntil(this.destroy$)).subscribe((myName) => {
            this.playerName = myName;
            this.cdr.detectChanges();
        });
    }
}
