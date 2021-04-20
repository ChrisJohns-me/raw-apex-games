import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { delay, mapTo, mergeMap, retryWhen, takeUntil } from "rxjs/operators";
import { LocalDatabaseService } from "../../../local-database/local-database.service";
import { MatchDataStore } from "../../../local-database/match-data-store";
import { DamageConditionOption, GameModeConditionOption, KillsConditionOption, PlacementConditionOption } from "../condition-options";
import { ReportableDataFactoryMap } from "../reportable-data";
import { ReportingEngine, ReportingEngineId, ReportingStatus } from "../reporting-engine";
import { RunCondition } from "../run-condition";

const RETRY_COUNT = 5;
const RETRY_DELAY_MULTIPLIER = 12 * 1000;

/**
 * @class LocalReportingEngine
 * @classdesc Saves match data to local database.
 */
export class LocalReportingEngine implements ReportingEngine {
    // TODO: Maybe: implements ArchivalReportingEngine {
    public engineId = ReportingEngineId.Local;
    public reportingStatus$ = new BehaviorSubject<ReportingStatus>(ReportingStatus.WAITING);
    public availableConditionOptions = [KillsConditionOption, DamageConditionOption, PlacementConditionOption, GameModeConditionOption];
    public runConditions: RunCondition[] = [];
    public get isRunAlways(): boolean {
        return !this.runConditions?.length;
    }

    private reportableDataList: ObjectPropertyTypes<ReportableDataFactoryMap>[] = [];
    private _unsubscribe$ = new Subject<void>();

    constructor(private readonly localDatabase: LocalDatabaseService) {}

    public setup({
        reportableDataList,
        runConditions,
    }: {
        reportableDataList: ObjectPropertyTypes<ReportableDataFactoryMap>[];
        runConditions: RunCondition[];
    }): void {
        this.runConditions = runConditions;
        this.reportableDataList = reportableDataList;

        this.reset();
    }

    public teardown(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public reset(): void {
        this.reportingStatus$.next(ReportingStatus.WAITING);
    }

    public runOpportunity(): void {
        this.reportingStatus$.next(ReportingStatus.IN_PROGRESS);

        const shouldRun = this.runConditions.every((rc) => {
            const reportableData = this.reportableDataList.find((d) => d.dataId === rc.condition.id);
            return rc.conditionMet(reportableData?.value);
        });

        if (shouldRun) {
            const matchData = this.getMatchData();
            this.saveMatchData(matchData)
                .pipe(takeUntil(this._unsubscribe$))
                .subscribe((success) => {
                    this.reportingStatus$.next(success ? ReportingStatus.SUCCESS : ReportingStatus.FAIL);
                    console.log(`[${this.constructor.name}] Reporting Succeeded: ${success ? "Yes" : "No :("}`);
                });
        } else {
            this.reportingStatus$.next(ReportingStatus.CRITERIA_NOT_MET);
            console.debug(`[${this.constructor.name}] Criteria not met; not running local reporting engine.`);
        }
    }

    /**
     * @returns boolean - successfully saved data
     */
    private saveMatchData(matchData: MatchDataStore): Observable<boolean> {
        return this.localDatabase.storeMatch(matchData).pipe(
            retryWhen((errors) =>
                errors.pipe(
                    mergeMap((error, i) => {
                        const retryAttempt = i + 1;
                        if (retryAttempt >= RETRY_COUNT) return of(false);

                        console.error(
                            `[${this.constructor.name}] Saving match data (to local) failed. Retrying...(#${retryAttempt})\n` +
                                `Error: ${error?.message ?? JSON.stringify(error)}`
                        );
                        const delayMs = retryAttempt * RETRY_DELAY_MULTIPLIER;
                        return of(error).pipe(delay(delayMs));
                    })
                )
            ),
            mapTo(true)
        );
    }

    /**
     * Throws error if any data item is missing
     * @returns {MatchDataStore}
     */
    private getMatchData(): MatchDataStore {
        const getDataById = <T extends ReportableDataFactoryMap, K extends keyof T, P extends T[K]>(dataId: K) =>
            this.reportableDataList.find((di) => di.dataId === dataId) as P | undefined;

        const emptyMatchSummary = {
            assists: 0,
            damage: 0,
            eliminations: 0,
            knockdowns: 0,
            maxPlacement: 0,
            placement: 0,
        };

        const matchMeta = getDataById("matchMeta")?.value;
        const map = getDataById("map")?.value;
        return {
            matchId: matchMeta?.matchId ?? "",
            startDate: matchMeta?.startDate ?? new Date(),
            endDate: matchMeta?.endDate ?? new Date(),
            myName: getDataById("name")?.value ?? "",
            gameModeId: getDataById("gameMode")?.value?.gameModeId ?? "",
            mapId: map?.mapId ?? "",
            mapLayoutId: map?.layoutId ?? "",
            matchSummary: getDataById("matchSummary")?.value ?? emptyMatchSummary,
            matchRoster: getDataById("matchRoster")?.value ?? [],
            teamRoster: getDataById("teamRoster")?.value ?? [],
            legendId: getDataById("legend")?.value?.legendId ?? "",
            killfeedHistory: getDataById("killfeedHistory")?.value ?? [],
            damageEventsHistory: getDataById("damageEventsHistory")?.value ?? [],
            locationHistory: getDataById("locationHistory")?.value ?? [],
            weaponIdsHistory: getDataById("weaponIdsHistory")?.value ?? [],
            ultimateUsageDates: getDataById("ultimateUsageDates")?.value ?? [],
            gameEventsHistory: getDataById("gameEventsHistory")?.value ?? [],
        };
    }
}
