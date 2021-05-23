import { Legend } from "@allfather-app/app/common/legend";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-legend-select-complimentary-legends",
    templateUrl: "./legend-select-complimentary-legends.component.html",
    styleUrls: ["./legend-select-complimentary-legends.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegendSelectComplimentaryLegendsComponent {
    @Input() public legendId?: string;
    @Input() public complimentaryLegendWeights: { legendId: string; weightScore: number }[] = [];

    public get legendName(): Optional<string> {
        return this.legendId ? Legend.getName(this.legendId) : undefined;
    }

    public getLegendImageName = (legendId: string): string => Legend.getSquarePortraitFilename(legendId);
}
