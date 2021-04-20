export enum MatchState {
    Active = "active",
    Inactive = "inactive",
}

export interface MatchStateChangedEvent {
    startDate?: Date;
    endDate?: Date;
    matchId: string;
    state: MatchState;
}
