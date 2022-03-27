import { AllfatherSharedModule } from "@allfather-app/app/shared/allfather-shared.module";
import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { AimingReticleComponent } from "./components/aiming-reticle/aiming-reticle.component";
import { ReticleHelperWindowComponent } from "./windows/reticle-helper-window.component";

@NgModule({
    declarations: [ReticleHelperWindowComponent, AimingReticleComponent],
    imports: [AllfatherSharedModule, SharedModule],
    exports: [ReticleHelperWindowComponent, AimingReticleComponent],
})
export class ReticleHelperWindowModule {}
