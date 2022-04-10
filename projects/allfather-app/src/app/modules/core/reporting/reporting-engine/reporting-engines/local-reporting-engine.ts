import { MatchLocationPhase } from "@allfather-app/app/common/match/location";
import { isEmpty } from "common/utilities/";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { delay, map, mergeMap, retryWhen, takeUntil } from "rxjs/operators";
import { MatchDataStore } from "../../../local-database/match-data-store";
import { MatchService } from "../../../match/match.service";
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
    public engineId = ReportingEngineId.Local;
    public reportingStatus$ = new BehaviorSubject<ReportingStatus>(ReportingStatus.WAITING);
    public runConditions: RunCondition[] = [];

    private reportableDataList: ObjectPropertyTypes<ReportableDataFactoryMap>[] = [];
    private destroy$ = new Subject<void>();

    constructor(private readonly match: MatchService) {}

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
        this.destroy$.next();
        this.destroy$.complete();
    }

    public reset(): void {
        this.reportingStatus$.next(ReportingStatus.WAITING);
    }

    public runOpportunity(): void {
        this.reportingStatus$.next(ReportingStatus.IN_PROGRESS);

        const shouldRun = !this.runConditions?.length || this.runConditions.every((rc) => rc.conditionMet());

        if (shouldRun) {
            const matchData = this.getMatchData();
            this.saveMatchData(matchData)
                .pipe(takeUntil(this.destroy$))
                .subscribe((success) => {
                    this.reportingStatus$.next(success ? ReportingStatus.SUCCESS : ReportingStatus.FAIL);
                    console.log(`[${this.constructor.name}] Local Reporting Succeeded: ${success ? "Yes" : "No :("}`);
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
        return this.match.storeMatchData$(matchData).pipe(
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
            map(() => true)
        );
    }

    /**
     * Throws error if any data item is missing
     * @returns {MatchDataStore}
     * @todo Profile Performance
     * @throws if data is missing or corrupt
     */
    private getMatchData(): MatchDataStore {
        const getDataById = <T extends ReportableDataFactoryMap, K extends keyof T, P extends T[K]>(dataId: K) =>
            this.reportableDataList.find((di) => di.dataId === dataId) as P | undefined;

        const emptyMatchSummary = {
            assists: 0,
            damage: 0,
            eliminations: 0,
            deaths: 0,
            knockdowns: 0,
            maxPlacement: 0,
            placement: 0,
        };
        const matchSummary = getDataById("matchSummary")?.value ?? emptyMatchSummary;
        const matchMeta = getDataById("matchMeta")?.value;
        const map = getDataById("map")?.value;

        const matchData = {
            matchId: matchMeta?.matchId ?? "",
            startDate: matchMeta?.startDate ?? new Date(),
            endDate: matchMeta?.endDate ?? new Date(),
            myName: getDataById("name")?.value ?? "",
            gameModeId: getDataById("gameMode")?.value?.gameModeId ?? "",
            mapId: map?.mapId ?? "",
            assists: matchSummary.assists,
            damage: matchSummary.damage,
            deaths: matchSummary.deaths,
            eliminations: matchSummary.eliminations,
            knockdowns: matchSummary.knockdowns,
            maxPlacement: matchSummary.maxPlacement,
            placement: matchSummary.placement,
            matchRoster: getDataById("matchRoster")?.value ?? [],
            teamRoster: getDataById("teamRoster")?.value ?? [],
            legendId: getDataById("legendId")?.value?.legendId ?? "",
            killfeedHistory: getDataById("killfeedHistory")?.value ?? [],
            damageEventsHistory: getDataById("damageEventsHistory")?.value ?? [],
            deathLocationHistory: getDataById("deathLocationHistory")?.value ?? [],
            eliminationLocationHistory: getDataById("eliminationLocationHistory")?.value ?? [],
            locationHistory: getDataById("locationHistory")?.value.map((loc) => composeLocationCoordinate(loc)) ?? [],
            weaponIdsHistory: getDataById("weaponIdsHistory")?.value ?? [],
            ultimateUsageDates: getDataById("ultimateUsageDates")?.value ?? [],
        };

        if (!matchData.matchRoster?.length || isEmpty(matchData.matchId)) throw Error(`Match data is missing or corrupt`);

        return matchData;
    }
}

/** Store locationHistory.phase as number */
function composeLocationCoordinate(
    location: ReportableDataFactoryMap["locationHistory"]["value"][0]
): NonNullable<MatchDataStore["locationHistory"]>[0] {
    return {
        timestamp: location.timestamp,
        value: {
            x: location.value.x,
            y: location.value.y,
            z: location.value.z,
            phaseNum: mapLocationPhase(location.value.phase, "in"),
        },
    };
}

type MapLocationPhaseDirection = "in" | "out";
type MapLocationPhaseType<T> = T extends "in" ? number : T extends "out" ? MatchLocationPhase : never;
/**
 * @returns mapped location phase, converted from either number or MatchLocationPhase
 * @param direction
 *  - "in" = into the local database (stored as number)
 *  - "out" = out of local database (stored as typeof MatchLocationPhase)
 */
function mapLocationPhase<T extends MapLocationPhaseDirection>(
    inputPhase: number | MatchLocationPhase,
    direction: T
): MapLocationPhaseType<T> {
    const defaultPhase = MatchLocationPhase.HasLanded;
    const mapping: { [key in MatchLocationPhase]: number } = {
        [MatchLocationPhase.Dropping]: 0,
        [MatchLocationPhase.Dropship]: 1,
        [MatchLocationPhase.HasLanded]: 2,
    };

    if (typeof inputPhase === "number" && direction === "out") {
        const foundMappedPhase = Object.entries(mapping).find(([, numPhase]): boolean => numPhase === inputPhase);
        return (foundMappedPhase?.[0] ?? defaultPhase) as MapLocationPhaseType<T>;
    } else if (typeof inputPhase === "string" && direction === "in") {
        const foundMappedPhase = Object.entries(mapping).find(([strPhase]): boolean => strPhase === inputPhase);
        return (foundMappedPhase?.[1] ?? mapping[defaultPhase]) as MapLocationPhaseType<T>;
    } else {
        return inputPhase as MapLocationPhaseType<T>;
    }
}
