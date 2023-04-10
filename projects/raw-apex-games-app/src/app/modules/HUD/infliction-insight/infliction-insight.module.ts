import { NgModule } from "@angular/core";
import { RawApexGamesSharedModule } from "@raw-apex-games-app/app/shared/raw-apex-games-shared.module";
import { SharedModule } from "@shared/shared.module";
import { DateFnsModule } from "ngx-date-fns";
import { OpponentBannerComponent } from "./components/opponent-banner/opponent-banner.component";
import { InflictionInsightWindowComponent } from "./windows/infliction-insight-window.component";

@NgModule({
    declarations: [InflictionInsightWindowComponent, OpponentBannerComponent],
    imports: [RawApexGamesSharedModule, SharedModule, DateFnsModule],
    exports: [InflictionInsightWindowComponent],
})
export class InflictionInsightWindowModule {}
