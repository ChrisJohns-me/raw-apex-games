import { isEmpty } from "common/utilities";
import { format } from "date-fns";
import { BehaviorSubject, merge, Observable, Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { OWGameEvent, OWInfoUpdates2Event } from "../../../overwolf";
import { SessionStorageKeys } from "../../../session-storage/session-storage-keys";
import { SessionStorageService } from "../../../session-storage/session-storage.service";
import { ReportingEngine, ReportingEngineId, ReportingStatus } from "../reporting-engine";
import { RunCondition } from "../run-condition";

interface GameLog {
    timestamp: Date;
    data: string;
}

/**
 * @class GameLogReportingEngine
 * @classdesc Saves the last raw game event data to session storage.
 */
export class GameLogReportingEngine implements ReportingEngine {
    public engineId = ReportingEngineId.GameLog;
    public reportingStatus$ = new BehaviorSubject<ReportingStatus>(ReportingStatus.WAITING);
    public runConditions: RunCondition[] = [];

    private gameLogArr: GameLog[] = [];

    private infoUpdates$!: Observable<OWInfoUpdates2Event>;
    private newGameEvent$!: Observable<OWGameEvent>;
    private destroy$ = new Subject<void>();

    constructor(private readonly sessionStorage: SessionStorageService) {}

    public setup({
        infoUpdatesObs,
        newGameEventObs,
        runConditions,
    }: {
        infoUpdatesObs: Observable<OWInfoUpdates2Event>;
        newGameEventObs: Observable<OWGameEvent>;
        runConditions: RunCondition[];
    }): void {
        this.runConditions = runConditions;
        this.infoUpdates$ = infoUpdatesObs;
        this.newGameEvent$ = newGameEventObs;

        this.reset();
        this.setupLogSubscription();
    }

    public teardown(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public reset(): void {
        this.gameLogArr = [];
        this.reportingStatus$.next(ReportingStatus.WAITING);
    }

    public runOpportunity(): void {
        this.reportingStatus$.next(ReportingStatus.IN_PROGRESS);

        const shouldRun = !this.runConditions.length || this.runConditions.every((rc) => rc.conditionMet());

        if (shouldRun) {
            const logStr = this.formatGameLog(this.gameLogArr);
            const result = this.saveGameLog(logStr);

            this.reportingStatus$.next(result ? ReportingStatus.SUCCESS : ReportingStatus.FAIL);
            console.log(`[${this.constructor.name}] GameLog Reporting ${result ? "Succeeded" : "Failed"}`);
        } else {
            this.reportingStatus$.next(ReportingStatus.CRITERIA_NOT_MET);
            console.debug(`[${this.constructor.name}] Criteria not met; not running Game Log reporting engine.`);
        }
        this.gameLogArr = [];
    }

    private setupLogSubscription(): void {
        if (!this.infoUpdates$) return void console.error(`[${this.constructor.name}] Unable to listen to InfoUpdates; empty data stream.`);
        if (!this.newGameEvent$) return void console.error(`[${this.constructor.name}] Unable to listen to GameEvents; empty data stream.`);

        merge(this.infoUpdates$, this.newGameEvent$)
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.reportingStatus$.value === ReportingStatus.WAITING)
            )
            .subscribe((event) => this.addLogItem(event));
    }

    private addLogItem(input: any): void {
        const eventStr = JSON.stringify(input)?.trim();
        if (eventStr) this.gameLogArr.push({ data: eventStr, timestamp: new Date() });
    }

    private formatGameLog(log: GameLog[]): string {
        let formattedLog = "";
        const dateFormat = "yyyy-MM-dd hh:mm:ss.SSS aa";

        log.slice()
            .filter((logItem) => !isEmpty(logItem.timestamp) && !isEmpty(logItem.data))
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
            .forEach((logItem) => {
                const printedTimestamp = format(logItem.timestamp, dateFormat);
                formattedLog += `[${printedTimestamp}] ${logItem.data}\n`;
            });
        return formattedLog;
    }

    /** @returns boolean - successfully saved data */
    private saveGameLog(logText: string): boolean {
        if (isEmpty(logText)) {
            console.error(`[${this.constructor.name}] Empty game log.`);
            return false;
        }
        this.sessionStorage.set(SessionStorageKeys.LastGameLog, logText);
        return true;
    }
}
