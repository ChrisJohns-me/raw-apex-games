import { MatchService } from "#app/modules/core/match/match.service.js";
import { SingletonServiceProviderFactory } from "#app/singleton-service.provider.factory.js";
import { Injectable } from "@angular/core";
import { MatchKillfeedService } from "../../match/match-killfeed.service.js";
import { MatchMapService } from "../../match/match-map.service.js";
import { MatchPlayerInventoryService } from "../../match/match-player-inventory.service.js";
import { MatchPlayerLegendService } from "../../match/match-player-legend.service.js";
import { MatchPlayerLocationService } from "../../match/match-player-location.service.js";
import { MatchPlayerStatsService } from "../../match/match-player-stats.service.js";
import { MatchRosterService } from "../../match/match-roster.service.js";
import { PlayerService } from "../../player.service.js";
import { ReportableDataFactoryMap } from "./reportable-data.js";
import { AssistsDataFactory } from "./reportable-data/assists.js";
import { DamageDataFactory } from "./reportable-data/damage.js";
import { DeathLocationHistoryDataFactory } from "./reportable-data/death-location-history.js";
import { EliminationLocationHistoryDataFactory } from "./reportable-data/elimination-location-history.js";
import { EliminationsDataFactory } from "./reportable-data/eliminations.js";
import { GameModeDataFactory } from "./reportable-data/game-mode.js";
import { KnockdownsDataFactory } from "./reportable-data/knockdowns.js";
import { LegendDataFactory } from "./reportable-data/legend.js";
import { LocationHistoryDataFactory } from "./reportable-data/location-history.js";
import { MapDataFactory } from "./reportable-data/map.js";
import { MatchMetaDataFactory } from "./reportable-data/match-meta.js";
import { MatchRosterDataFactory } from "./reportable-data/match-roster.js";
import { MatchSummaryDataFactory } from "./reportable-data/match-summary.js";
import { NameDataFactory } from "./reportable-data/name.js";
import { PlacementDataFactory } from "./reportable-data/placement.js";
import { TeamRosterDataFactory } from "./reportable-data/team-roster.js";

/**
 * @class ReportableDataManager
 * @classdesc Assembles reportable data items; used to consolidate
 *  and organize reportable data instantiations.
 * Provides reporting engines with organized game data.
 * Good idea to only instantiate once; since this creates instances
 *  of the reportable data classes, which have observables that listen to game data.
 */
@Injectable({
    providedIn: "root",
    deps: [
        MatchService,
        MatchKillfeedService,
        MatchMapService,
        MatchPlayerInventoryService,
        MatchPlayerLegendService,
        MatchPlayerLocationService,
        MatchPlayerStatsService,
        MatchRosterService,
        PlayerService,
    ],
    useFactory: (...deps: any[]) => SingletonServiceProviderFactory("ReportableDataManagerService", ReportableDataManagerService, deps),
})
export class ReportableDataManagerService {
    /**
     * Created data items ready and to be used for reporting.
     */
    public instantiatedDataItems: ObjectPropertyTypes<ReportableDataFactoryMap>[] = [];

    constructor(
        private readonly match: MatchService,
        private readonly matchKillfeed: MatchKillfeedService,
        private readonly matchMap: MatchMapService,
        private readonly matchPlayerInventory: MatchPlayerInventoryService,
        private readonly matchPlayerLegend: MatchPlayerLegendService,
        private readonly matchPlayerLocation: MatchPlayerLocationService,
        private readonly matchPlayerStats: MatchPlayerStatsService,
        private readonly matchRoster: MatchRosterService,
        private readonly player: PlayerService
    ) {
        this.instantiateReportableDataItems();
    }

    /**
     * Clears all Reportable Data Items by calling their `clear()` method
     */
    public clearAll(): void {
        this.instantiatedDataItems.forEach((dataItem) => dataItem.clear());
    }

    private instantiateReportableDataItems(): void {
        this.instantiatedDataItems = [
            AssistsDataFactory(this.matchPlayerStats.myAssists$),
            DamageDataFactory(this.matchPlayerStats.myDamage$),
            DeathLocationHistoryDataFactory(this.matchPlayerLocation.myDeathCoordinates$),
            EliminationsDataFactory(this.matchPlayerStats.myEliminations$),
            EliminationLocationHistoryDataFactory(this.matchPlayerLocation.myEliminationCoordinates$),
            GameModeDataFactory(this.match.gameMode$),
            KnockdownsDataFactory(this.matchPlayerStats.myKnockdowns$),
            LegendDataFactory(this.matchPlayerLegend.myLegend$),
            LocationHistoryDataFactory(this.matchPlayerLocation.myCoordinates$, this.matchPlayerLocation.myLocationPhase$),
            MapDataFactory(this.matchMap.map$),
            MatchMetaDataFactory(this.match.endedEvent$),
            MatchRosterDataFactory(this.matchRoster.matchRoster$),
            MatchSummaryDataFactory({
                myAssistsObs: this.matchPlayerStats.myAssists$,
                myDamageObs: this.matchPlayerStats.myDamage$,
                myEliminationsObs: this.matchPlayerStats.myEliminations$,
                myDeathsObs: this.matchPlayerStats.myDeaths$,
                myKnockdownsObs: this.matchPlayerStats.myKnockdowns$,
                myPlacementObs: this.matchPlayerStats.myPlacement$,
                startingNumTeamsObs: this.matchRoster.startingNumTeams$,
            }),
            NameDataFactory(this.player.myName$),
            PlacementDataFactory(this.matchPlayerStats.myPlacement$),
            TeamRosterDataFactory(this.matchRoster.teammateRoster$),
        ];
    }
}
