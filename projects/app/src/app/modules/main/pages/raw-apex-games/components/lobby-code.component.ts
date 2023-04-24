import { OverwolfUtilsService } from "#app/modules/core/overwolf/overwolf-utils.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { mdiClipboardOutline, mdiEye, mdiEyeOff } from "@mdi/js";
import { Subject } from "rxjs";

@Component({
    selector: "app-lobby-code",
    templateUrl: "./lobby-code.component.html",
    styleUrls: ["./lobby-code.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LobbyCodeComponent implements OnDestroy {
    @Input() public isEditable = false;
    @Input() public lobbyCode = "";
    @Output() public lobbyCodeChange = new EventEmitter<string>();

    public lobbyCodeMessage = "";
    public showLobbyCode = false;

    public readonly mdiEye = mdiEye;
    public readonly mdiEyeOff = mdiEyeOff;
    public readonly mdiClipboardOutline = mdiClipboardOutline;

    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly overwolfUtils: OverwolfUtilsService) {}

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public copyLobbyCode(): void {
        if (!this.lobbyCode) return;
        this.overwolfUtils.copyToClipboard(this.lobbyCode);
        this.lobbyCodeMessage = "Lobby code copied to clipboard!";
        this.cdr.detectChanges();
        setTimeout(() => {
            this.lobbyCodeMessage = "";
            this.cdr.detectChanges();
        }, 5000);
    }
}
