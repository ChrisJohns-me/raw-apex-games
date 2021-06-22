import { MatchInflictionEvent } from "@allfather-app/app/common/match/infliction-event";
import { isPlayerNameEqual } from "@allfather-app/app/common/utilities/player";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { Observable, partition } from "rxjs";
import { AllfatherService } from "../allfather-service.abstract";
import { MatchKillfeedService } from "./match-killfeed.service";
import { MatchRosterService } from "./match-roster.service";

/**
 * @classdesc Provides local player's team knockdown/kill
 * Killfeed can include kill events of the local player's team, when the local player's team finished off an already knocked down player.
 */
@Injectable({
    providedIn: "root",
    deps: [MatchKillfeedService, MatchRosterService],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("MatchPlayerTeamInflictionService", MatchPlayerTeamInflictionService, deps),
})
export class MatchPlayerTeamInflictionService extends AllfatherService {
    /** Local user's team's Killfeed event stream */
    public readonly myTeamKillfeedEvent$: Observable<MatchInflictionEvent>;
    /** Eliminations/knockdown event stream for all players except the local user's team */
    public readonly notMyTeamKillfeedEvent$: Observable<MatchInflictionEvent>;

    constructor(private readonly matchKillfeed: MatchKillfeedService, private readonly matchRoster: MatchRosterService) {
        super();
        const isTeamKillfeedEventFn = (killfeedEvent: MatchInflictionEvent): boolean => {
            const matchRoster = this.matchRoster.matchRoster$.value;
            const teamRoster = this.matchRoster.teammateRoster$.value;
            if (!matchRoster.allPlayers?.length) return false;
            const attacker = killfeedEvent.attacker;
            const isTeammateAttacker = !!attacker?.name && !!teamRoster.allPlayers.find((t) => isPlayerNameEqual(t.name, attacker.name));
            return isTeammateAttacker;
        };
        [this.myTeamKillfeedEvent$, this.notMyTeamKillfeedEvent$] = partition(this.matchKillfeed.killfeedEvent$, isTeamKillfeedEventFn);
    }
}
