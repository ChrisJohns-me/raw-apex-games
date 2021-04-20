import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable, OnDestroy } from "@angular/core";
import { combineLatest, of, Subject } from "rxjs";
import { catchError, filter, switchMap, takeUntil } from "rxjs/operators";
import { isEmpty } from "shared/utilities";
import { LocalDatabaseService } from "../local-database/local-database.service";
import { ReportableDataManagerService } from "./reporting-engine/reportable-data-manager";
import { ReportingEngine, ReportingEngineId, ReportingStatus } from "./reporting-engine/reporting-engine";
import { LocalReportingEngine } from "./reporting-engine/reporting-engines/local-reporting-engine";

/**
 * @classdesc Watches for the match end event, runs all enabled reporting engines.
 */
@Injectable({
    providedIn: "root",
    deps: [LocalDatabaseService, MatchService, ReportableDataManagerService],
    useFactory: (...deps: any[]) => SingletonServiceProviderFactory("ReportingService", ReportingService, deps),
})
export class ReportingService implements OnDestroy {
    public runningReportingEngines: ReportingEngine[] = [];
    public reportingFailedEvent$ = new Subject<void>();

    private readonly _unsubscribe$ = new Subject<void>();

    constructor(
        private readonly localDatabase: LocalDatabaseService,
        private readonly match: MatchService,
        private readonly reportableDataManager: ReportableDataManagerService
    ) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public init(): void {
        // TODO: Get preferences, enable only those that are in user's preferences
        this.restartEngines();

        this.setupOnMatchStart();
        this.setupOnMatchEnd();
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
    }

    public stopEngine(engineId: ReportingEngineId): void {
        console.debug(`[${this.constructor.name}] Stopping Report Engine "${engineId}"`);
        this.runningReportingEngines.forEach((engine) => {
            if (engine.engineId === engineId) engine.teardown();
        });

        this.runningReportingEngines = this.runningReportingEngines.filter((engine) => engine.engineId !== engineId);
    }

    private setupOnMatchStart(): void {
        this.match.startedEvent$.pipe(takeUntil(this._unsubscribe$)).subscribe(() => {
            // this.reportableDataItems.forEach(dataItem => dataItem.doSomething());
        });
    }

    private setupOnMatchEnd(): void {
        this.match.endedEvent$
            .pipe(
                takeUntil(this._unsubscribe$),
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

                console.debug(
                    `[${this.constructor.name}] [Reporting Engines] ` +
                        `All Finished (${numFailed} Failed, ${numSucceeded} Succeeded, ${numSkipped} Skipped)`
                );

                if (allFinished) {
                    // Complete or Error; data is no longer needed.
                    this.reportableDataManager.clearAll();
                    this.runningReportingEngines.forEach((engine) => engine.reset());
                }
            });
    }

    private buildLocalReportingEngine(): LocalReportingEngine {
        const setup = {
            reportableDataList: this.reportableDataManager.instantiatedDataItems,
            runConditions: [],
        };
        const localReportingEngine = new LocalReportingEngine(this.localDatabase);
        localReportingEngine.setup(setup);
        return localReportingEngine;
    }
}
