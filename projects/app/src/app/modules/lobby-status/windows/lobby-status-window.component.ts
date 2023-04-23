import { Hotkey, HotkeyEnum } from "#app/models/hotkey.js";
import { OverwolfWindowName } from "#app/models/overwolf-window.js";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { filter, merge, Subject, takeUntil } from "rxjs";
import { HotkeyService } from "../../background/hotkey.service";

const MAIN_HOTKEY_NAME = HotkeyEnum.ToggleMainInGame;

@Component({
    selector: "app-lobby-status-window",
    templateUrl: "./lobby-status-window.component.html",
    styleUrls: ["./lobby-status-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LobbyStatusWindowComponent implements OnInit, OnDestroy {
    public mainHotkey?: Hotkey;

    public readonly OverwolfWindowName = OverwolfWindowName;

    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly hotkey: HotkeyService) {}

    public ngOnInit(): void {
        this.setupHotkeys();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupHotkeys(): void {
        const onChanged$ = this.hotkey.onHotkeyChanged$.pipe(filter((hotkey) => hotkey.hotkeyName === MAIN_HOTKEY_NAME));

        merge(this.hotkey.getGameHotkeyByName(MAIN_HOTKEY_NAME), onChanged$)
            .pipe(takeUntil(this.destroy$))
            .subscribe((mainHotkey) => {
                this.mainHotkey = mainHotkey;
                this.cdr.detectChanges();
            });
    }
}
