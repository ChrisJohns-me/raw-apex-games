import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subject } from "rxjs";
import { LegendIconRow } from "../legend-icon-row.interface";

@Component({
    selector: "app-legend-icons-board",
    templateUrl: "./legend-icons-board.component.html",
    styleUrls: ["./legend-icons-board.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegendIconsBoardComponent implements OnInit, OnDestroy {
    @Input() public legendIconRows: LegendIconRow[] = [];
    @Output() public onLegendIdHover = new EventEmitter<string>();

    private isDestroyed$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngOnInit(): void {}

    public ngOnDestroy(): void {
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
    }

    public onLegendMouseOver(legendId: string): void {
        this.onLegendIdHover.next(legendId);
    }
}
