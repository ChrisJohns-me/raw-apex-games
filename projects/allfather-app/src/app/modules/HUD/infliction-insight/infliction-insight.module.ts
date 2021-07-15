import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { NgModule } from "@angular/core";
import { SharedAppModule } from "@shared-app/shared-app.module";
import { OpponentBannerComponent } from "./components/opponent-banner/opponent-banner.component";
import { InflictionInsightWindowComponent } from "./windows/infliction-insight-window.component";

@NgModule({
    declarations: [InflictionInsightWindowComponent, OpponentBannerComponent],
    imports: [SharedAppModule, AllfatherSharedModule],
    exports: [InflictionInsightWindowComponent],
})
export class InflictionInsightWindowModule {}
