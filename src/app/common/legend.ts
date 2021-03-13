export class Legend {
    public id?: string;
    public get friendlyName(): string {
        return this.id ? this.getFriendlyName(this.id) : "";
    }

    constructor(id?: string) {
        this.id = id;
    }

    /**
     * Extracts a legend's name from in-game value.
     * @param keyName "#character_bangalore_NAME"
     * @returns "bangalore"
     */
    private getFriendlyName(legendName?: string): string {
        if (!legendName) return "";
        let newLegendName = legendName.toLowerCase();
        newLegendName = newLegendName.replace(/#character_/g, "");
        newLegendName = newLegendName.replace(/_name/g, "");
        newLegendName = newLegendName.replace(/_/g, " ");
        return newLegendName ?? "";
    }
}
