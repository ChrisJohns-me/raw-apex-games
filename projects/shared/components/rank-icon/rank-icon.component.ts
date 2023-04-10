import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Rank } from "@raw-apex-games-app/app/common/rank/rank";
import { RankNext } from "@raw-apex-games-app/app/common/rank/rank-next";

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
        return `${this.rank?.tierName.toLowerCase() ?? "rookie"}.${extension}`;
    }
}
