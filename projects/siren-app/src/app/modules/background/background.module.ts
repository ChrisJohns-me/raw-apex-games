import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BackgroundComponent } from "./background.component";

@NgModule({
    declarations: [BackgroundComponent],
    imports: [CommonModule],
    exports: [BackgroundComponent],
})
export class BackgroundModule {}
