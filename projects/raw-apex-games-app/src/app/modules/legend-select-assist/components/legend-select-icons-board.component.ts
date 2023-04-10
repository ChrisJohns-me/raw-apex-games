import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { LegendIconRow } from "../legend-select-icon-row.interface";

@Component({
    selector: "app-legend-select-icons-board",
    templateUrl: "./legend-select-icons-board.component.html",
    styleUrls: ["./legend-select-icons-board.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegendSelectIconsBoardComponent {
    @Input() public legendIconRows: LegendIconRow[] = [];
    @Output() public onLegendHover = new EventEmitter<string>();
}
