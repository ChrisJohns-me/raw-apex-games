import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from "@angular/core";
import { Hotkey } from "@app/models/hotkey.js";

@Component({
    selector: "app-hotkey-editor",
    templateUrl: "./hotkey-editor.component.html",
    styleUrls: ["./hotkey-editor.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotkeyEditorComponent {
    @Input()
    public get hotkey(): Optional<Hotkey> {
        return this._hotkey;
    }
    public set hotkey(value: Optional<Hotkey>) {
        this._hotkey = value;
        this.stagedHotkey = undefined;
    }
    @Output() public hotkeyChange: EventEmitter<Hotkey> = new EventEmitter();

    public get displayValue(): string {
        if (this.stagedHotkey && this.stagedHotkey.friendlyBinding) return this.stagedHotkey.friendlyBinding;
        if (this.isEditing) return "Press Key...";
        if (!this.hotkey) return "[loading]";
        if (!this.hotkey.isBound) return "Unassigned";
        return this.hotkey?.friendlyBinding ?? "[Unknown]";
    }

    private _hotkey?: Hotkey;
    private isEditing = false;
    private stagedHotkey?: Hotkey;

    constructor(private readonly cdr: ChangeDetectorRef) {}

    public onClick(): void {
        this.createStagedHotkey();
        this.isEditing = true;
        this.cdr.detectChanges();
    }

    public onKeyDown(event: KeyboardEvent): void {
        if (!this.stagedHotkey) this.createStagedHotkey();
        this.isEditing = true;
        event.stopPropagation();
        event.preventDefault();

        this.stagedHotkey!.ctrlKey = this.stagedHotkey!.ctrlKey || event.ctrlKey;
        this.stagedHotkey!.altKey = this.stagedHotkey!.altKey || event.altKey;
        this.stagedHotkey!.shiftKey = this.stagedHotkey!.shiftKey || event.shiftKey;
        if (this.isNonModifierKey(event.key)) {
            this.stagedHotkey!.key = event.key;
        }

        this.cdr.detectChanges();
    }

    public onKeyUp(event: KeyboardEvent): void {
        if (!this.stagedHotkey) this.createStagedHotkey();
        this.isEditing = true;
        event.stopPropagation();
        event.preventDefault();

        this.emitHotkeyIfReady();
        this.cdr.detectChanges();
    }

    public onBlur(): void {
        this.stagedHotkey = undefined;
        this.isEditing = false;
        this.cdr.detectChanges();
    }

    private createStagedHotkey(): void {
        this.stagedHotkey = new Hotkey(this.hotkey!.hotkeyName, this.hotkey!.friendlyName, "", false, false, false);
    }

    private emitHotkeyIfReady(): void {
        if (!this.stagedHotkey?.isBound) return;

        this.hotkeyChange.emit(this.stagedHotkey);
        this.isEditing = false;
    }

    private isNonModifierKey(key: string): boolean {
        return key !== "Control" && key !== "Alt" && key !== "Shift" && key !== "Meta";
    }
}
