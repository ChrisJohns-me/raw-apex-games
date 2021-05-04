import { Legend } from "@allfather-app/app/shared/models/legend";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from "@angular/core";

@Component({
    selector: "app-complimentary-legends",
    templateUrl: "./complimentary-legends.component.html",
    styleUrls: ["./complimentary-legends.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplimentaryLegendsComponent {
    @Input() public legendId = "";
    @Input() public complimentaryLegendWeights: { legendId: string; weightScore: number }[] = [];

    public get legendName(): Optional<string> {
        return Legend.getName(this.legendId);
    }
    public getLegendImageName = (legendId: string): string => Legend.getSquarePortraitFilename(legendId);

    constructor(private readonly cdr: ChangeDetectorRef) {}
}
