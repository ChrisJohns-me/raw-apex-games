import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BackgroundComponent } from "./background.component";
import { SystemTrayService } from "./system-tray.service";

@NgModule({
    declarations: [BackgroundComponent],
    imports: [CommonModule],
    providers: [SystemTrayService],
    exports: [BackgroundComponent],
})
export class BackgroundModule {}
