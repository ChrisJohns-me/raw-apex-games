import { MatchRosterService } from "@core/match/match-roster.service";
import { MatchRoster } from "@shared/models/match/match-roster";
import { MatchRosterTeammate } from "@shared/models/match/match-roster-teammate";
import { BehaviorSubject } from "rxjs";

export class MockMatchRosterService implements MockedClass<MatchRosterService> {
    public matchRoster$ = new BehaviorSubject<MatchRosterService["matchRoster$"]["value"]>(new MatchRoster());
    public teammateRoster$ = new BehaviorSubject<MatchRosterService["teammateRoster$"]["value"]>(new MatchRoster<MatchRosterTeammate>());
    public rosterPlayerDisconnectionList$: MatchRosterService["rosterPlayerDisconnectionList$"] = new BehaviorSubject<
        MatchRosterService["rosterPlayerDisconnectionList$"]["value"]
    >([]);
    public numTeams$ = new BehaviorSubject<MatchRosterService["numTeams$"]["value"]>(0);
    public numPlayers$ = new BehaviorSubject<MatchRosterService["numPlayers$"]["value"]>(0);

    public start(): void {
        throw new Error("Method not implemented.");
    }
}
