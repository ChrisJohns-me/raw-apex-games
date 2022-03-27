import { BaseService } from "@allfather-app/app/common/services/base-service.abstract";
import { OWConfig, OW_CONFIG } from "@allfather-app/app/common/services/overwolf/overwolf-config";
import { OverwolfHotKeyService } from "@allfather-app/app/common/services/overwolf/overwolf-hotkey.service";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { Hotkey } from "../core/hotkey";

@Injectable({
    providedIn: "root",
    deps: [OverwolfHotKeyService, OW_CONFIG],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("HotKeyService", HotkeyService, deps),
})
export class HotkeyService extends BaseService {
    private gameId = this.owConfig.APEXLEGENDSCLASSID;

    constructor(private readonly overwolfHotKeyService: OverwolfHotKeyService, @Inject(OW_CONFIG) private readonly owConfig: OWConfig) {
        super();
    }

    public getGlobalHotkeys(): Observable<Hotkey[]> {
        return this.overwolfHotKeyService.getHotKeyObject().pipe(
            map((result) => result.globals),
            map((globals) => {
                return globals.map((global) => Hotkey.fromOWHotKeyObject(global));
            })
        );
    }

    public getGameHotkeys(): Observable<Hotkey[]> {
        return this.overwolfHotKeyService.getHotKeyObject().pipe(
            filter((result) => !!result && !!result.games),
            map((result) => result.games![this.gameId]),
            map((games) => {
                return games.map((game) => Hotkey.fromOWHotKeyObject(game));
            })
        );
    }

    public assignHotKey(hotkey: Hotkey): Observable<true> {
        const hotKeyName = hotkey.hotkeyName;
        const gameId = this.gameId;
        const virtualKey = hotkey.keyCode;
        const ctrl = hotkey.ctrlKey;
        const alt = hotkey.altKey;
        const shift = hotkey.shiftKey;

        return this.overwolfHotKeyService.assignHotKey(hotKeyName, gameId, virtualKey, ctrl, alt, shift);
    }
}
