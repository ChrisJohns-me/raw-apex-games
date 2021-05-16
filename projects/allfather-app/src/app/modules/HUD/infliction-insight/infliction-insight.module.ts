import { SharedModule } from "@allfather-app/app/shared/shared.module";
import { NgModule } from "@angular/core";
import { OpponentBannerComponent } from "./components/opponent-banner/opponent-banner.component";
import { InflictionInsightWindowComponent } from "./windows/infliction-insight-window.component";

@NgModule({
    declarations: [InflictionInsightWindowComponent, OpponentBannerComponent],
    imports: [SharedModule],
    exports: [InflictionInsightWindowComponent],
})
export class InflictionInsightWindowModule {}
