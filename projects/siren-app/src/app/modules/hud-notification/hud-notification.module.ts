import { NgModule } from "@angular/core";
import { SharedAppModule } from "@shared-app/shared-app.module";
import { SirenSharedModule } from "@siren-app/app/shared/siren-shared.module";
import { HUDNotificationWindowComponent } from "./windows/hud-notification-window.component";

@NgModule({
    declarations: [HUDNotificationWindowComponent],
    imports: [SharedAppModule, SirenSharedModule],
    exports: [HUDNotificationWindowComponent],
})
export class HUDNotificationModule {}
