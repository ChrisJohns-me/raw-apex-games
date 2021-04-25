import { GamePhase } from "@allfather-app/app/shared/models/game-phase";
import { MatchState } from "@allfather-app/app/shared/models/match/state";
import { TriggerConditions } from "@allfather-app/app/shared/models/utilities/trigger-conditions";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { findValueByKeyRegEx, isEmpty } from "shared/utilities";
import { MatchService } from "./match/match.service";
import { OverwolfGameDataService, OWInfoUpdates2Event } from "./overwolf";

/**
 * @classdesc Provides general information about the game and it's meta state
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("GameService", GameService, deps),
})
export class GameService implements OnDestroy {
    public readonly phase$ = new BehaviorSubject<GamePhase>(GamePhase.Lobby);

    private readonly _unsubscribe$ = new Subject<void>();

    constructor(private readonly match: MatchService, private readonly overwolfGameData: OverwolfGameDataService) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public init(): void {
        this.setupPhase();
    }

    private setupPhase(): void {
        const setNewPhaseFn = (newPhase?: GamePhase): void => {
            if (newPhase && newPhase !== this.phase$.value) this.phase$.next(newPhase);
        };

        const triggers = new TriggerConditions<GamePhase, [OWInfoUpdates2Event?, MatchState?]>("GamePhase", {
            [GamePhase.Lobby]: (infoUpdate, matchState) => matchState === MatchState.Inactive,
            [GamePhase.LegendSelection]: (infoUpdate) =>
                infoUpdate?.feature === "team" && !isEmpty(findValueByKeyRegEx(infoUpdate?.info?.match_info, /^legendSelect/)),
            [GamePhase.InGame]: (infoUpdate, matchState) => matchState === MatchState.Active,
        });

        this.overwolfGameData.infoUpdates$.pipe(takeUntil(this._unsubscribe$)).subscribe((infoUpdate) => {
            const newPhase = triggers.triggeredFirstKey(infoUpdate, undefined);
            setNewPhaseFn(newPhase);
        });

        this.match.state$.pipe(takeUntil(this._unsubscribe$)).subscribe((stateChanged) => {
            const newPhase = triggers.triggeredFirstKey(undefined, stateChanged.state);
            setNewPhaseFn(newPhase);
        });
    }
}
