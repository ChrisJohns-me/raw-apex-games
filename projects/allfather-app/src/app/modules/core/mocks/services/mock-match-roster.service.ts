import { MatchRoster } from "@allfather-app/app/common/match/roster";
import { MatchRosterPlayer } from "@allfather-app/app/common/match/roster-player";
import { MatchRosterTeammate } from "@allfather-app/app/common/match/roster-teammate";
import { MatchRosterService } from "@allfather-app/app/modules/core/match/match-roster.service";
import { BehaviorSubject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";
import { OverwolfFeatureDep } from "../../overwolf/overwolf-feature-status.service";

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
