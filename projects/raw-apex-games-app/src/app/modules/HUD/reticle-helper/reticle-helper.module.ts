import { NgModule } from "@angular/core";
import { RawApexGamesSharedModule } from "@raw-apex-games-app/app/shared/raw-apex-games-shared.module";
import { SharedModule } from "@shared/shared.module";
import { AimingReticleComponent } from "./components/aiming-reticle/aiming-reticle.component";
import { ReticleHelperWindowComponent } from "./windows/reticle-helper-window.component";

@NgModule({
    declarations: [ReticleHelperWindowComponent, AimingReticleComponent],
    imports: [RawApexGamesSharedModule, SharedModule],
    exports: [ReticleHelperWindowComponent, AimingReticleComponent],
})
export class ReticleHelperWindowModule {}
