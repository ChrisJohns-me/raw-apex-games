import { Injectable, OnDestroy } from "@angular/core";
import { TriggerConditions } from "@common/game-event-triggers";
import { GameMode } from "@common/game-mode";
import { MatchState, MatchStateChangeEvent as MatchStateChangedEvent } from "@common/match";
import { BehaviorSubject, merge, Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { OverwolfDataProviderService, OWGameEvent, OWInfoUpdates2Event } from "./overwolf-data-provider";

@Injectable({
    providedIn: "root",
    deps: [OverwolfDataProviderService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("MatchService", MatchService, deps),
})
export class MatchService implements OnDestroy {
    public readonly started$ = new Subject<MatchStateChangedEvent>();
    public readonly ended$ = new Subject<MatchStateChangedEvent>();
    public readonly currentState$ = new BehaviorSubject<MatchStateChangedEvent>({ state: MatchState.Inactive });
    public readonly gameMode$ = new BehaviorSubject<GameMode>({ id: "", friendlyName: "" });

    private currentStartDate?: Date;
    private readonly _unsubscribe = new Subject<void>();

    constructor(private readonly overwolf: OverwolfDataProviderService) {}

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupStartEndEvents();
        this.setupStateEvents();
        this.setupGameMode();
    }

    private setupStartEndEvents(): void {
        merge(this.started$, this.ended$)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((newState) => this.currentState$.next(newState));
    }

    //#region Match State
    private setupStateEvents(): void {
        const newStateChangeFn = (newState?: MatchState): void => {
            if (!newState || newState === this.currentState$.value.state) return;
            if (newState === MatchState.Active) {
                this.currentStartDate = new Date();
                this.started$.next({ state: newState, startDate: this.currentStartDate });
            } else if (newState === MatchState.Inactive) {
                this.ended$.next({ state: newState, startDate: this.currentStartDate, endDate: new Date() });
            }
        };

        const triggers = new TriggerConditions<MatchState, [MatchState?, OWInfoUpdates2Event?, OWGameEvent?]>({
            [MatchState.Inactive]: (matchState, infoUpdate, gameEvent) => {
                const notInactive = matchState !== MatchState.Inactive;
                const gameModeChanged =
                    infoUpdate?.feature === "match_info" && !!infoUpdate?.info?.match_info?.game_mode;
                const infoStateInactive =
                    infoUpdate?.feature === "match_state" && infoUpdate?.info?.game_info?.match_state === "inactive";
                const teamEliminated =
                    infoUpdate?.feature === "team" &&
                    infoUpdate.info.match_info?.team_info?.team_state === "eliminated";
                const teamDeleted =
                    infoUpdate?.feature === "team" &&
                    typeof infoUpdate.info.match_info?.team_info === "object" &&
                    infoUpdate.info.match_info?.team_info?.team_state == null;
                const matchEnd = gameEvent?.name === "match_end";
                return (
                    notInactive && (gameModeChanged || infoStateInactive || teamEliminated || teamDeleted || matchEnd)
                );
            },
            [MatchState.Active]: (matchState, infoUpdate, gameEvent) => {
                const notActive = matchState !== MatchState.Active;
                const locationUpdate = infoUpdate?.feature === "location";
                const infoStateActive =
                    infoUpdate?.feature === "match_state" && infoUpdate?.info?.game_info?.match_state === "active";
                const teamActive =
                    infoUpdate?.feature === "team" && infoUpdate.info.match_info?.team_info?.team_state === "active";
                const matchStart = gameEvent?.name === "match_start";
                return notActive && (locationUpdate || infoStateActive || teamActive || matchStart);
            },
        });

        this.overwolf.infoUpdates$.pipe(takeUntil(this._unsubscribe)).subscribe((infoUpdate) => {
            const newState = triggers.triggeredFirstKey(this.currentState$.value.state, infoUpdate, undefined);
            newStateChangeFn(newState);
        });

        this.overwolf.newGameEvent$.pipe(takeUntil(this._unsubscribe)).subscribe((gameEvent) => {
            const newState = triggers.triggeredFirstKey(this.currentState$.value.state, undefined, gameEvent);
            newStateChangeFn(newState);
        });
    }
    //#endregion

    //#region Game Mode
    private setupGameMode(): void {
        const blacklistedGameModes = [/nametext/];

        this.overwolf.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((infoUpdate) => infoUpdate.feature === "match_info"),
                filter((infoUpdate) => !!infoUpdate.info.match_info?.game_mode),
                map((infoUpdate) => infoUpdate.info.match_info?.game_mode)
            )
            .subscribe((gameModeId) => {
                if (!gameModeId) return;
                const isBlacklisted = !!blacklistedGameModes.find((blacklist) => blacklist.test(gameModeId));
                if (isBlacklisted) return;
                if (gameModeId === this.gameMode$.value.id) return;

                const newGameMode = new GameMode(gameModeId);
                this.gameMode$.next(newGameMode);
            });
    }
    //#endregion
}
