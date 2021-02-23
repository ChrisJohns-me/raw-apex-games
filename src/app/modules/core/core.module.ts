import { NgModule } from "@angular/core";
import { AppUtilitiesService } from "./app-utilities/app-utilities.service";
import { GameEventsService } from "./game";
import { ProcessStorageService, StorageService } from "./storage";
import { UIWindowEventsService } from "./ui-window";
import { HotkeyService, MouseWheelService } from "./user-input";

@NgModule({
    providers: [
        AppUtilitiesService,
        GameEventsService,
        HotkeyService,
        MouseWheelService,
        ProcessStorageService,
        StorageService,
        UIWindowEventsService,
    ],
})
export class CoreModule {}
