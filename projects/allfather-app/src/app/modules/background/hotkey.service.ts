import { BaseService } from "@allfather-app/app/common/services/base-service.abstract";
import { OWConfig, OW_CONFIG } from "@allfather-app/app/common/services/overwolf/overwolf-config";
import { OverwolfHotKeyService } from "@allfather-app/app/common/services/overwolf/overwolf-hotkey.service";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Inject, Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { Hotkey } from "../core/hotkey";

@Injectable({
    providedIn: "root",
    deps: [OverwolfHotKeyService, OW_CONFIG],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("HotKeyService", HotkeyService, deps),
})
export class HotkeyService extends BaseService {
    public readonly onHotkeyPressed$ = new Subject<Hotkey>();

    private gameId = this.owConfig.APEXLEGENDSCLASSID;

    constructor(private readonly overwolfHotKey: OverwolfHotKeyService, @Inject(OW_CONFIG) private readonly owConfig: OWConfig) {
        super();
        this.setupHotkeyOnPress();
    }

    public getGlobalHotkeys(): Observable<Hotkey[]> {
        return this.overwolfHotKey.getHotKeyObject().pipe(
            map((result) => result.globals),
            map((globals) => {
                return globals.map((global) => Hotkey.fromOWHotKeyObject(global));
            })
        );
    }

    public getGlobalHotkeyByName(name: string): Observable<Optional<Hotkey>> {
        return this.getGlobalHotkeys().pipe(map((hotkeys) => hotkeys.find((hotkey) => hotkey.hotkeyName === name)));
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

    public getGameHotkeyByName(name: string): Observable<Optional<Hotkey>> {
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
        console.log(`[HotkeyService] Setting up hotkey on press`);
        this.overwolfHotKey.onPressed$
            .pipe(
                tap((hotkeyPressEvent) => console.log(`[HotkeyService] Hotkey pressed`, hotkeyPressEvent)),
                switchMap((hotkeyPressEvent) => this.getGameHotkeyByName(hotkeyPressEvent.name)),
                takeUntil(this.destroy$)
            )
            .subscribe((hotkey: Optional<Hotkey>) => {
                if (!hotkey) return;
                this.onHotkeyPressed$.next(hotkey);
            });
    }
}
