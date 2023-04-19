import { Observable, of, Subject } from "rxjs";
import { ExtractSubjectType } from "../../../../../../../../common/types/rxjs-utilities";
import { OverwolfFeatureDep } from "../../../../common/feature-status";
import { Hotkey } from "../../../../common/hotkey";
import { HotkeyService } from "../../../background/hotkey.service";

export class MockHotkeyService implements MockedClass<HotkeyService> {
    public onHotkeyPressed$ = new Subject<ExtractSubjectType<HotkeyService["onHotkeyPressed$"]>>();
    public onHotkeyChanged$ = new Subject<ExtractSubjectType<HotkeyService["onHotkeyChanged$"]>>();

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
