import { findKeyByKeyRegEx, findValueByKeyRegEx, incrementedKeysToKeyedObject, incrementedKeysToValueArray } from "./object";

describe("ObjectUtilities", () => {
    describe("findKeyByKeyRegEx", () => {
        it("should return key from RegEx", () => {
            const actualKey = findKeyByKeyRegEx({ key_0: "value123" }, /^key_/);
            expect(actualKey).toEqual("key_0");
        });
    });

    describe("findValueByKeyRegEx", () => {
        it("should return value from RegEx", () => {
            const actualValue = findValueByKeyRegEx({ key_0: "value123" }, /^key_/);
            expect(actualValue).toEqual("value123");
        });
    });

    describe("incrementedKeysToKeyedObject", () => {
        it("should return an array of keys from RegEx", () => {
            const actualKey = incrementedKeysToKeyedObject<{ [key: number]: unknown }>(
                { unrelated_key: "empty", key_0: "value0", key_1: "value1", key_2: "value2" },
                /^key_(\d+)/
            );
            expect(actualKey).toEqual({ "0": "value0", "1": "value1", "2": "value2" });
        });
    });

    describe("incrementedKeysToValueArray", () => {
        it("should return an array of values from RegEx", () => {
            const actualKey = incrementedKeysToValueArray(
                { unrelated_key: "empty", key_0: "value0", key_1: "value1", key_2: "value2" },
                /^key_/
            );
            expect(actualKey).toEqual(["value0", "value1", "value2"]);
        });
    });
});
