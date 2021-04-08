import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
    OpponentBanner,
    OpponentBannerComponent,
} from "@app/modules/in-game/infliction-insight/components/opponent-banner/opponent-banner.component";

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
