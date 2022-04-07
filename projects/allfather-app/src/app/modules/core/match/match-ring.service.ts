import { MatchRing } from "@allfather-app/app/common/match/ring";
import { MatchStateChangedEvent } from "@allfather-app/app/common/match/state";
import { BaseService } from "@allfather-app/app/common/services/base-service.abstract";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, interval } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { ConfigurationService } from "../configuration.service";
import { MatchService } from "./match.service";

const REFRESH_INTERVAL = 1000;

/**
 * @class Match Ring Service
 * @classdesc Outputs ring details, based on the match time
 */
@Injectable({
    providedIn: "root",
    deps: [ConfigurationService, MatchService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchRingService", MatchRingService, deps),
})
export class MatchRingService extends BaseService {
    /** Current Battle Royale ring based on the match time. Resets on match start */
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
        this.match.startedEvent$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.currentBRRing$.next(undefined);
        });
    }

    private setupAllBRRings(): void {
        this.configuration.config$.pipe(takeUntil(this.destroy$)).subscribe((config) => {
            this.allBRRings = config.brFacts.rings;
            this.allBRRings$.next(this.allBRRings);
        });
    }

    private setupCurrentRing(): void {
        const refresh$ = interval(REFRESH_INTERVAL).pipe(filter(() => this.match.isActive));

        combineLatest([this.match.startedEvent$, refresh$])
            .pipe(
                map(([matchEvent]) => this.timeSinceMatchStart(matchEvent)),
                map((timeSinceMatchStartMs) => this.getCurrentRing(timeSinceMatchStartMs))
            )
            .subscribe((currentRing) => {
                if (currentRing && currentRing !== this.currentBRRing$.value) this.currentBRRing$.next(currentRing);
            });
    }

    private timeSinceMatchStart(matchEvent: MatchStateChangedEvent): number {
        const now = new Date().getTime();
        if (!matchEvent.startDate) return 0;
        const matchStartTime = matchEvent.startDate.getTime();
        if (now < matchStartTime) return 0;
        const timeSinceMatchStart = now - matchStartTime;
        return timeSinceMatchStart;
    }

    private getCurrentRing(timeSinceMatchStartMs: number): Optional<MatchRing> {
        return this.allBRRings.find((ring) => ring.holdStartTime <= timeSinceMatchStartMs && ring.shrinkEndTime >= timeSinceMatchStartMs);
    }
}
