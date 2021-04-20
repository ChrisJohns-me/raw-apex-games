type ConditionOptionId = "kills" | "damage" | "placement" | "gamemode";
type ConditionOptionType = "number" | "string";

export interface ConditionOption {
    id: ConditionOptionId;
    type: ConditionOptionType;
}

export const KillsConditionOption: ConditionOption = { id: 'damage', type: 'number' };
export const DamageConditionOption: ConditionOption = { id: 'damage', type: 'number' };
export const PlacementConditionOption: ConditionOption = { id: 'placement', type: 'number' };
export const GameModeConditionOption: ConditionOption = { id: 'gamemode', type: 'string' };