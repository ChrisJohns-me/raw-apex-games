import { wordsToUpperCase } from "shared/utilities/string";

export class Legend {
    constructor(public id?: string) {}

    /**
     * Extracts a legend's name from in-game value.
     * @param keyName "#character_bangalore_NAME"
     * @returns "bangalore"
     */
    public get friendlyName(): string {
        if (!this.id) return "";
        let newLegendName = this.id.toLowerCase();
        newLegendName = newLegendName.replace(/#character_/g, "");
        newLegendName = newLegendName.replace(/_name/g, "");
        newLegendName = newLegendName.replace(/_/g, " ");
        newLegendName = wordsToUpperCase(newLegendName);
        return newLegendName ?? "";
    }
}
