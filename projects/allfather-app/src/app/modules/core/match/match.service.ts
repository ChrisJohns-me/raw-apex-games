import { OverwolfGameDataService, OWGameEvent, OWInfoUpdates2Event } from "@allfather-app/app/modules/core/overwolf";
import { MatchGameMode } from "@allfather-app/app/shared/models/match/game-mode";
import { MatchState, MatchStateChangedEvent } from "@allfather-app/app/shared/models/match/state";
import { TriggerConditions } from "@allfather-app/app/shared/models/utilities/trigger-conditions";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable, OnDestroy } from "@angular/core";
import { differenceInMilliseconds } from "date-fns";
import { IndexableType } from "dexie";
import { BehaviorSubject, from, merge, Observable, of, Subject } from "rxjs";
import { filter, map, take, takeUntil, tap, timeoutWith } from "rxjs/operators";
import { isEmpty } from "shared/utilities";
import { v4 as uuid, validate as uuidValidate } from "uuid";
import { LocalDatabaseService } from "../local-database/local-database.service";
import { MatchDataStore } from "../local-database/match-data-store";

/** Time allowed to wait for Overwolf's "psuedo_match_id", before generating our own */
const MATCHID_TIMEOUT = 5000;

/**
 * @classdesc Provides basic and general details about the match
 */
@Injectable({
    providedIn: "root",
    deps: [LocalDatabaseService, OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchService", MatchService, deps),
})
export class MatchService implements OnDestroy {
    /** Provided by Overwolf's psuedo_match_id */
    public readonly matchId$ = new BehaviorSubject<string>("");
    /** Emits changed state only when match has started */
    public readonly startedEvent$ = new Subject<MatchStateChangedEvent>();
    /** Emits changed state only when match has ended */
    public readonly endedEvent$ = new Subject<MatchStateChangedEvent>();
    /** Emits changed states; when match starts or ends, or upon subscription */
    public readonly state$ = new BehaviorSubject<MatchStateChangedEvent>({ state: MatchState.Inactive, matchId: "" });
    /** Emits when game mode is selected from within the lobby */
    public readonly gameMode$ = new BehaviorSubject<Optional<MatchGameMode>>(undefined);
    /** Immediately see if the match is active */
    public get isActive(): boolean {
        return this.state$.value.state === MatchState.Active;
    }

    private currentStartDate?: Date;
    private matchIdDate?: Date;
    private readonly _unsubscribe$ = new Subject<void>();

    constructor(private readonly localDatabase: LocalDatabaseService, private readonly overwolfGameData: OverwolfGameDataService) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public init(): void {
        this.setupMatchId();
        this.setupStartEndEvents();
        this.setupStateEvents();
        this.setupGameMode();
    }

    /**
     * Stores match data into local database.
     * @returns {IndexableType} index key of storage location
     */
    public storeMatchData(matchData: MatchDataStore): Observable<IndexableType> {
        const savePromise = this.localDatabase.table("matches").put(matchData);
        return from(savePromise);
    }

    /**
     * Retrieves a specific Match from local database.
     * @returns {MatchDataStore}
     */
    public getMatchDataByMatchId(matchId: string): Observable<MatchDataStore | undefined> {
        if (isEmpty(matchId)) throw new Error(`Cannot retrieve match data from local database; matchId is empty.`);
        const matchPromise = this.localDatabase.matches.get({ matchId });
        return from(matchPromise);
    }

    /**
     * @returns All matches stored in the local database, descending order.
     */
    public getAllMatchData(): Observable<MatchDataStore[]> {
        const matchPromise = this.localDatabase.matches.orderBy("endDate").reverse().toArray();
        return from(matchPromise);
    }

    private setupMatchId(): void {
        this.overwolfGameData.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe$),
                filter((infoUpdate) => infoUpdate.feature === "match_info" && !isEmpty(infoUpdate.info.match_info?.pseudo_match_id)),
                map((infoUpdate) => infoUpdate.info.match_info?.pseudo_match_id),
                filter((matchId) => !!matchId && uuidValidate(matchId))
            )
            .subscribe((matchId) => {
                this.matchId$.next(matchId!);
                this.matchIdDate = new Date();
            });
    }

    private setupStartEndEvents(): void {
        merge(this.startedEvent$, this.endedEvent$)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((newState) => this.state$.next(newState));
    }

    private setupStateEvents(): void {
        const newStateChangeFn = (newState?: MatchState): void => {
            if (!newState || newState === this.state$.value.state) return;
            if (newState === MatchState.Active) {
                // Ensure that we have the matchId for the startEvent
                this.resolveMatchId$(MATCHID_TIMEOUT)
                    .pipe(takeUntil(this._unsubscribe$))
                    .subscribe((matchId) => {
                        console.debug(`[${this.constructor.name}] Match is Active; MatchId: ${matchId}`);
                        this.currentStartDate = new Date();
                        this.startedEvent$.next({ state: newState, startDate: this.currentStartDate, matchId });
                    });
            } else if (newState === MatchState.Inactive) {
                console.debug(`[${this.constructor.name}] Match is InActive; MatchId: ${this.state$.value.matchId}`);
                this.endedEvent$.next({
                    state: newState,
                    startDate: this.currentStartDate,
                    endDate: new Date(),
                    matchId: this.state$.value.matchId,
                });
            }
        };

        const triggers = new TriggerConditions<MatchState, [MatchState?, OWInfoUpdates2Event?, OWGameEvent?]>("MatchState", {
            [MatchState.Inactive]: (matchState, infoUpdate, gameEvent) => {
                const notInactive = matchState !== MatchState.Inactive;
                const gameModeChanged = infoUpdate?.feature === "match_info" && !!infoUpdate?.info?.match_info?.game_mode;
                const infoStateInactive = infoUpdate?.feature === "match_state" && infoUpdate?.info?.game_info?.match_state === "inactive";
                const teamEliminated = infoUpdate?.feature === "team" && infoUpdate.info.match_info?.team_info?.team_state === "eliminated";
                const teamDeleted =
                    infoUpdate?.feature === "team" &&
                    typeof infoUpdate.info.match_info?.team_info === "object" &&
                    infoUpdate.info.match_info?.team_info?.team_state == null;
                const matchEnd = gameEvent?.name === "match_end";
                return notInactive && (gameModeChanged || infoStateInactive || teamEliminated || teamDeleted || matchEnd);
            },
            [MatchState.Active]: (matchState, infoUpdate, gameEvent) => {
                const notActive = matchState !== MatchState.Active;
                const locationUpdate = infoUpdate?.feature === "location";
                const infoStateActive = infoUpdate?.feature === "match_state" && infoUpdate?.info?.game_info?.match_state === "active";
                const teamActive = infoUpdate?.feature === "team" && infoUpdate.info.match_info?.team_info?.team_state === "active";
                const matchStart = gameEvent?.name === "match_start";
                return notActive && (locationUpdate || infoStateActive || teamActive || matchStart);
            },
        });

        this.overwolfGameData.infoUpdates$.pipe(takeUntil(this._unsubscribe$)).subscribe((infoUpdate) => {
            const newState = triggers.triggeredFirstKey(this.state$.value.state, infoUpdate, undefined);
            newStateChangeFn(newState);
        });

        this.overwolfGameData.newGameEvent$.pipe(takeUntil(this._unsubscribe$)).subscribe((gameEvent) => {
            const newState = triggers.triggeredFirstKey(this.state$.value.state, undefined, gameEvent);
            newStateChangeFn(newState);
        });
    }

    private setupGameMode(): void {
        const blacklistedGameModes = [/nametext/];

        this.overwolfGameData.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe$),
                filter((infoUpdate) => infoUpdate.feature === "match_info"),
                filter((infoUpdate) => !!infoUpdate.info.match_info?.game_mode),
                map((infoUpdate) => infoUpdate.info.match_info?.game_mode)
            )
            .subscribe((gameModeId) => {
                if (!gameModeId) return;
                const isBlacklisted = blacklistedGameModes.some((blacklist) => blacklist.test(gameModeId));
                if (isBlacklisted) return;
                if (gameModeId === this.gameMode$.value?.gameModeId) return;

                const newGameMode = new MatchGameMode(gameModeId);
                this.gameMode$.next(newGameMode);
            });
    }

    /**
     * Directly returns matchId$ as long as it is within timespan.
     * Otherwise, fallsback to a newly generated UUID.
     * Returns one UUID and completes.
     * @param fallbackTimeMs Max time to wait until generating our own matchId.
     * @returns {Observable<string>} matchId
     */
    private resolveMatchId$(fallbackTimeMs = 1000): Observable<string> {
        const expiredMsgFn = (matchId: string) =>
            `[MatchId] No "psuedo_match_id" was provided within ${fallbackTimeMs / 1000}sec. Generated new MatchId: "${matchId}"`;
        const genUUID$Fn = () => of(uuid()).pipe(tap((id) => console.error(expiredMsgFn(id))));

        return this.matchId$.pipe(
            filter(() => {
                const absDiffMs = this.matchIdDate ? Math.abs(differenceInMilliseconds(this.matchIdDate, new Date())) : 0;
                return absDiffMs <= fallbackTimeMs;
            }),
            timeoutWith(fallbackTimeMs, genUUID$Fn()),
            take(1)
        );
    }
}
