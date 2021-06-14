import { SharedModule } from "@allfather-app/app/shared/shared.module";
import { NgModule } from "@angular/core";
import { AimingReticleComponent } from "./components/aiming-reticle/aiming-reticle.component";
import { ReticleHelperWindowComponent } from "./windows/reticle-helper-window.component";

@NgModule({
    declarations: [ReticleHelperWindowComponent, AimingReticleComponent],
    imports: [SharedModule],
    exports: [ReticleHelperWindowComponent, AimingReticleComponent],
})
export class ReticleHelperWindowModule {}
