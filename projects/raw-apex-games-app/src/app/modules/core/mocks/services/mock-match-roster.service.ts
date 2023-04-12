import { OverwolfFeatureDep } from "@raw-apex-games-app/app/common/feature-status";
import { MatchRoster } from "@raw-apex-games-app/app/common/match/roster";
import { MatchRosterPlayer } from "@raw-apex-games-app/app/common/match/roster-player";
import { MatchRosterTeammate } from "@raw-apex-games-app/app/common/match/roster-teammate";
import { MatchRosterService } from "@raw-apex-games-app/app/modules/core/match/match-roster.service";
import { ExtractSubjectType } from "common/types/rxjs-utilities";
import { BehaviorSubject } from "rxjs";

export class MockMatchRosterService implements MockedClass<MatchRosterService> {
    public stagedMatchRoster$ = new BehaviorSubject<MatchRoster<MatchRosterPlayer>>(new MatchRoster());
    public stagedTeammateRoster$ = new BehaviorSubject<MatchRoster<MatchRosterPlayer>>(new MatchRoster());
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

    public isFeatureDepAvailable(featureName: OverwolfFeatureDep): boolean {
        return true;
    }

    public areAllFeatureDepsAvailable(): boolean {
        return true;
    }
}
