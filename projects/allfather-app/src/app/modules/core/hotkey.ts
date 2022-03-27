import { OWHotKey, OWHotKeyAssignHotkeyObject } from "@allfather-app/app/common/services/overwolf";
import keycode from "keycode";

export enum HotkeyEnum {
    ToggleMain = "toggle_main",
}

export class Hotkey {
    public get isBound(): boolean {
        return this.keyCode !== 0;
    }

    public get friendlyBinding(): Optional<string> {
        if (!this.isBound) return undefined;
        return `${this.ctrlKey ? "Ctrl+" : ""}${this.altKey ? "Alt+" : ""}${this.shiftKey ? "Shift+" : ""}${this.key}`;
    }

    public get keyCode(): number {
        if (!this.key) return 0;
        return keycode(this.key);
    }

    public get key(): string {
        return this._key.toUpperCase();
    }
    public set key(value: string) {
        this._key = value;
    }

    constructor(
        public hotkeyName: HotkeyEnum | string,
        public friendlyName: string,
        private _key: string,
        public ctrlKey: boolean,
        public altKey: boolean,
        public shiftKey: boolean
    ) {}

    //#region static methods
    public static fromOWHotKeyObject(owHotKeyObject: OWHotKey): Hotkey {
        const [ctrl, alt, shift] = Hotkey.modifiersFromEnum(owHotKeyObject.modifierKeys);
        const key: string = keycode(owHotKeyObject.virtualKeycode).toUpperCase();
        return new Hotkey(owHotKeyObject.name, owHotKeyObject.title, key, ctrl, alt, shift);
    }

    /**
     * Converts/accumulates modifier keys' boolean to a number.
     * @returns {number} System.Windows.Input ModifierKeys Enum
     *    None 0
     *    Alt 1
     *    Control 2
     *    Shift 4
     * @example enumToModifiers(true, false, true) // => 5
     * @see https://docs.microsoft.com/en-us/dotnet/api/system.windows.input.modifierkeys
     */
    private static enumToModifiers(ctrl: boolean, alt: boolean, shift: boolean): number {
        let modifierEnum = 0;
        if (alt) modifierEnum += 1;
        if (ctrl) modifierEnum += 2;
        if (shift) modifierEnum += 4;
        return modifierEnum;
    }

    /**
     * Converts/de-accumulates modifier enum to boolean tuples.
     * @returns {[ctrl: boolean, alt: boolean, shift: boolean]}
     * @example modifiersFromEnum(5) // => [true, false, true]
     * @see https://docs.microsoft.com/en-us/dotnet/api/system.windows.input.modifierkeys
     */
    private static modifiersFromEnum(modifierEnum: number): [ctrl: boolean, alt: boolean, shift: boolean] {
        let ctrl = false;
        let alt = false;
        let shift = false;
        if (modifierEnum & 1) alt = true;
        if (modifierEnum & 2) ctrl = true;
        if (modifierEnum & 4) shift = true;
        return [ctrl, alt, shift];
    }
    //#endregion

    public toOWHotKeyAssignHotkeyObject(): OWHotKeyAssignHotkeyObject {
        const modifiers = {
            ctrl: this.ctrlKey,
            alt: this.altKey,
            shift: this.shiftKey,
        };
        const hotKeyAssignHotkeyObject = {
            name: this.hotkeyName,
            modifiers: modifiers,
            virtualKey: this.keyCode,
        };
        return hotKeyAssignHotkeyObject;
    }
}
