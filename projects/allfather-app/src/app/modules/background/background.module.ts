import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { BackgroundComponent } from "./background.component";
import { SystemTrayService } from "./system-tray.service";

@NgModule({
    declarations: [BackgroundComponent],
    imports: [SharedModule],
    providers: [SystemTrayService],
    exports: [BackgroundComponent],
})
export class BackgroundModule {}
