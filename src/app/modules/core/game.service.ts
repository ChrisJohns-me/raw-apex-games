import { Injectable, OnDestroy } from "@angular/core";
import { SingletonServiceProviderFactory } from "@app/singleton-service.provider.factory";
import { GamePhase } from "@shared/models/game-phase";
import { MatchState } from "@shared/models/match/match-state";
import { TriggerConditions } from "@shared/models/utilities/trigger-conditions";
import { findValueByKeyRegEx, isEmpty } from "@shared/utilities";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatchService } from "./match/match.service";
import { OverwolfDataProviderService, OWInfoUpdates2Event } from "./overwolf-data-provider";

/**
 * @classdesc Provides general information about the game and it's meta state
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfDataProviderService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("GameService", GameService, deps),
})
export class GameService implements OnDestroy {
    public readonly phase$ = new BehaviorSubject<GamePhase>(GamePhase.Lobby);

    private readonly _unsubscribe$ = new Subject<void>();

    constructor(private readonly match: MatchService, private readonly overwolf: OverwolfDataProviderService) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public start(): void {
        this.setupPhase();
    }

    private setupPhase(): void {
        const setNewPhaseFn = (newPhase?: GamePhase): void => {
            if (newPhase && newPhase !== this.phase$.value) this.phase$.next(newPhase);
        };

        const triggers = new TriggerConditions<GamePhase, [OWInfoUpdates2Event?, MatchState?]>({
            [GamePhase.Lobby]: (infoUpdate, matchState) => matchState === MatchState.Inactive,
            [GamePhase.LegendSelection]: (infoUpdate) =>
                infoUpdate?.feature === "team" && !isEmpty(findValueByKeyRegEx(infoUpdate?.info?.match_info, /^legendSelect/)),
            [GamePhase.InGame]: (infoUpdate, matchState) => matchState === MatchState.Active,
        });

        this.overwolf.infoUpdates$.pipe(takeUntil(this._unsubscribe$)).subscribe((infoUpdate) => {
            const newPhase = triggers.triggeredFirstKey(infoUpdate, undefined);
            setNewPhaseFn(newPhase);
        });

        this.match.state$.pipe(takeUntil(this._unsubscribe$)).subscribe((stateChanged) => {
            const newPhase = triggers.triggeredFirstKey(undefined, stateChanged.state);
            setNewPhaseFn(newPhase);
        });
    }
}
