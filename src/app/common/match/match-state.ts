export enum MatchState {
    Active = "active",
    Inactive = "inactive",
}

export interface MatchStateChangedEvent {
    startDate?: Date;
    endDate?: Date;
    state: MatchState;
}
