import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Legend } from "@raw-apex-games-app/app/common/legend/legend";
import { getLegendBGColor } from "@raw-apex-games-app/app/common/legend/legend-list";

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
