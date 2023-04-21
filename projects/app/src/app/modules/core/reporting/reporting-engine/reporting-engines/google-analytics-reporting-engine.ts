import { MatchLocationPhase } from "#app/models/match/location.js";
import { GoogleAnalyticsService } from "#app/modules/core/google-analytics.service.js";
import { differenceInMinutes } from "date-fns";
import { BehaviorSubject, Subject } from "rxjs";
import { ReportableDataFactoryMap } from "../reportable-data.js";
import { ReportingEngine, ReportingEngineId, ReportingStatus } from "../reporting-engine.js";
import { RunCondition } from "../run-condition.js";

/**
 * @class GoogleAnalyticsReportingEngine
 * @classdesc Saves match meta data Google Analytics
 */
export class GoogleAnalyticsReportingEngine implements ReportingEngine {
    public engineId = ReportingEngineId.GoogleAnalytics;
    public reportingStatus$ = new BehaviorSubject<ReportingStatus>(ReportingStatus.WAITING);
    public runConditions: RunCondition[] = [];

    private reportableDataList: ObjectPropertyTypes<ReportableDataFactoryMap>[] = [];
    private destroy$ = new Subject<void>();

    constructor(private readonly googleAnalytics: GoogleAnalyticsService) {}

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

        const shouldRun = !this.runConditions.length || this.runConditions.every((rc) => rc.conditionMet());

        if (shouldRun) {
            try {
                this.reportMatchMetaData();
                this.reportingStatus$.next(ReportingStatus.SUCCESS);
            } catch (e) {
                console.error(`[${this.constructor.name}] Error while reporting to GA; ${e}`);
                this.reportingStatus$.next(ReportingStatus.FAIL);
            }
        } else {
            this.reportingStatus$.next(ReportingStatus.CRITERIA_NOT_MET);
            console.debug(`[${this.constructor.name}] Criteria not met; not running GA reporting engine.`);
        }
    }

    private reportMatchMetaData(): void {
        const getDataById = <T extends ReportableDataFactoryMap, K extends keyof T, P extends T[K]>(dataId: K) =>
            this.reportableDataList.find((di) => di.dataId === dataId) as P | undefined;

        const matchSummary = getDataById("matchSummary")?.value ?? {
            assists: 0,
            damage: 0,
            eliminations: 0,
            knockdowns: 0,
            maxPlacement: 0,
            placement: 0,
        };
        const matchMeta = getDataById("matchMeta")?.value;
        const map = getDataById("map")?.value;
        const locationHistory = getDataById("locationHistory")?.value ?? [];

        const myName = getDataById("name")?.value ?? "";
        const duration = differenceInMinutes(matchMeta?.endDate ?? new Date(), matchMeta?.startDate ?? new Date());
        const gameModeId = getDataById("gameMode")?.value?.gameModeId ?? "";
        const mapId = map?.mapId ?? "";
        const assists = matchSummary.assists;
        const damage = matchSummary.damage;
        const eliminations = matchSummary.eliminations;
        const knockdowns = matchSummary.knockdowns;
        const maxPlacement = matchSummary.maxPlacement;
        const placement = matchSummary.placement;
        const legendId = getDataById("legendId")?.value?.legendId ?? "";
        const dropshipStartLocation = locationHistory[0]?.value ?? { x: 0, y: 0, z: 0 };
        const landingLocation = locationHistory.find((l) => l.value.phase === MatchLocationPhase.Landed)?.value ?? { x: 0, y: 0, z: 0 };
        const playerEndLocation = locationHistory[locationHistory.length - 1]?.value ?? { x: 0, y: 0, z: 0 };

        this.googleAnalytics.sendEvent("Match Meta", "Player Play Duration", `${myName}`, duration);
        this.googleAnalytics.sendEvent("Match Meta", "Game Mode Play Duration", `${gameModeId}`, duration);
        this.googleAnalytics.sendEvent("Match Meta", "Map Play Duration", `${mapId}`, duration);
        this.googleAnalytics.sendEvent("Match Meta", "Legend Play Duration", `${legendId}`, duration);
        this.googleAnalytics.sendEvent("Match Meta", "Match Summary", "Assists", assists);
        this.googleAnalytics.sendEvent("Match Meta", "Match Summary", "Damage", damage);
        this.googleAnalytics.sendEvent("Match Meta", "Match Summary", "Eliminations", eliminations);
        this.googleAnalytics.sendEvent("Match Meta", "Match Summary", "Knockdowns", knockdowns);
        this.googleAnalytics.sendEvent("Match Meta", "Match Summary", "Placement", placement);
        this.googleAnalytics.sendEvent("Match Meta", "Match Summary", "Max Placement", maxPlacement);
        this.googleAnalytics.sendEvent(
            "Match Meta",
            "Dropship Start Location",
            `${dropshipStartLocation.x}, ${dropshipStartLocation.y}, ${dropshipStartLocation.z}`
        );
        this.googleAnalytics.sendEvent(
            "Match Meta",
            "Landing Location",
            `${landingLocation.x}, ${landingLocation.y}, ${landingLocation.z}`
        );
        this.googleAnalytics.sendEvent(
            "Match Meta",
            "Player End Location",
            `${playerEndLocation.x}, ${playerEndLocation.y}, ${playerEndLocation.z}`
        );
    }
}
