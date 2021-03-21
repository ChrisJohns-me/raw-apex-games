export enum MatchState {
    Active = "active",
    Inactive = "inactive",
}

export interface MatchStateChangeEvent {
    startDate?: Date;
    endDate?: Date;
    state: MatchState;
}
