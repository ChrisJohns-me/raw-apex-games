import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Legend } from "@shared-app/legend/legend";
import { getLegendBGColor } from "@shared-app/legend/legend-list";

@Component({
    selector: "app-complimentary-legends",
    templateUrl: "./complimentary-legends.component.html",
    styleUrls: ["./complimentary-legends.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplimentaryLegendsComponent {
    @Input() public legendId?: string;
    @Input() public complimentaryLegendWeights: { legendId: string; weightScore: number }[] = [];

    public get legendName(): Optional<string> {
        return this.legendId ? Legend.getName(this.legendId) : undefined;
    }
    public getLegendImageName = (legendId: string): string => Legend.getSquarePortraitFilename(legendId);
    public getLegendBGColor = (legendId?: string): string => getLegendBGColor(legendId);
}
