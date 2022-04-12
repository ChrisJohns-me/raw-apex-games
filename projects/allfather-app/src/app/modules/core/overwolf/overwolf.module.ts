import { NgModule } from "@angular/core";
import { OverwolfConfig, OW_CONFIG } from "./overwolf-config";

@NgModule({
    providers: [{ provide: OW_CONFIG, useValue: OverwolfConfig }],
})
export class OverwolfModule {}
