import { NgModule } from "@angular/core";
import { AppUtilitiesService } from "./app-utilities/app-utilities.service";
import { StorageService } from "./storage";
import { UIWindowEventsService } from "./ui-window";
import { HotkeyService, MouseWheelService } from "./user-input";

@NgModule({
    providers: [AppUtilitiesService, HotkeyService, MouseWheelService, StorageService, UIWindowEventsService],
})
export class CoreModule {}
