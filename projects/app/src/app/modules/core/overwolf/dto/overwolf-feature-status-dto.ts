import { FeatureState, FeatureStates, OverwolfFeatureDep } from "@app/models/feature-status.js";

enum FeatureStateDTO {
    Unsupported = 0,
    Good = 1,
    Partial = 2,
    Unavailable = 3,
}

enum FeatureTypeDTO {
    Event = 0,
    Info = 1,
}

interface FeatureDTO {
    name: string;
    state: FeatureStateDTO;
    keys: FeatureKeyDTO[];
}

interface FeatureKeyDTO {
    name: string;
    type: FeatureTypeDTO;
    state: FeatureStateDTO;
    is_index: boolean;
    category: string | null;
    sample_data: string | null;
}

export class OverwolfGameDataStatusDTO {
    public game_id: number;
    public state: FeatureStateDTO;
    public features: FeatureDTO[] = [];

    constructor(json: unknown) {
        if (!isGameDataStatus(json)) throw Error(`Unable to create overwolf game status data transfer object.`);
        this.game_id = Number(json.game_id);
        this.state = Number(json.state);
        this.features = json.features.map((feat) => {
            const name = this.sanitizeName(feat.name);
            const state = Number(feat.state);
            const keys = feat.keys.map((k) => ({
                name: this.sanitizeName(k.name),
                type: Number(k.type),
                state: Number(k.state),
                is_index: !!k.is_index,
                category: this.sanitizeName(k.category ?? ""),
                sample_data: k.sample_data,
            }));
            return { name, state, keys };
        });
    }

    /** Also removes non-existent OverwolfFeatureDep keys */
    public toFeatureStates(): FeatureStates {
        return this.features.reduce((prev, curr): FeatureStates => {
            const appending: FeatureStates = {};
            curr.keys.forEach((key) => {
                const keyName = key.name as OverwolfFeatureDep;
                if (Object.values(OverwolfFeatureDep).includes(keyName)) {
                    appending[keyName] = Number(key.state) as FeatureState;
                } else {
                    console.warn(`Game event key "${keyName}" FeatureState does not exist, ignoring.`);
                }
            });
            return { ...prev, ...appending };
        }, {} as FeatureStates);
    }

    private sanitizeName(value?: string): string {
        return value?.replace(/[\W]/gi, "") ?? "";
    }
}

function isGameDataStatus(value: unknown): value is OverwolfGameDataStatusDTO {
    if (typeof value !== "object") return false;
    if ((value as OverwolfGameDataStatusDTO).game_id == null) return false;
    if ((value as OverwolfGameDataStatusDTO).state == null) return false;
    if ((value as OverwolfGameDataStatusDTO).features.every((f: unknown) => isFeature(f))) return false;
    return true;
}

function isFeature(value: unknown): value is FeatureDTO {
    if (typeof value !== "object") return false;
    if ((value as FeatureDTO).name == null) return false;
    if ((value as FeatureDTO).state == null) return false;
    if ((value as FeatureDTO).keys.every((k: unknown) => isFeatureKey(k))) return false;
    return true;
}

function isFeatureKey(value: unknown): value is FeatureKeyDTO {
    if (typeof value !== "object") return false;
    if ((value as FeatureKeyDTO).name == null) return false;
    if ((value as FeatureKeyDTO).type == null) return false;
    if ((value as FeatureKeyDTO).state == null) return false;
    if ((value as FeatureKeyDTO).is_index == null) return false;
    return true;
}
