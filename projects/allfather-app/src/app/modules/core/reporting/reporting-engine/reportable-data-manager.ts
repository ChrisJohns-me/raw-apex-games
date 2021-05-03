import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { MatchActivityService } from "../../match/match-activity.service";
import { MatchMapService } from "../../match/match-map.service";
import { MatchPlayerInflictionService } from "../../match/match-player-infliction.service";
import { MatchPlayerInventoryService } from "../../match/match-player-inventory.service";
import { MatchPlayerLegendService } from "../../match/match-player-legend.service";
import { MatchPlayerLocationService } from "../../match/match-player-location.service";
import { MatchPlayerStatsService } from "../../match/match-player-stats.service";
import { MatchRosterService } from "../../match/match-roster.service";
import { MatchService } from "../../match/match.service";
import { PlayerService } from "../../player.service";
import { ReportableDataFactoryMap } from "./reportable-data";
import { AssistsDataFactory } from "./reportable-data/assists";
import { DamageDataFactory } from "./reportable-data/damage";
import { DamageEventsHistoryDataFactory } from "./reportable-data/damage-events-history";
import { EliminationsDataFactory } from "./reportable-data/eliminations";
import { GameModeDataFactory } from "./reportable-data/game-mode";
import { KillfeedHistoryDataFactory } from "./reportable-data/killfeed-history";
import { KnockdownsDataFactory } from "./reportable-data/knockdowns";
import { LegendDataFactory } from "./reportable-data/legend";
import { LocationHistoryDataFactory } from "./reportable-data/location-history";
import { MapDataFactory } from "./reportable-data/map";
import { MatchMetaDataFactory } from "./reportable-data/match-meta";
import { MatchRosterDataFactory } from "./reportable-data/match-roster";
import { MatchSummaryDataFactory } from "./reportable-data/match-summary";
import { NameDataFactory } from "./reportable-data/name";
import { PlacementDataFactory } from "./reportable-data/placement";
import { TeamRosterDataFactory } from "./reportable-data/team-roster";
import { UltimateUsageDatesDataFactory } from "./reportable-data/ultimate-usage-dates";
import { WeaponIdsHistoryDataFactory } from "./reportable-data/weapon-ids-history";

/**
 * @class ReportableDataManager
 * @classdesc Assembles reportable data items; used to consolidate
 *  and organize reportable data instantiations.
 * Provides reporting engines with organized game data.
 * Good idea to only instantiate once; since this creates insteances
 *  of the reportable data classes, which have observables that listen to game data.
 */
@Injectable({
    providedIn: "root",
    deps: [
        MatchService,
        MatchActivityService,
        MatchMapService,
        MatchPlayerInflictionService,
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
        private readonly matchActivity: MatchActivityService,
        private readonly matchMap: MatchMapService,
        private readonly matchPlayerInfliction: MatchPlayerInflictionService,
        private readonly matchPlayerInventory: MatchPlayerInventoryService,
        private readonly matchPlayerLegend: MatchPlayerLegendService,
        private readonly matchPlayerLocation: MatchPlayerLocationService,
        private readonly matchPlayerStats: MatchPlayerStatsService,
        private readonly matchRoster: MatchRosterService,
        private readonly player: PlayerService
    ) {}

    public init(): void {
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
            DamageEventsHistoryDataFactory(this.matchPlayerInfliction.myDamageEvent$),
            EliminationsDataFactory(this.matchPlayerStats.myEliminations$),
            GameModeDataFactory(this.match.gameMode$),
            KillfeedHistoryDataFactory(this.matchActivity.killfeedEvent$),
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
                myKnockdownsObs: this.matchPlayerStats.myKnockdowns$,
                myPlacementObs: this.matchPlayerStats.myPlacement$,
                startingNumTeamsObs: this.matchRoster.startingNumTeams$,
            }),
            NameDataFactory(this.player.myName$),
            PlacementDataFactory(this.matchPlayerStats.myPlacement$),
            TeamRosterDataFactory(this.matchRoster.teammateRoster$),
            UltimateUsageDatesDataFactory(this.matchPlayerLegend.myUltimateUsage$),
            WeaponIdsHistoryDataFactory(this.matchPlayerInventory.myWeaponSlots$),
        ];
    }
}
