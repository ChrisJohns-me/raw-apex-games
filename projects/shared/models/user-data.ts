import { removeNonAlphaNumericHyphenUnderscore } from "#shared/utilities/primitives/string.js";

interface UserDataConstructor {
    originId: string;
}

/** User data shared across API + APP */
export class UserData {
    public readonly originId: string;

    constructor(ctor?: ModelCtor<UserDataConstructor>) {
        this.originId = removeNonAlphaNumericHyphenUnderscore(ctor?.originId ?? "");
    }
}
