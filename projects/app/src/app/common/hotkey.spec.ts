import { OWHotKey, OWHotKeyAssignHotkeyObject } from "../modules/core/overwolf";
import { Hotkey, HotkeyEnum } from "./hotkey";

describe("Hotkey Class", () => {
    describe("computed properties", () => {
        it("isBound", () => {
            // Arrange
            const hotkey = new Hotkey(HotkeyEnum.ToggleMainInGame, "Test Title", "F", false, false, false);

            // Assert
            expect(hotkey.isBound).toBe(true);
        });

        it("friendlyBinding", () => {
            // Arrange
            const hotkey = new Hotkey(HotkeyEnum.ToggleMainInGame, "Test Title", "F", true, true, true);

            // Assert
            expect(hotkey.friendlyBinding).toBe("Ctrl+Alt+Shift+F");
        });

        it("keyCode", () => {
            // Arrange
            const hotkey = new Hotkey(HotkeyEnum.ToggleMainInGame, "Test Title", "F", true, true, true);

            // Assert
            expect(hotkey.keyCode).toBe(70);
        });

        it("keyCode (F3)", () => {
            // Arrange
            const hotkey = new Hotkey(HotkeyEnum.ToggleMainInGame, "Test Title", "F3", true, true, true);

            // Assert
            expect(hotkey.keyCode).toBe(114);
        });

        it("key returns uppercase", () => {
            // Arrange
            const hotkey = new Hotkey(HotkeyEnum.ToggleMainInGame, "Test Title", "f", true, true, true);

            // Assert
            expect(hotkey.key).toBe("F");
            expect(hotkey.keyCode).toBe(70);
        });

        it("key can be undefined", () => {
            // Arrange
            const hotkey = new Hotkey(HotkeyEnum.ToggleMainInGame, "Test Title", "", true, true, true);

            // Assert
            expect(hotkey.key).toBe("");
            expect(hotkey.keyCode).toBe(0);
        });
    });

    describe("fromOWHotKeyObject", () => {
        it("Creates Hotkey class from Overwolf Hotkey Object", () => {
            // Arrange
            const title = "Test Title";
            const owHotKeyObject: OWHotKey = {
                name: HotkeyEnum.ToggleMainInGame,
                title: title,
                virtualKeycode: 70, // F
                modifierKeys: 7, // Ctrl + Alt + Shift
                extensionuid: "abcdefghijklmnopqrstuvwxyz",
                isPassthrough: false,
                hold: false,
                IsUnassigned: false,
                binding: "Ctrl+Alt+Shift+F",
            };
            const expectedHotkey = new Hotkey(HotkeyEnum.ToggleMainInGame, title, "F", true, true, true);

            // Act
            const result = Hotkey.fromOWHotKeyObject(owHotKeyObject);

            // Assert
            expect(result).toEqual(expectedHotkey);
        });

        it("Creates Hotkey class from Overwolf Hotkey Object (F3)", () => {
            // Arrange
            const title = "Test Title";
            const owHotKeyObject: OWHotKey = {
                name: HotkeyEnum.ToggleMainInGame,
                title: title,
                virtualKeycode: 114, // F3
                modifierKeys: 7, // Ctrl + Alt + Shift
                extensionuid: "abcdefghijklmnopqrstuvwxyz",
                isPassthrough: false,
                hold: false,
                IsUnassigned: false,
                binding: "Ctrl+Alt+Shift+F3",
            };
            const expectedHotkey = new Hotkey(HotkeyEnum.ToggleMainInGame, title, "F3", true, true, true);

            // Act
            const result = Hotkey.fromOWHotKeyObject(owHotKeyObject);

            // Assert
            expect(result).toEqual(expectedHotkey);
        });

        it("Creates Hotkey class from Overwolf Hotkey Object (IsUnassigned)", () => {
            // Arrange
            const title = "Test Title";
            const owHotKeyObject: OWHotKey = {
                name: HotkeyEnum.ToggleMainInGame,
                title: title,
                virtualKeycode: 0,
                modifierKeys: 0,
                extensionuid: "abcdefghijklmnopqrstuvwxyz",
                isPassthrough: false,
                hold: false,
                IsUnassigned: true,
                binding: "",
            };
            const expectedHotkey = new Hotkey(HotkeyEnum.ToggleMainInGame, title, "", false, false, false);

            // Act
            const result = Hotkey.fromOWHotKeyObject(owHotKeyObject);

            // Assert
            expect(result).toEqual(expectedHotkey);
        });
    });

    describe("toOWHotKeyAssignHotkeyObject", () => {
        it("Creates Overwolf HotKeyAssignHotkeyObject from Hotkey class", () => {
            // Arrange
            const title = "Test Title";
            const expectedOWHotKeyObject: OWHotKeyAssignHotkeyObject = {
                name: HotkeyEnum.ToggleMainInGame,
                modifiers: {
                    ctrl: true,
                    alt: true,
                    shift: true,
                },
                virtualKey: 70, // F
            };

            // Act
            const hotkey = new Hotkey(HotkeyEnum.ToggleMainInGame, title, "f", true, true, true);
            const result = hotkey.toOWHotKeyAssignHotkeyObject();

            // Assert
            expect(result).toEqual(expectedOWHotKeyObject);
        });

        it("Creates Overwolf HotKeyAssignHotkeyObject from Hotkey class (F3)", () => {
            // Arrange
            const title = "Test Title";
            const expectedOWHotKeyObject: OWHotKeyAssignHotkeyObject = {
                name: HotkeyEnum.ToggleMainInGame,
                modifiers: {
                    ctrl: true,
                    alt: true,
                    shift: true,
                },
                virtualKey: 114, // F3
            };

            // Act
            const hotkey = new Hotkey(HotkeyEnum.ToggleMainInGame, title, "f3", true, true, true);
            const result = hotkey.toOWHotKeyAssignHotkeyObject();

            // Assert
            expect(result).toEqual(expectedOWHotKeyObject);
        });
    });
});
