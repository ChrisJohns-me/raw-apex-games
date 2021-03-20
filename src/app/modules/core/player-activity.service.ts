import { Injectable, OnDestroy } from "@angular/core";
import { DamageRoster } from "@common/damage-roster";
import { MatchState } from "@common/match";
import { PlayerStatus } from "@common/player";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { parseBoolean } from "src/utilities";
import { cleanInt } from "src/utilities/number";
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
    public readonly numKills$ = new BehaviorSubject<number>(0);
    /** */
    public readonly numAssists$ = new BehaviorSubject<number>(0);
    /** */
    public readonly numDamage$ = new BehaviorSubject<number>(0);
    /** @deprecated May not work; Feature is unavailable in game-UI. */
    public readonly numSpectators$ = new BehaviorSubject<number>(0);

    public readonly damageRoster$;
    public readonly placement$ = new BehaviorSubject<number>(0);
    public readonly victory$ = new BehaviorSubject<boolean>(false);
    /**
     * Damage amount does not take into consideration victim's HP, only the raw inflicted amount.
     * The contained damage amount will then appear to be inflated.
     * Info directly from Overwolf's me.damage_dealt data
     */
    public readonly totalDamageDealt$ = new BehaviorSubject<number>(0);

    private _damageRoster = new DamageRoster();
    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly match: MatchService,
        private readonly matchRoster: MatchRosterService,
        private readonly overwolf: OverwolfDataProviderService,
        private readonly player: PlayerService
    ) {
        this.damageRoster$ = new BehaviorSubject<DamageRoster>(this._damageRoster);
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupMatchStateEvents();
        this.setupInfoTabs();
        this.setupTotalDamageDealt();
        this.setupDamageRosterPlayerName();
        this.setupDamageEvents();
        this.setupKillfeedEvents();
        this.setupPlacement();
        this.setupVictory();
    }

    private setupMatchStateEvents(): void {
        this.match.started$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this._damageRoster = new DamageRoster(this.player.playerName$.value);
            this.damageRoster$.next(this._damageRoster);
            this.numDamage$.next(0);
            this.numKills$.next(0);
            this.numAssists$.next(0);
            this.numSpectators$.next(0);
            this.placement$.next(0);
            this.victory$.next(false);
        });
    }

    //#region Player In-Game Stats
    private setupInfoTabs(): void {
        const setTabsHigherAmountFn = (newAmount: number, subject: BehaviorSubject<number>): void => {
            newAmount = cleanInt(newAmount);
            if (newAmount > subject.value) subject.next(newAmount);
        };

        this.overwolf.infoUpdates$
            .pipe(
                filter((infoUpdate) => infoUpdate.feature === "match_info" && !!infoUpdate.info.match_info?.tabs),
                map((infoUpdate) => infoUpdate.info.match_info?.tabs)
            )
            .subscribe((tabs) => {
                if (!tabs || !Object.keys(tabs).length) return;
                setTabsHigherAmountFn(tabs.kills, this.numKills$);
                setTabsHigherAmountFn(tabs.assists, this.numAssists$);
                setTabsHigherAmountFn(tabs.damage, this.numDamage$);
                this.numSpectators$.next(cleanInt(tabs.spectators));
            });
    }

    private setupTotalDamageDealt(): void {
        this.overwolf.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((infoUpdate) => infoUpdate.feature === "damage" && !!infoUpdate.info.me?.totalDamageDealt),
                map((infoUpdate) => parseInt(String(infoUpdate.info.me?.totalDamageDealt)))
            )
            .subscribe((totalDamageDealt) => this.totalDamageDealt$.next(totalDamageDealt));
    }
    //#endregion

    //#region Damage Roster
    private setupDamageRosterPlayerName(): void {
        this.player.playerName$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((newPlayerName) => !!newPlayerName)
            )
            .subscribe((newPlayerName) => {
                this._damageRoster.activePlayerName = newPlayerName as string;
            });
    }

    private setupDamageEvents(): void {
        this.overwolf.newGameEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((gameEvent) => gameEvent.name === "damage"),
                map((gameEvent) => gameEvent.data as overwolf.gep.ApexLegends.GameEventDamage),
                filter(() => this.player.status$.value !== PlayerStatus.Eliminated)
            )
            .subscribe((damageEvent) => {
                this._damageRoster.inflictPlayerDamage({
                    attackerName: this.player.playerName$.value,
                    victimName: damageEvent.targetName,
                    shieldDamage: damageEvent.armor ? damageEvent.damageAmount : 0,
                    healthDamage: !damageEvent.armor ? damageEvent.damageAmount : 0,
                    hasShield: damageEvent.armor,
                });

                this.matchRoster.setPlayerHasActivity(damageEvent.targetName);
            });
    }

    private setupKillfeedEvents(): void {
        this.matchRoster.killfeedEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                filter(() => this.player.status$.value !== PlayerStatus.Eliminated)
            )
            .subscribe((killfeed) => {
                if (killfeed.isKnockdown)
                    this._damageRoster.knockdownPlayer(killfeed.victimName, killfeed.attackerName);
                else if (killfeed.isElimination)
                    this._damageRoster.eliminatePlayer(killfeed.victimName, killfeed.attackerName);

                this.damageRoster$.next(this._damageRoster);
            });
    }
    //#endregion

    //#region Placement
    // TODO: This value needs to be verified.
    // WIP!
    /** Uses info from "match_tabs" or MatchRoster.teamsAlive */
    private setupPlacement(): void {
        const matchRosterAliveTeams = 0;
        const AliveTeams = 0;

        this.matchRoster.roster$
            .pipe(
                takeUntil(this._unsubscribe),
                map((matchRoster) => matchRoster.aliveTeams)
            )
            .subscribe((aliveTeams) => {
                const numAliveTeams = aliveTeams.length;
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
                filter(() => this.player.status$.value !== PlayerStatus.Eliminated),
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
