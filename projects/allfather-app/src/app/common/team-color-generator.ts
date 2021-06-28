import { NIL, v5 as uuid } from "uuid";

/**
 * Uses team ID to generate a color
 * @returns {string} RGB color with hash
 */
export function teamColorGenerator(teamId: number): string {
    const generatedUUID = uuid(teamId.toString(), NIL);
    const rgbColor = generatedUUID.substr(-6);
    return `#${rgbColor}`;
}

export function generateTeamColorList(length: number): string[] {
    const list: string[] = [];
    for (let i = 0; i < length; i++) {
        list.push(teamColorGenerator(i));
    }
    return list;
}
