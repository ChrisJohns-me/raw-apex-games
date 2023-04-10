import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
    OpponentBanner,
    OpponentBannerComponent,
} from "@raw-apex-games-app/app/modules/HUD/infliction-insight/components/opponent-banner/opponent-banner.component";
import { Configuration } from "@raw-apex-games-app/configs/config.interface";

@Component({
    selector: "app-opponent-banner",
    template: ``,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockOpponentBannerComponent implements MockedClass<OpponentBannerComponent> {
    @Input("bannerData") public bannerData: Optional<OpponentBanner>;
    @Input() public teamColor?: string;

    public config?: Configuration;
    public visualizeHealthUI = false;
}
