import { MatchRoster } from "@common/match/match-roster";
import { MatchRosterTeammate } from "@common/match/match-roster-teammate";
import { BehaviorSubject } from "rxjs";

export class MockMatchRosterService {
    public matchRoster$ = new BehaviorSubject<MatchRoster>(new MatchRoster());
    public teammateRoster$ = new BehaviorSubject<MatchRoster<MatchRosterTeammate>>(new MatchRoster<MatchRosterTeammate>());
    public numTeams$ = new BehaviorSubject<number>(0);
    public numPlayers$ = new BehaviorSubject<number>(0);
}
