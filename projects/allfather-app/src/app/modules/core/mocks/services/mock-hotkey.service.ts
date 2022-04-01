import { OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";
import { HotkeyService } from "@allfather-app/app/modules/background/hotkey.service";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { Observable, of, Subject } from "rxjs";
import { Hotkey } from "../../hotkey";

export class MockHotkeyService implements MockedClass<HotkeyService> {
    public onHotkeyPressed$ = new Subject<ExtractSubjectType<HotkeyService["onHotkeyPressed$"]>>();

    public getGlobalHotkeys(): Observable<Hotkey[]> {
        return of([]);
    }
    public getGlobalHotkeyByName(
        ...args: Parameters<HotkeyService["getGlobalHotkeyByName"]>
    ): ReturnType<HotkeyService["getGlobalHotkeyByName"]> {
        return of();
    }
    public getGameHotkeys(): Observable<Hotkey[]> {
        return of([]);
    }
    public getGameHotkeyByName(
        ...args: Parameters<HotkeyService["getGameHotkeyByName"]>
    ): ReturnType<HotkeyService["getGameHotkeyByName"]> {
        return of();
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
