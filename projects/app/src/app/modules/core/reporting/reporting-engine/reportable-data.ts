import { isObservable, Observable, Subscription, Timestamp } from "rxjs";
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
 * Helper to map DataItem types
 */
export interface ReportableDataFactoryMap {
    assists: ReturnType<typeof AssistsDataFactory>;
    damage: ReturnType<typeof DamageDataFactory>;
    deathLocationHistory: ReturnType<typeof DeathLocationHistoryDataFactory>;
    eliminationLocationHistory: ReturnType<typeof EliminationLocationHistoryDataFactory>;
    eliminations: ReturnType<typeof EliminationsDataFactory>;
    gameMode: ReturnType<typeof GameModeDataFactory>;
    knockdowns: ReturnType<typeof KnockdownsDataFactory>;
    legendId: ReturnType<typeof LegendDataFactory>;
    locationHistory: ReturnType<typeof LocationHistoryDataFactory>;
    map: ReturnType<typeof MapDataFactory>;
    matchMeta: ReturnType<typeof MatchMetaDataFactory>;
    matchRoster: ReturnType<typeof MatchRosterDataFactory>;
    matchSummary: ReturnType<typeof MatchSummaryDataFactory>;
    name: ReturnType<typeof NameDataFactory>;
    placement: ReturnType<typeof PlacementDataFactory>;
    teamRoster: ReturnType<typeof TeamRosterDataFactory>;
}

type ReportableDataConstructor<T> = { dataId: keyof ReportableDataFactoryMap; source$: Observable<T> };

/**
 * @abstract
 * @classdesc Pieces of game data that can be tracked via Observable variable.
 *   Used to gather output of game data.
 */
export abstract class ReportableData<T> {
    public dataId: keyof ReportableDataFactoryMap;
    /** Based on the capture method */
    protected abstract value: unknown;
    protected source$?: Observable<T>;
    protected sourceSubcription?: Subscription;

    constructor({ dataId, source$ }: ReportableDataConstructor<T>) {
        this.dataId = dataId;

        if (!isObservable(source$)) {
            throw new Error(
                `Reportable Data Item ID: "${this.dataId}" has no qualified data source. ${this.source$}:(${typeof this.source$})`
            );
        }
        this.source$ = source$;
        this.setup();
    }

    public teardown(): void {
        this.sourceSubcription?.unsubscribe();
    }

    public clear(): void {
        this.value = Array.isArray(this.value) ? [] : undefined;
    }

    protected setup(): void {
        if (!this.source$) return;
        if (this.sourceSubcription) this.sourceSubcription.unsubscribe();
    }
}

type ReportableDataSnapshotConstructor<T> = { persist?: boolean } & ReportableDataConstructor<T>;
/**
 * @class ReportableDataSnapshot
 * @classdesc Data is captured on matchEnd.
 * @param {boolean} [persist=false] Do not clear value; can still be overwritten.
 */
export class ReportableDataSnapshot<T> extends ReportableData<T> {
    public value: Optional<T>;

    private persist: boolean;

    constructor({ dataId, source$, persist = false }: ReportableDataSnapshotConstructor<T>) {
        super({ dataId, source$ });
        this.persist = persist;
    }

    public setup(): void {
        super.setup();
        this.sourceSubcription = this.source$?.subscribe((data) => (this.value = data));
    }

    public clear(): void {
        if (this.persist) return;
        super.clear();
    }
}

/**
 * @class ReportableDataStream
 * @classdesc Array of data captured since matchStart until matchEnd.
 */
export class ReportableDataStream<T> extends ReportableData<T> {
    public value: T[] = [];

    public setup(): void {
        super.setup();
        this.sourceSubcription = this.source$?.subscribe((data) => {
            if (!this.value || !Array.isArray(this.value)) this.value = [];
            this.value.push(data);
        });
    }
}

/**
 * @class ReportableDataTimestampedStream
 * @classdesc Array of timestamped data captured since matchStart until matchEnd.
 */
export class ReportableDataTimestampedStream<T> extends ReportableData<T> {
    public value: Timestamp<T>[] = [];

    public setup(): void {
        super.setup();
        this.sourceSubcription = this.source$?.subscribe((data) => {
            if (!this.value || !Array.isArray(this.value)) this.value = [];

            const timestampedData = { value: data, timestamp: Date.now() };
            this.value.push(timestampedData);
        });
    }
}
