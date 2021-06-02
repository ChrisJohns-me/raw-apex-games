import { Rank } from "@allfather-app/app/common/rank/rank";
import { RankNext } from "@allfather-app/app/common/rank/rank-next";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-rank-icon",
    styleUrls: ["./rank-icon.component.scss"],
    templateUrl: "./rank-icon.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankIconComponent {
    @Input() public rank?: Rank | RankNext;

    public generateImageFilename(): string {
        const extension = "webp";
        return `${this.rank?.tierName.toLowerCase() ?? "bronze"}.${extension}`;
    }
}
