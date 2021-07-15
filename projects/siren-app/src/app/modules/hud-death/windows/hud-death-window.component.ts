import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { isValid } from "date-fns";
import { Subject } from "rxjs";

@Component({
    selector: "app-hud-death-window",
    templateUrl: "./hud-death-window.component.html",
    styleUrls: ["./hud-death-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HUDDeathWindowComponent implements OnInit, OnDestroy {
    public isDateValid = isValid;

    public primaryTitle = "In Game Death";
    public secondaryTitle = "";

    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngOnInit(): void {}

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
