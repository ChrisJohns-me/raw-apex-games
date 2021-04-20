import { MatchRosterService } from "@allfather-app/app/modules/core/match/match-roster.service";
import { MatchRoster } from "@allfather-app/app/shared/models/match/roster";
import { MatchRosterTeammate } from "@allfather-app/app/shared/models/match/roster-teammate";
import { BehaviorSubject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";

export class MockMatchRosterService implements MockedClass<MatchRosterService> {
    public matchRoster$ = new BehaviorSubject<ExtractSubjectType<MatchRosterService["matchRoster$"]>>(new MatchRoster());
    public teammateRoster$ = new BehaviorSubject<ExtractSubjectType<MatchRosterService["teammateRoster$"]>>(
        new MatchRoster<MatchRosterTeammate>()
    );
    public rosterPlayerDisconnectionList$: MatchRosterService["rosterPlayerDisconnectionList$"] = new BehaviorSubject<
        ExtractSubjectType<MatchRosterService["rosterPlayerDisconnectionList$"]>
    >([]);
    public numTeams$ = new BehaviorSubject<ExtractSubjectType<MatchRosterService["numTeams$"]>>(0);
    public startingNumTeams$ = new BehaviorSubject<ExtractSubjectType<MatchRosterService["startingNumTeams$"]>>(0);
    public numPlayers$ = new BehaviorSubject<ExtractSubjectType<MatchRosterService["numPlayers$"]>>(0);
    public startingNumPlayers$ = new BehaviorSubject<ExtractSubjectType<MatchRosterService["startingNumPlayers$"]>>(0);

    public init(): void {
        throw new Error("Method not implemented.");
    }
}
