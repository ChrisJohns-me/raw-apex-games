export enum OverwolfFeatureState {
    Unsupported = 0,
    Good = 1,
    Partial = 2,
    Unavailable = 3,
}

enum FeatureType {
    Event = 0,
    Info = 1,
}

interface Feature {
    name: string;
    state: OverwolfFeatureState;
    published: boolean;
    keys: FeatureKey[];
}

interface FeatureKey {
    name: string;
    type: FeatureType;
    state: OverwolfFeatureState;
    is_index: boolean;
    category: string | null;
    sample_data: string | null;
    published: boolean;
}

export class OverwolfGameDataStatusDTO {
    public game_id: number;
    public state: OverwolfFeatureState;
    public disabled: boolean;
    public published: boolean;
    public features: Feature[] = [];

    constructor(json: unknown) {
        if (!isGameDataStatus(json)) throw Error(`Unable to create game status data transfer object.`);
        this.game_id = json.game_id;
        this.state = json.state;
        this.disabled = json.disabled;
        this.published = json.published;
        this.features = json.features;
    }
}

function isGameDataStatus(value: unknown): value is OverwolfGameDataStatusDTO {
    if (typeof value !== "object") return false;
    if (typeof (value as OverwolfGameDataStatusDTO).game_id !== "number") return false;
    if (typeof (value as OverwolfGameDataStatusDTO).state !== "number") return false;
    if (typeof (value as OverwolfGameDataStatusDTO).disabled !== "boolean") return false;
    if (typeof (value as OverwolfGameDataStatusDTO).published !== "boolean") return false;
    if ((value as OverwolfGameDataStatusDTO).features.every((f: unknown) => isFeature(f))) return false;
    return true;
}

function isFeature(value: unknown): value is Feature {
    if (typeof value !== "object") return false;
    if (typeof (value as Feature).name !== "string") return false;
    if (typeof (value as Feature).state !== "number") return false;
    if (typeof (value as Feature).published !== "boolean") return false;
    if ((value as Feature).keys.every((k: unknown) => isFeatureKey(k))) return false;
    return true;
}

function isFeatureKey(value: unknown): value is FeatureKey {
    if (typeof value !== "object") return false;
    if (typeof (value as FeatureKey).name !== "string") return false;
    if (typeof (value as FeatureKey).type !== "number") return false;
    if (typeof (value as FeatureKey).state !== "number") return false;
    if (typeof (value as FeatureKey).is_index !== "boolean") return false;
    if (typeof (value as FeatureKey).published !== "boolean") return false;
    return true;
}
