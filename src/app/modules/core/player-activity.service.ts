import { Injectable, OnDestroy } from "@angular/core";
import { DamageRoster } from "@common/damage-roster";
import { MatchState } from "@common/match";
import { BehaviorSubject, Subject } from "rxjs";
import { distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { parseBoolean } from "src/utilities";
import { MatchRosterService } from "./match-roster.service";
import { MatchService } from "./match.service";
import { OverwolfDataProviderService } from "./overwolf-data-provider";
import { PlayerService } from "./player.service";

@Injectable({
    providedIn: "root",
    deps: [MatchService, MatchRosterService, OverwolfDataProviderService, PlayerService],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("PlayerActivityService", PlayerActivityService, deps),
})
export class PlayerActivityService implements OnDestroy {
    public readonly damageRoster$ = new BehaviorSubject<Optional<DamageRoster>>(undefined);
    public readonly placement$ = new BehaviorSubject<number>(Infinity);
    public readonly victory$ = new BehaviorSubject<boolean>(false);

    private _damageRoster: Optional<DamageRoster>;

    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly match: MatchService,
        private readonly matchRoster: MatchRosterService,
        private readonly overwolf: OverwolfDataProviderService,
        private readonly player: PlayerService
    ) {
        console.debug(`[${this.constructor.name}] Instantiated`);
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupDamageRoster();
        this.setupDamageEvents();
        this.setupKillfeedEvents();
        this.setupPlacement();
        this.setupVictory();
    }

    //#region Damage Roster
    private setupDamageRoster(): void {
        this.match.state$
            .pipe(
                takeUntil(this._unsubscribe),
                distinctUntilChanged(),
                filter((matchState) => matchState === MatchState.Active),
                tap(() => (this._damageRoster = new DamageRoster(this.player.playerName$.value)))
            )
            .subscribe();
    }

    private setupDamageEvents(): void {
        this.overwolf.newGameEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((gameEvent) => gameEvent.name === "damage"),
                map((gameEvent) => gameEvent.data as overwolf.gep.ApexLegends.GameEventDamage)
            )
            .subscribe((damageEvent) => {
                this._damageRoster?.inflictPlayerDamage({
                    attackerName: this.player.playerName$.value,
                    victimName: damageEvent.targetName,
                    shieldDamage: damageEvent.armor ? damageEvent.damageAmount : 0,
                    healthDamage: !damageEvent.armor ? damageEvent.damageAmount : 0,
                    hasShield: damageEvent.armor,
                });
            });
    }

    private setupKillfeedEvents(): void {
        this.matchRoster.killfeed$.pipe(takeUntil(this._unsubscribe)).subscribe((killfeed) => {
            if (killfeed.isKnockdown) {
                this._damageRoster?.knockdownPlayer(killfeed.victimName, killfeed.attackerName);
            } else if (killfeed.isElimination) {
                this._damageRoster?.eliminatePlayer(killfeed.victimName, killfeed.attackerName);
            }
            this.damageRoster$.next(this._damageRoster);
        });
    }

    //#region Placement
    // TODO: This value needs to be verified.
    private setupPlacement(): void {
        this.match.state$
            .pipe(
                takeUntil(this._unsubscribe),
                distinctUntilChanged(),
                filter((matchState) => matchState === MatchState.Active),
                switchMap(() => this.matchRoster.roster$),
                filter((matchRoster) => !!matchRoster),
                map((matchRoster) => matchRoster?.aliveTeams)
            )
            .subscribe((aliveTeams) => {
                const numAliveTeams = aliveTeams?.length ?? -Infinity;
                if (isFinite(numAliveTeams) && numAliveTeams > 0 && numAliveTeams < 999)
                    this.placement$.next(numAliveTeams);
            });
    }
    //#endregion

    //#region Victory
    private setupVictory(): void {
        const setVictoryFn = (newValue: boolean): void => {
            if (newValue !== this.victory$.value) this.victory$.next(newValue);
        };

        this.match.state$
            .pipe(
                takeUntil(this._unsubscribe),
                distinctUntilChanged(),
                tap((matchState) => (matchState === MatchState.Active ? setVictoryFn(false) : null)),
                switchMap(() => this.overwolf.infoUpdates$),
                filter((infoUpdate) => infoUpdate.feature === "rank"),
                map((infoUpdate) => infoUpdate.info.match_info),
                filter((matchInfo) => !!matchInfo && !!Object.keys(matchInfo).includes("victory")),
                map((matchInfo) => parseBoolean(matchInfo?.victory))
            )
            .subscribe((isVictory) => {
                this.placement$.next(1);
                this.victory$.next(isVictory);
            });
    }
    //#endregion
}
