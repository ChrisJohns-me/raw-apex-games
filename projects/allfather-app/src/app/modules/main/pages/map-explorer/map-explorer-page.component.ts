import { MatchGameMode } from "@allfather-app/app/common/match/game-mode/game-mode";
import { MatchGameModeList } from "@allfather-app/app/common/match/game-mode/game-mode-list";
import { MatchMapCoordinates } from "@allfather-app/app/common/match/map/map-coordinates";
import { MatchMapList, sortMatchMapList } from "@allfather-app/app/common/match/map/map-list";
import { MatchMap } from "@allfather-app/app/common/match/map/match-map";
import { LocationPhaseNum, MatchDataStore } from "@allfather-app/app/modules/core/local-database/match-data-store";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { DataItem } from "@allfather-app/app/shared/components/match-listing/match-listing.component";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TrackByFunction } from "@angular/core";
import { FormControl } from "@angular/forms";
import { unique } from "common/utilities/primitives/array";
import { intervalToDuration } from "date-fns";
import { Observable, Subject } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";

const DEFAULT_NUM_ROWS = 25;

@Component({
    selector: "app-map-explorer-page",
    templateUrl: "./map-explorer-page.component.html",
    styleUrls: ["./map-explorer-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapExplorerPageComponent implements OnInit, OnDestroy {
    public isLoadingMatchList = false;
    public numDisplayMatches = DEFAULT_NUM_ROWS;
    public mapList: MatchMap[];
    public matchList: MatchDataStore[] = [];
    public selectedMatch?: MatchDataStore;
    public selectedMap?: MatchMap;
    public showMatchItems: DataItem[] = [
        DataItem.GameMode,
        DataItem.MatchDate,
        DataItem.SquadLegends,
        DataItem.Map,
        DataItem.Eliminations,
        DataItem.Placement,
        DataItem.Damage,
    ];

    public get isShowingAggregateData(): boolean {
        return !!this.selectedMap && !this.selectedMatch;
    }
    public get selectedMapMatchList(): MatchDataStore[] {
        return this.matchList.filter((m) => m.mapId === this.selectedMap?.mapId);
    }
    public get displayedLocationHistory(): MatchMapCoordinates[] {
        if (this.isShowingAggregateData) return this.aggregateMapLocationHistory;
        else if (!this.selectedMatch?.locationHistory || !Array.isArray(this.selectedMatch?.locationHistory)) return [];
        else return this.selectedMatch.locationHistory.filter((l) => l.value.phaseNum === LocationPhaseNum.HasLanded).map((l) => l.value);
    }

    // Form inputs
    public locationHistoryRange = new FormControl(1000);

    /** Num rows to add when user reaches the bottom of the scroll */
    private numAddRowsScroll = 25;
    private aggregateMapLocationHistory: MatchMapCoordinates[] = [];
    private destroy$ = new Subject<void>();

    constructor(private readonly cdr: ChangeDetectorRef, private readonly match: MatchService) {
        this.mapList = unique(MatchMapList, (m) => m.mapName);
        this.mapList = this.mapList.filter((m) => {
            const hasSupportedGameMode = m.gameModeTypes?.some((genericGameModeId) => {
                const gm = MatchGameMode.getFromId(MatchGameModeList, genericGameModeId);
                return gm.isAFSupported;
            });

            return hasSupportedGameMode && m.isChartable;
        });
        this.mapList = sortMatchMapList(this.mapList.filter((m) => m.isBattleRoyaleMap || m.isArenasMap));
    }

    public matchTrackBy: TrackByFunction<MatchDataStore> = (_, item) => item.matchId ?? item.endDate;
    public durationSinceNow = (baseDate: Date): Duration => intervalToDuration({ start: baseDate, end: new Date() });
    public getGameModeTypeName = (gameModeId: string): Optional<string> =>
        MatchGameMode.getFromId(MatchGameModeList, gameModeId).gameModeGenericId;
    public getMapFilename = MatchMap.getLayoutFilename;

    //#region Lifecycle Methods
    public ngOnInit(): void {
        this.getMatchList()
            .pipe(takeUntil(this.destroy$))
            .subscribe((matchList) => {
                this.matchList = matchList.filter((match) => {
                    if (!match.gameModeId) return false;
                    const gameMode = MatchGameMode.getFromId(MatchGameModeList, match.gameModeId);
                    const foundMatchMap = this.mapList.find((m) => m.isChartable && m.mapId === match.mapId);
                    return gameMode.isAFSupported && !!foundMatchMap;
                });
                // Select the last played map
                const lastPlayedMap = this.mapList.find((m) => m.isChartable && m.mapId === matchList[0].mapId);
                this.onSelectMapIdClick(lastPlayedMap?.mapId);
                this.refreshUI();
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
    //#endregion

    public onSelectMapIdClick(mapId?: MatchMap["mapId"]): void {
        const map = this.mapList.find((m) => m.mapId === mapId);
        this.setSelectedMap(map);
        this.setSelectedMatch(undefined);
        this.setShowAggregateMapData(true);
        this.refreshUI();
    }

    public onSelectMatchIdClick(matchId?: MatchDataStore["matchId"]): void {
        const match = this.matchList.find((m) => m.matchId === matchId);
        const matchMap = this.mapList.find((m) => m.mapId === match?.mapId);
        this.locationHistoryRange.enable({ emitEvent: false });
        this.setSelectedMap(matchMap);
        this.setSelectedMatch(match);
        this.setShowAggregateMapData(false);
        this.refreshUI();
    }

    public onMatchListingScroll(event: Event): void {
        const requiredBottomDistance = 100;
        const target = event.target as HTMLDivElement;
        const distanceFromBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
        const hasMoreRowsToDisplay = this.numDisplayMatches <= this.matchList.length;

        if (!hasMoreRowsToDisplay) return;
        if (distanceFromBottom < requiredBottomDistance) {
            this.numDisplayMatches += this.numAddRowsScroll;
        }
    }

    //#region Intermediate Functions
    private setSelectedMap(map?: MatchMap): void {
        if (!map?.mapId || map?.mapId === this.selectedMap?.mapId) return;
        this.selectedMap = map;
    }

    private setSelectedMatch(match?: MatchDataStore): void {
        this.selectedMatch = match;
        if (match?.matchId) {
            this.locationHistoryRange.enable({ emitEvent: false });
            this.locationHistoryRange.setValue(this.displayedLocationHistory?.length ?? Infinity, { emitEvent: false });
        }
    }

    private setShowAggregateMapData(show = true): void {
        if (show && this.selectedMap) {
            this.aggregateMapLocationHistory = this.extractAggregateMapLocationHistory(this.matchList, this.selectedMap);
            this.locationHistoryRange.disable({ emitEvent: false });
            this.locationHistoryRange.setValue(Infinity, { emitEvent: false });
        } else {
            this.aggregateMapLocationHistory = [];
        }
    }
    //#endregion

    //#region Low Order Functions
    private getMatchList(): Observable<MatchDataStore[]> {
        this.isLoadingMatchList = true;
        return this.match.getAllMatchData$().pipe(finalize(() => (this.isLoadingMatchList = false)));
    }

    private extractAggregateMapLocationHistory(matchList: MatchDataStore[], map: MatchMap): MatchMapCoordinates[] {
        return matchList
            .filter((m) => m.mapId === map.mapId)
            .reduce((prev, curr) => {
                if (!curr.locationHistory || !Array.isArray(curr.locationHistory)) return prev;
                const coordinates = curr.locationHistory.filter((l) => l.value.phaseNum === LocationPhaseNum.HasLanded).map((l) => l.value);
                return prev.concat(coordinates);
            }, [] as MatchMapCoordinates[]);
    }

    private refreshUI(): void {
        this.cdr.detectChanges();
    }
    //#endregion
}
