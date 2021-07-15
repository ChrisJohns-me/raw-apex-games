import { NgModule } from "@angular/core";
import { SharedAppModule } from "@shared-app/shared-app.module";
import { SirenSharedModule } from "@siren-app/app/shared/siren-shared.module";
import { HUDDeathWindowComponent } from "./windows/hud-death-window.component";

@NgModule({
    declarations: [HUDDeathWindowComponent],
    imports: [SharedAppModule, SirenSharedModule],
    exports: [HUDDeathWindowComponent],
})
export class HUDDeathWindowModule {}
