import { AvgMatchStats } from "@allfather-app/app/common/utilities/match-stats";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-legend-stats",
    templateUrl: "./legend-stats.component.html",
    styleUrls: ["./legend-stats.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegendStatsComponent {
    @Input() public legendStats?: AvgMatchStats;
}
