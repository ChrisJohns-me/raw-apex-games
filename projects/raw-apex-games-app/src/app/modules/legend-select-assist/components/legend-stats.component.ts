import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { AvgMatchStats } from "@raw-apex-games-app/app/common/utilities/match-stats";

@Component({
    selector: "app-legend-stats",
    templateUrl: "./legend-stats.component.html",
    styleUrls: ["./legend-stats.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegendStatsComponent {
    @Input() public legendStats?: AvgMatchStats;
}
