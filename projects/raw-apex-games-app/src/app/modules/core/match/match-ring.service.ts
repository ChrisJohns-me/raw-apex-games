import { Injectable } from "@angular/core";
import { MatchRing } from "@raw-apex-games-app/app/common/match/ring";
import { MatchStateChangedEvent } from "@raw-apex-games-app/app/common/match/state";
import { SingletonServiceProviderFactory } from "@raw-apex-games-app/app/singleton-service.provider.factory";
import { BehaviorSubject } from "rxjs";
import { BaseService } from "../base-service.abstract";
import { ConfigurationService } from "../configuration.service";
import { MatchService } from "./match.service";

const REFRESH_INTERVAL = 1000;

/**
 * @class Match Ring Service
 * @classdesc Outputs ring details, based on the match time
 * @deprecated Potentially going unused
 */
@Injectable({
    providedIn: "root",
    deps: [ConfigurationService, MatchService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchRingService", MatchRingService, deps),
})
export class MatchRingService extends BaseService {
    /**
     * Current Battle Royale ring based on the match time.
     * Only emits undefined on match start.
     * Does not emit undefined in-between rings (value persists until the next ring is identified).
     */
    public readonly currentBRRing$ = new BehaviorSubject<Optional<MatchRing>>(undefined);
    /** All Battle Royale rings */
    public readonly allBRRings$ = new BehaviorSubject<MatchRing[]>([]);

    private allBRRings: MatchRing[] = [];

    constructor(private readonly configuration: ConfigurationService, private readonly match: MatchService) {
        super();
        this.setupOnMatchStart();
        this.setupAllBRRings();
        this.setupCurrentRing();
    }

    /**
     * Reset state on match start
     */
    private setupOnMatchStart(): void {
        // this.match.startedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {
        //     this.currentBRRing$.next(undefined);
        // });
    }

    private setupAllBRRings(): void {
        // this.configuration.config$.pipe(takeUntil(this.destroy$)).subscribe((config) => {
        //     this.allBRRings = config.brFacts.rings;
        //     this.allBRRings$.next(this.allBRRings);
        // });
    }

    private setupCurrentRing(): void {
        // const matchStart$ = this.match.startedEvent$;
        // const refresh$ = interval(REFRESH_INTERVAL).pipe(filter(() => this.match.isActive));
        // combineLatest([matchStart$, refresh$])
        //     .pipe(
        //         map(([matchEvent]) => this.timeSinceMatchStart(matchEvent)),
        //         map((timeSinceMatchStartSec) => this.getCurrentRing(timeSinceMatchStartSec))
        //     )
        //     .subscribe((currentRing) => {
        //         if (currentRing && currentRing !== this.currentBRRing$.value) this.currentBRRing$.next(currentRing);
        //     });
    }

    /** Time in seconds */
    private timeSinceMatchStart(matchEvent: MatchStateChangedEvent): number {
        const now = new Date().getTime();
        if (!matchEvent.startDate) return 0;
        const matchStartTime = matchEvent.startDate.getTime();
        if (now < matchStartTime) return 0;
        const timeSinceMatchStart = now - matchStartTime;
        return Math.round(timeSinceMatchStart / 1000);
    }

    private getCurrentRing(timeSinceMatchStartSec: number): Optional<MatchRing> {
        return this.allBRRings.find((ring) => ring.startTimeSec <= timeSinceMatchStartSec && ring.endTimeSec >= timeSinceMatchStartSec);
    }
}
