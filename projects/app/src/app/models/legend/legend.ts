const idPrefix = `#character_`;
const idSuffix = `_NAME`;

export class Legend {
    public static dummieName = "dummie";

    constructor(public legendId?: ModelCtor<string>) {}

    //#region Static Methods
    /**
     * Generates a legend ID from a friendly name.
     * @example generateLegendId("bangalore") = "#character_bangalore_NAME"
     */
    public static generateLegendId(friendlyName: string): Optional<string> {
        if (!friendlyName) return;
        const lowercase = friendlyName.toLowerCase().replace(/[\W]/gi, "");
        return `${idPrefix}${lowercase}${idSuffix}`;
    }

    /**
     * Extracts a legend's name from in-game value.
     * @param keyName "#character_bangalore_NAME"
     * @returns "bangalore"
     */
    public static getName(legendId?: string): Optional<string> {
        if (!legendId) return;
        const findRegEx = new RegExp(`${idPrefix}(\\w+)${idSuffix}`, "i");
        const regExMatches = legendId?.match(findRegEx);

        if (!regExMatches || !regExMatches[1]) {
            console.error(`Couldn't extract legend's name from "${legendId}"`);
            return undefined;
        }

        return regExMatches[1];
    }

    /**
     * @returns Filename of legend's image.
     * @returns Defaults to DUMMIE's image, if legend's id is empty.
     */
    public static getPortraitFilename(legendId?: string): string {
        const legendName = Legend.getName(legendId) ?? Legend.dummieName;
        return Legend.generatePortraitFilename(legendName, "", "", "webp");
    }

    /**
     * @returns Filename of legend's square image.
     * @returns Defaults to DUMMIE's image, if legend's id is empty.
     */
    public static getSquarePortraitFilename(legendId?: string): string {
        const legendName = Legend.getName(legendId) ?? Legend.dummieName;
        return Legend.generatePortraitFilename(legendName, "", "_square", "webp");
    }
    //#endregion

    //#region Instantiation Methods
    public get name(): Optional<string> {
        return Legend.getName(this.legendId);
    }

    public get portraitFilename(): string {
        return Legend.getPortraitFilename(this.legendId);
    }

    public get squarePortraitFilename(): string {
        return Legend.getSquarePortraitFilename(this.legendId);
    }
    //#endregion

    private static generatePortraitFilename = (legendName: string, prefix = "", suffix = "", extension = "webp"): string =>
        `${prefix}${legendName}${suffix}.${extension}`;
}
