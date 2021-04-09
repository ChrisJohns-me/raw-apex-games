import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { BackgroundComponent } from "./background.component";

@NgModule({
    declarations: [BackgroundComponent],
    imports: [SharedModule],
    exports: [BackgroundComponent],
})
export class BackgroundModule {}
