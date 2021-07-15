import { MatchKillfeedService } from "@allfather-app/app/modules/core/match/match-killfeed.service";
import { Injectable } from "@angular/core";
import { MatchInflictionEvent } from "@shared-app/match/infliction-event";
import { BaseService } from "@shared-app/services/base-service.abstract";
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { isPlayerNameEqual } from "@shared-app/utilities/player";
import { Observable, partition } from "rxjs";
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
export class MatchPlayerTeamInflictionService extends BaseService {
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
