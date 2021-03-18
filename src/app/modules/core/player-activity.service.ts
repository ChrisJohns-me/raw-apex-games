import { Injectable, OnDestroy } from "@angular/core";
import { DamageRoster } from "@common/damage-roster";
import { MatchState } from "@common/match";
import { PlayerTabs } from "@common/player-tabs";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
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
    /** */
    public readonly numDamage$ = new BehaviorSubject<number>(0);
    /** */
    public readonly numKills$ = new BehaviorSubject<number>(0);
    /** */
    public readonly numAssists$ = new BehaviorSubject<number>(0);
    /** */
    public readonly numSpectators$ = new BehaviorSubject<number>(0);

    public readonly damageRoster$ = new BehaviorSubject<Optional<DamageRoster>>(undefined);
    public readonly placement$ = new BehaviorSubject<number>(0);
    public readonly victory$ = new BehaviorSubject<boolean>(false);
    /** Info directly from Overwolf's match_info.tabs data */
    public readonly playerTabs$ = new BehaviorSubject<Optional<PlayerTabs>>(undefined);

    private _damageRoster: Optional<DamageRoster>;
    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly match: MatchService,
        private readonly matchRoster: MatchRosterService,
        private readonly overwolf: OverwolfDataProviderService,
        private readonly player: PlayerService
    ) {}

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupMatchStateEvents();
        this.setupPlayerSmartData();
        this.setupPlayerTabs();
        this.setupDamageRoster();
        this.setupDamageEvents();
        this.setupKillfeedEvents();
        this.setupPlacement();
        this.setupVictory();
    }

    private setupMatchStateEvents(): void {
        this.match.started$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this.numDamage$.next(0);
            this.numKills$.next(0);
            this.numAssists$.next(0);
            this.numSpectators$.next(0);
            this.damageRoster$.next(undefined);
            this.placement$.next(0);
            this.victory$.next(false);
            this.playerTabs$.next(undefined);
        });
    }

    //#region Player Smart Data
    /** Used to help error correct the data from Overwolf */
    private setupPlayerSmartData(): void {
        //
    }
    //#endregion

    //#region Player Tabs
    private setupPlayerTabs(): void {
        this.match.started$
            .pipe(
                takeUntil(this._unsubscribe),
                tap(() => this.playerTabs$.next(undefined)),
                switchMap(() => this.overwolf.infoUpdates$),
                filter((infoUpdate) => infoUpdate.feature === "match_info" && !!infoUpdate.info.match_info?.tabs),
                map((infoUpdate) => infoUpdate.info.match_info?.tabs)
            )
            .subscribe((tabs) => {
                if (!tabs) return;
                const newTabs: PlayerTabs = {
                    kills: parseInt(String(tabs.kills)),
                    assists: parseInt(String(tabs.assists)),
                    spectators: parseInt(String(tabs.spectators)),
                    teams: parseInt(String(tabs.teams)),
                    players: parseInt(String(tabs.players)),
                    damage: parseInt(String(tabs.damage)),
                    cash: parseInt(String(tabs.cash)),
                };
                this.playerTabs$.next(newTabs);
            });
    }
    //#endregion

    //#region Damage Roster
    private setupDamageRoster(): void {
        this.match.started$
            .pipe(
                takeUntil(this._unsubscribe),
                tap(() => (this._damageRoster = undefined)),
                switchMap(() => this.player.playerName$)
            )
            .subscribe((newPlayerName) => {
                if (!this._damageRoster) this._damageRoster = new DamageRoster(newPlayerName);
                else if (newPlayerName) this._damageRoster.activePlayerName = newPlayerName;
            });
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
        this.matchRoster.killfeedEvent$.pipe(takeUntil(this._unsubscribe)).subscribe((killfeed) => {
            if (killfeed.isKnockdown) {
                this._damageRoster?.knockdownPlayer(killfeed.victimName, killfeed.attackerName);
            } else if (killfeed.isElimination) {
                this._damageRoster?.eliminatePlayer(killfeed.victimName, killfeed.attackerName);
            }
            this.damageRoster$.next(this._damageRoster);
        });
    }
    //#endregion

    //#region Placement
    // TODO: This value needs to be verified.
    /**
     * Uses info from "match_tabs" or MatchRoster.teamsAlive
     */
    private setupPlacement(): void {
        const matchRosterAliveTeams = 0;
        const AliveTeams = 0;

        this.match.started$
            .pipe(
                takeUntil(this._unsubscribe),
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

        this.match.currentState$
            .pipe(
                takeUntil(this._unsubscribe),
                tap((matchStateChanged) =>
                    matchStateChanged.state === MatchState.Active ? setVictoryFn(false) : null
                ),
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
