import { Legend } from "@allfather-app/app/common/legend/legend";
import { getLegendBGColor } from "@allfather-app/app/common/legend/legend-list";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-complimentary-legends",
    templateUrl: "./complimentary-legends.component.html",
    styleUrls: ["./complimentary-legends.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplimentaryLegendsComponent {
    @Input() public complimentaryLegendWeights: { legendId: string; weightScore: number }[] = [];

    public getLegendImageName = (legendId: string): string => Legend.getSquarePortraitFilename(legendId);
    public getLegendBGColor = (legendId?: string): string => getLegendBGColor(legendId);
}
