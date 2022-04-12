import { BaseService } from "@allfather-app/app/modules/core/base-service.abstract";
import { GoogleAnalyticsService } from "@allfather-app/app/modules/core/google-analytics.service";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable, OnDestroy } from "@angular/core";
import { isEmpty } from "common/utilities/";
import { combineLatest, of, Subject } from "rxjs";
import { catchError, filter, switchMap, takeUntil } from "rxjs/operators";
import { MatchService } from "../match/match.service";
import { ReportableDataManagerService } from "./reporting-engine/reportable-data-manager";
import { ReportingEngine, ReportingEngineId, ReportingStatus } from "./reporting-engine/reporting-engine";
import { GoogleAnalyticsReportingEngine } from "./reporting-engine/reporting-engines/google-analytics-reporting-engine";
import { LocalReportingEngine } from "./reporting-engine/reporting-engines/local-reporting-engine";
import { RunCondition } from "./reporting-engine/run-condition";

interface ReportingEvent {
    engine: ReportingEngine;
    status: ReportingStatus;
}

/**
 * @classdesc Watches for the match end event, runs all enabled reporting engines.
 */
@Injectable({
    providedIn: "root",
    deps: [GoogleAnalyticsService, MatchService, ReportableDataManagerService],
    useFactory: (...deps: any[]) => SingletonServiceProviderFactory("ReportingService", ReportingService, deps),
})
export class ReportingService extends BaseService implements OnDestroy {
    public reportingEvent$ = new Subject<ReportingEvent>();
    public runningReportingEngines: ReportingEngine[] = [];

    constructor(
        private readonly googleAnalytics: GoogleAnalyticsService,
        private readonly match: MatchService,
        private readonly reportableDataManager: ReportableDataManagerService
    ) {
        super();
        // TODO: Get settings, enable only those that are in user's settings
        this.restartEngines();

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
        console.debug(`[${this.constructor.name}] Starting Report Engine "${engineId}"`);
        if (engineId === ReportingEngineId.Local) this.runningReportingEngines.push(this.buildLocalReportingEngine());
        if (engineId === ReportingEngineId.GoogleAnalytics) this.runningReportingEngines.push(this.buildGoogleAnalyticsReportingEngine());
    }

    public stopEngine(engineId: ReportingEngineId): void {
        console.debug(`[${this.constructor.name}] Stopping Report Engine "${engineId}"`);
        this.runningReportingEngines.forEach((engine) => {
            if (engine.engineId === engineId) engine.teardown();
        });

        this.runningReportingEngines = this.runningReportingEngines.filter((engine) => engine.engineId !== engineId);
    }

    private setupOnMatchStart(): void {
        this.match.startedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            // this.reportableDataItems.forEach(dataItem => dataItem.doSomething());
        });
    }

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
                    console.debug(
                        `[${this.constructor.name}] [Reporting Engines] ` +
                            `All Finished (${numFailed} Failed, ${numSucceeded} Succeeded, ${numSkipped} Skipped)`
                    );

                    // Complete or Error; data is no longer needed.
                    this.reportableDataManager.clearAll();
                    this.runningReportingEngines.forEach((engine) => engine.reset());
                }
            });
    }

    private buildLocalReportingEngine(): LocalReportingEngine {
        const dataItems = this.reportableDataManager.instantiatedDataItems;
        if (isEmpty(dataItems)) throw Error(`Data items list was empty when building local reporting engine`);
        const setup = {
            reportableDataList: this.reportableDataManager.instantiatedDataItems,
            runConditions: [
                new RunCondition({
                    id: "LocalReportingEngine GameMode",
                    condition: () => !!this.match.gameMode$.value?.isReportable,
                }),
            ],
        };
        const localReportingEngine = new LocalReportingEngine(this.match);
        localReportingEngine.setup(setup);
        return localReportingEngine;
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
