export class Legend {
    public static dummieName = "dummie";

    constructor(public legendId?: string) {}

    //#region Static Methods
    /**
     * Extracts a legend's name from in-game value.
     * @param keyName "#character_bangalore_NAME"
     * @returns "bangalore"
     */
    public static getName(legendId?: string): Optional<string> {
        if (!legendId) return;
        const findRegEx = /character_(\w+)_name/;
        const regExMatches = legendId?.toLowerCase().match(findRegEx);

        if (!regExMatches || !regExMatches[1]) {
            console.error(`Couldn't extract legend's name from "${legendId}"`);
            return undefined;
        } else {
            return regExMatches[1];
        }
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

    private static generatePortraitFilename = (legendName: string, prefix = "", postfix = "", extension = "webp"): string =>
        `${prefix}${legendName}${postfix}.${extension}`;
}
