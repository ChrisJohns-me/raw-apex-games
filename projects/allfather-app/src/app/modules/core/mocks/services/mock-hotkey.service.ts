import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { HotkeyService } from "@allfather-app/app/modules/background/hotkey.service";
import { Observable, of } from "rxjs";
import { Hotkey } from "../../hotkey";

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
