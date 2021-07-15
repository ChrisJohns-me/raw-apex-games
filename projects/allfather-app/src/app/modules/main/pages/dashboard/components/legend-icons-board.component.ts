import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { Legend } from "@shared-app/legend/legend";
import { generateLegendBGLinearColor } from "@shared-app/legend/legend-list";

type LegendIdsRow = string[];

@Component({
    selector: "app-legend-icons-board",
    templateUrl: "./legend-icons-board.component.html",
    styleUrls: ["./legend-icons-board.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegendIconsBoardComponent {
    @Input() public legendIconRows: LegendIdsRow[] = [];
    @Output() public onLegendHover = new EventEmitter<string>();
    @Output() public onLegendUnhover = new EventEmitter<void>();
    @Output() public onLegendClick = new EventEmitter<string>();

    public getLegendImageName = (legendId?: string): string => Legend.getSquarePortraitFilename(legendId);
    public getLegendName = (legendId?: string): Optional<string> => Legend.getName(legendId);
    public getLegendBGColorGradient = (legendId?: string): string => generateLegendBGLinearColor(legendId);
}
