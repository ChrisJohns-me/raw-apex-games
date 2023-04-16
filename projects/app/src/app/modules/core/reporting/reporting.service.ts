import { Injectable, OnDestroy } from "@angular/core";
import { SettingKey } from "@app/app/common/settings";
import { BaseService } from "@app/app/modules/core/base-service.abstract";
import { GoogleAnalyticsService } from "@app/app/modules/core/google-analytics.service";
import { SingletonServiceProviderFactory } from "@app/app/singleton-service.provider.factory";
import { isEmpty } from "common/utilities/";
import { Subject, combineLatest, of } from "rxjs";
import { catchError, filter, switchMap, takeUntil } from "rxjs/operators";
import { MatchService } from "../match/match.service";
import { OverwolfGameDataService } from "../overwolf";
import { SessionStorageService } from "../session-storage/session-storage.service";
import { SettingsService } from "../settings.service";
import { ReportableDataManagerService } from "./reporting-engine/reportable-data-manager";
import { ReportingEngine, ReportingEngineId, ReportingStatus } from "./reporting-engine/reporting-engine";
import { GameLogReportingEngine } from "./reporting-engine/reporting-engines/game-log-reporting-engine";
import { GoogleAnalyticsReportingEngine } from "./reporting-engine/reporting-engines/google-analytics-reporting-engine";
import { LocalDBReportingEngine } from "./reporting-engine/reporting-engines/localdb-reporting-engine";
import { RunCondition } from "./reporting-engine/run-condition";

export interface ReportingEvent {
    engine: ReportingEngine;
    status: ReportingStatus;
}

/**
 * @classdesc Watches for the match end event, runs all enabled reporting engines.
 */
@Injectable({
    providedIn: "root",
    deps: [
        GoogleAnalyticsService,
        MatchService,
        OverwolfGameDataService,
        ReportableDataManagerService,
        SessionStorageService,
        SettingsService,
    ],
    useFactory: (...deps: any[]) => SingletonServiceProviderFactory("ReportingService", ReportingService, deps),
})
export class ReportingService extends BaseService implements OnDestroy {
    public reportingEvent$ = new Subject<ReportingEvent>();
    public runningReportingEngines: ReportingEngine[] = [];

    private localDBReportingEnabled = false;

    constructor(
        private readonly googleAnalytics: GoogleAnalyticsService,
        private readonly match: MatchService,
        private readonly overwolfGameData: OverwolfGameDataService,
        private readonly reportableDataManager: ReportableDataManagerService,
        private readonly sessionStorage: SessionStorageService,
        private readonly settings: SettingsService
    ) {
        super();
        this.restartEngines();
        this.setupSettingsListener();

        this.setupOnMatchStart();
        this.setupOnMatchEnd();
    }

    public ngOnDestroy(): void {
        this.stopEngines();
        super.ngOnDestroy();
    }

    public restartEngines(engineIds?: ReportingEngineId | ReportingEngineId[]): void {
        let _engineIds: ReportingEngineId[] = [];
        if (engineIds && !Array.isArray(engineIds)) _engineIds = [engineIds];
        if (isEmpty(_engineIds)) {
            // Start all
            Object.values(ReportingEngineId).forEach((id) => this.restartEngine(id));
        } else {
            // Start listed engines
            _engineIds.forEach((id) => this.restartEngine(id));
        }
    }

    public stopEngines(engineIds?: ReportingEngineId | ReportingEngineId[]): void {
        let _engineIds: ReportingEngineId[] = [];
        if (engineIds && !Array.isArray(engineIds)) _engineIds = [engineIds];
        if (isEmpty(_engineIds)) {
            // Stop all
            Object.values(ReportingEngineId).forEach((id) => this.stopEngine(id));
        } else {
            // Stop listed engines
            _engineIds.forEach((id) => this.stopEngine(id));
        }
    }

    public restartEngine(engineId: ReportingEngineId): void {
        this.stopEngine(engineId);
        console.debug(`[ReportingService] Starting Report Engine "${engineId}"`);
        if (engineId === ReportingEngineId.LocalDB) this.runningReportingEngines.push(this.buildLocalDBReportingEngine());
        if (engineId === ReportingEngineId.GameLog) this.runningReportingEngines.push(this.buildGameLogReportingEngine());
        if (engineId === ReportingEngineId.GoogleAnalytics) this.runningReportingEngines.push(this.buildGoogleAnalyticsReportingEngine());
    }

    public stopEngine(engineId: ReportingEngineId): void {
        console.debug(`[ReportingService] Stopping Report Engine "${engineId}"`);
        this.runningReportingEngines.forEach((engine) => {
            if (engine.engineId === engineId) engine.teardown();
        });

        this.runningReportingEngines = this.runningReportingEngines.filter((engine) => engine.engineId !== engineId);
    }

    private setupSettingsListener(): void {
        this.settings
            .streamSetting$<boolean>(SettingKey.EnableLocalDBReporting)
            .pipe(takeUntil(this.destroy$))
            .subscribe((setting) => {
                if (!isEmpty(setting?.value)) this.localDBReportingEnabled = !!setting!.value;
            });
    }

    private setupOnMatchStart(): void {}

    private setupOnMatchEnd(): void {
        this.match.endedEvent$
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => {
                    // Give each (started) engine it's opportunity to run.
                    this.runningReportingEngines.forEach((engine) => engine.runOpportunity());
                    const allStatuses$ = this.runningReportingEngines.map((engine) =>
                        engine.reportingStatus$.pipe(filter((s) => s !== ReportingStatus.WAITING))
                    );
                    return combineLatest(allStatuses$);
                }),
                catchError(() => of([ReportingStatus.FAIL]))
            )
            .subscribe((allStatuses) => {
                const numFailed = allStatuses.filter((s) => s === ReportingStatus.FAIL).length;
                const numInProgress = allStatuses.filter((s) => s === ReportingStatus.IN_PROGRESS).length;
                const numSucceeded = allStatuses.filter((s) => s === ReportingStatus.SUCCESS).length;
                const numSkipped = allStatuses.filter((s) => s === ReportingStatus.CRITERIA_NOT_MET).length;
                const allFinished = allStatuses.every(
                    (s) => s === ReportingStatus.SUCCESS || s === ReportingStatus.FAIL || s === ReportingStatus.CRITERIA_NOT_MET
                );

                // Emit reporting status events
                this.runningReportingEngines.forEach((engine) => {
                    this.reportingEvent$.next({
                        engine: engine,
                        status: engine.reportingStatus$.value,
                    });
                });

                if (allFinished) {
                    console.log(
                        `[ReportingService] [Reporting Engines] ` +
                            `All Finished (${numFailed} Failed, ${numSucceeded} Succeeded, ${numSkipped} Skipped)`
                    );

                    // Complete or Error; data is no longer needed.
                    this.reportableDataManager.clearAll();
                    this.runningReportingEngines.forEach((engine) => engine.reset());
                }
            });
    }

    private buildLocalDBReportingEngine(): LocalDBReportingEngine {
        const dataItems = this.reportableDataManager.instantiatedDataItems;
        if (isEmpty(dataItems)) throw Error(`Data items list was empty when building localDB reporting engine`);
        const setup = {
            reportableDataList: this.reportableDataManager.instantiatedDataItems,
            runConditions: [
                new RunCondition({
                    id: "LocalDBReportingEngine GameMode",
                    condition: () => !!this.match.gameMode$.value?.isReportable,
                }),
                new RunCondition({
                    id: "LocalDBReportingEngine Setting Enabled",
                    condition: () => !!this.localDBReportingEnabled,
                }),
            ],
        };
        const localDBReportingEngine = new LocalDBReportingEngine(this.match);
        localDBReportingEngine.setup(setup);
        return localDBReportingEngine;
    }

    private buildGameLogReportingEngine(): GameLogReportingEngine {
        const setup = {
            infoUpdatesObs: this.overwolfGameData.infoUpdates$,
            newGameEventObs: this.overwolfGameData.newGameEvent$,
            runConditions: [],
        };
        const gameLogReportingEngine = new GameLogReportingEngine(this.sessionStorage);
        gameLogReportingEngine.setup(setup);
        return gameLogReportingEngine;
    }

    private buildGoogleAnalyticsReportingEngine(): GoogleAnalyticsReportingEngine {
        const dataItems = this.reportableDataManager.instantiatedDataItems;
        if (isEmpty(dataItems)) throw Error(`Data items list was empty when building GA reporting engine`);
        const setup = {
            reportableDataList: this.reportableDataManager.instantiatedDataItems,
            runConditions: [],
        };
        const gaReportingEngine = new GoogleAnalyticsReportingEngine(this.googleAnalytics);
        gaReportingEngine.setup(setup);
        return gaReportingEngine;
    }
}
