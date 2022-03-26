import { OverwolfFeatureDep } from "@shared-app/feature-status";
import { Observable, of } from "rxjs";
import { HotkeyService } from "../../background/hotkey.service";
import { Hotkey } from "../hotkey";

export class MockHotkeyService implements MockedClass<HotkeyService> {
    public getGlobalHotkeys(): Observable<Hotkey[]> {
        return of([]);
    }

    public getGameHotkeys(): Observable<Hotkey[]> {
        return of([]);
    }

    public assignHotKey(hotkey: Hotkey): Observable<true> {
        return of(true);
    }

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
