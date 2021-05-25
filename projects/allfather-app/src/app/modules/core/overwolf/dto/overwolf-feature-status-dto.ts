import { FeatureState, FeatureStatusList, OverwolfFeatureDep } from "@allfather-app/app/common/feature-status";

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
    published: boolean;
    keys: FeatureKeyDTO[];
}

interface FeatureKeyDTO {
    name: string;
    type: FeatureTypeDTO;
    state: FeatureStateDTO;
    is_index: boolean;
    category: string | null;
    sample_data: string | null;
    published: boolean;
}

export class OverwolfGameDataStatusDTO {
    public game_id: number;
    public state: FeatureStateDTO;
    public disabled: boolean;
    public published: boolean;
    public features: FeatureDTO[] = [];

    constructor(json: unknown) {
        if (!isGameDataStatus(json)) throw Error(`Unable to create overwolf game status data transfer object.`);
        this.game_id = Number(json.game_id);
        this.state = Number(json.state);
        this.disabled = !!json.disabled;
        this.published = !!json.published;
        this.features = json.features.map((feat) => {
            const name = this.sanitizeName(feat.name);
            const published = !!feat.published;
            const state = Number(feat.state);
            const keys = feat.keys.map((k) => ({
                name: this.sanitizeName(k.name),
                type: Number(k.type),
                state: Number(k.state),
                is_index: !!k.is_index,
                category: this.sanitizeName(k.category ?? ""),
                sample_data: k.sample_data,
                published: !!k.published,
            }));
            return { name, published, state, keys };
        });
    }

    public toFeatureStatusList(): FeatureStatusList {
        return this.features.reduce((prev, curr): FeatureStatusList => {
            const appending: FeatureStatusList = {};
            curr.keys.forEach((key) => {
                const keyName = key.name as OverwolfFeatureDep;
                appending[keyName] = Number(key.state) as FeatureState;
            });
            return { ...prev, ...appending };
        }, {} as FeatureStatusList);
    }

    private sanitizeName(value?: string): string {
        return value?.replace(/[\W]/gi, "") ?? "";
    }
}

function isGameDataStatus(value: unknown): value is OverwolfGameDataStatusDTO {
    if (typeof value !== "object") return false;
    if ((value as OverwolfGameDataStatusDTO).game_id == null) return false;
    if ((value as OverwolfGameDataStatusDTO).state == null) return false;
    if ((value as OverwolfGameDataStatusDTO).disabled == null) return false;
    if ((value as OverwolfGameDataStatusDTO).published == null) return false;
    if ((value as OverwolfGameDataStatusDTO).features.every((f: unknown) => isFeature(f))) return false;
    return true;
}

function isFeature(value: unknown): value is FeatureDTO {
    if (typeof value !== "object") return false;
    if ((value as FeatureDTO).name == null) return false;
    if ((value as FeatureDTO).state == null) return false;
    if ((value as FeatureDTO).published == null) return false;
    if ((value as FeatureDTO).keys.every((k: unknown) => isFeatureKey(k))) return false;
    return true;
}

function isFeatureKey(value: unknown): value is FeatureKeyDTO {
    if (typeof value !== "object") return false;
    if ((value as FeatureKeyDTO).name == null) return false;
    if ((value as FeatureKeyDTO).type == null) return false;
    if ((value as FeatureKeyDTO).state == null) return false;
    if ((value as FeatureKeyDTO).is_index == null) return false;
    if ((value as FeatureKeyDTO).published == null) return false;
    return true;
}
