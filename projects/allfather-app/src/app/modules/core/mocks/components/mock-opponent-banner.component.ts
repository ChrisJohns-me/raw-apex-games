import {
    OpponentBanner,
    OpponentBannerComponent,
} from "@allfather-app/app/modules/HUD/infliction-insight/components/opponent-banner/opponent-banner.component";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-opponent-banner",
    template: ``,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockOpponentBannerComponent implements MockedClass<OpponentBannerComponent> {
    @Input("bannerData") public banner: Optional<OpponentBanner>;
    public primaryTitle = "";
    public secondaryTitle = "";
}
