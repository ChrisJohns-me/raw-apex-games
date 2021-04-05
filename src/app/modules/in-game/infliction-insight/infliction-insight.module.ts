import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { OpponentBannerComponent } from "./components/opponent-banner/opponent-banner.component";
import { InflictionInsightWindowComponent } from "./windows/infliction-insight-window.component";

@NgModule({
    declarations: [InflictionInsightWindowComponent, OpponentBannerComponent],
    providers: [],
    imports: [SharedModule],
    exports: [InflictionInsightWindowComponent],
})
export class InflictionInsightWindowModule {}
