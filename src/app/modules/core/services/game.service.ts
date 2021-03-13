import { Injectable, OnDestroy } from "@angular/core";
import { GamePhase } from "@common/game";
import { TriggerConditions } from "@common/game-event-triggers";
import { MatchState } from "@common/match";
import { BehaviorSubject, Subject } from "rxjs";
import { distinctUntilChanged, takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { findValueByKeyRegEx } from "src/utilities";
import { MatchService } from "./match.service";
import { OverwolfDataProviderService, OWInfoUpdates2Event } from "./overwolf-data-provider";

@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfDataProviderService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("GameService", GameService, deps),
})
export class GameService implements OnDestroy {
    public readonly phase$ = new BehaviorSubject<GamePhase>(GamePhase.Lobby);

    private readonly _unsubscribe = new Subject<void>();

    constructor(private readonly match: MatchService, private readonly overwolf: OverwolfDataProviderService) {
        console.debug(`[${this.constructor.name}] Instantiated`);

        this.start();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private start(): void {
        this.setupPhase();
    }

    //#region Game Phase
    private setupPhase(): void {
        const setNewPhaseFn = (newPhase?: GamePhase): void => {
            if (newPhase && newPhase !== this.phase$.value) this.phase$.next(newPhase);
        };

        const triggers = new TriggerConditions<GamePhase, [OWInfoUpdates2Event?, MatchState?]>({
            [GamePhase.Lobby]: (infoUpdate, matchState) => matchState === MatchState.Inactive,
            [GamePhase.LegendSelection]: (infoUpdate) =>
                infoUpdate?.feature === "team" && !!findValueByKeyRegEx(infoUpdate?.info?.match_info, /^legendSelect/),
            [GamePhase.InGame]: (infoUpdate, matchState) => matchState === MatchState.Active,
        });

        this.overwolf.infoUpdates$.pipe(takeUntil(this._unsubscribe)).subscribe((infoUpdate) => {
            const newPhase = triggers.triggeredFirstKey(infoUpdate, undefined);
            setNewPhaseFn(newPhase);
        });

        this.match.state$.pipe(distinctUntilChanged(), takeUntil(this._unsubscribe)).subscribe((matchState) => {
            const newPhase = triggers.triggeredFirstKey(undefined, matchState);
            setNewPhaseFn(newPhase);
        });
    }
    //#endregion
}
