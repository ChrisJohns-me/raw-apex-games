import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Inject, Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";
import { Hotkey, HotkeyEnum } from "../../common/hotkey";
import { BaseService } from "../core/base-service.abstract";
import { OWConfig, OW_CONFIG } from "../core/overwolf/overwolf-config";
import { OverwolfHotKeyService } from "../core/overwolf/overwolf-hotkey.service";

@Injectable({
    providedIn: "root",
    deps: [OverwolfHotKeyService, OW_CONFIG],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("HotkeyService", HotkeyService, deps),
})
export class HotkeyService extends BaseService {
    public readonly onHotkeyPressed$ = new Subject<Hotkey>();
    public readonly onHotkeyChanged$ = new Subject<Hotkey>();

    private gameId = this.owConfig.APEXLEGENDSCLASSID;

    constructor(private readonly overwolfHotKey: OverwolfHotKeyService, @Inject(OW_CONFIG) private readonly owConfig: OWConfig) {
        super();
        this.setupHotkeyOnPress();
        this.setupHotkeyOnChanged();
    }

    public getGameHotkeys(): Observable<Hotkey[]> {
        return this.overwolfHotKey.getHotKeyObject().pipe(
            filter((result) => !!result && !!result.games),
            map((result) => result.games![this.gameId]),
            map((games) => {
                return games.map((game) => Hotkey.fromOWHotKeyObject(game));
            })
        );
    }

    public getGameHotkeyByName(name: HotkeyEnum | string): Observable<Optional<Hotkey>> {
        return this.getGameHotkeys().pipe(map((hotkeys) => hotkeys.find((hotkey) => hotkey.hotkeyName === name)));
    }

    public assignHotKey(hotkey: Hotkey): Observable<true> {
        const hotKeyName = hotkey.hotkeyName;
        const gameId = this.gameId;
        const virtualKey = hotkey.keyCode;
        const ctrl = hotkey.ctrlKey;
        const alt = hotkey.altKey;
        const shift = hotkey.shiftKey;

        return this.overwolfHotKey.assignHotKey(hotKeyName, gameId, virtualKey, ctrl, alt, shift);
    }

    private setupHotkeyOnPress(): void {
        this.overwolfHotKey.onPressed$
            .pipe(
                switchMap((hotkeyPressEvent) => this.getGameHotkeyByName(hotkeyPressEvent.name)),
                takeUntil(this.destroy$)
            )
            .subscribe((hotkey: Optional<Hotkey>) => {
                if (!hotkey) return;
                this.onHotkeyPressed$.next(hotkey);
            });
    }

    private setupHotkeyOnChanged(): void {
        this.overwolfHotKey.onChanged$
            .pipe(
                switchMap((hotkeyChangedEvent) => this.getGameHotkeyByName(hotkeyChangedEvent.name)),
                takeUntil(this.destroy$)
            )
            .subscribe((hotkey: Optional<Hotkey>) => {
                if (!hotkey) return;
                this.onHotkeyChanged$.next(hotkey);
            });
    }
}
