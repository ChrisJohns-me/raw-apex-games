import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { DateFnsModule } from "ngx-date-fns";
import { OpponentBannerComponent } from "./components/opponent-banner/opponent-banner.component";
import { InflictionInsightWindowComponent } from "./windows/infliction-insight-window.component";

@NgModule({
    declarations: [InflictionInsightWindowComponent, OpponentBannerComponent],
    imports: [AllfatherSharedModule, SharedModule, DateFnsModule],
    exports: [InflictionInsightWindowComponent],
})
export class InflictionInsightWindowModule {}
