import { Injectable, OnDestroy } from "@angular/core";
import { DamageEvent } from "@common/damage-event";
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
    public readonly myKills$ = new BehaviorSubject<number>(0);
    /** */
    public readonly myAssists$ = new BehaviorSubject<number>(0);
    /** */
    public readonly myDamage$ = new BehaviorSubject<number>(0);
    /** @deprecated May not work; Feature is unavailable in game-UI. */
    public readonly mySpectators$ = new BehaviorSubject<number>(0);

    public readonly myDamageRoster$;
    public readonly myDamageEvent$ = new Subject<DamageEvent>();
    public readonly myPlacement$ = new BehaviorSubject<number>(0);
    public readonly victory$ = new BehaviorSubject<boolean>(false);
    /**
     * Damage amount does not take into consideration victim's HP, only the raw inflicted amount.
     * The contained damage amount will then appear to be inflated.
     * Info directly from Overwolf's me.damage_dealt data.
     * Hypothetically should equal damageRoster's total damage.
     */
    public readonly myTotalDamageDealt$ = new BehaviorSubject<number>(0);

    private _damageRoster = new DamageRoster();
    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly match: MatchService,
        private readonly matchRoster: MatchRosterService,
        private readonly overwolf: OverwolfDataProviderService,
        private readonly player: PlayerService
    ) {
        this.myDamageRoster$ = new BehaviorSubject<DamageRoster>(this._damageRoster);
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupMatchStateEvents();
        this.setupInfoTabs();
        this.setupTotalDamageDealt();
        this.setupDamageRosterPlayer();
        this.setupDamageEvents();
        this.setupInflictionEvents();
        this.setupVictory();
    }

    private setupMatchStateEvents(): void {
        this.match.started$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this._damageRoster = new DamageRoster(this.player.me$.value);
            this.myDamageRoster$.next(this._damageRoster);
            this.myDamage$.next(0);
            this.myKills$.next(0);
            this.myAssists$.next(0);
            this.mySpectators$.next(0);
            this.myPlacement$.next(0);
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
                setTabsHigherAmountFn(tabs.kills, this.myKills$);
                setTabsHigherAmountFn(tabs.assists, this.myAssists$);
                setTabsHigherAmountFn(tabs.damage, this.myDamage$);
                this.mySpectators$.next(cleanInt(tabs.spectators));
                this.myPlacement$.next(cleanInt(tabs.teams));
            });
    }

    private setupTotalDamageDealt(): void {
        this.overwolf.infoUpdates$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((infoUpdate) => infoUpdate.feature === "damage" && !!infoUpdate.info.me?.totalDamageDealt),
                map((infoUpdate) => cleanInt(infoUpdate.info.me?.totalDamageDealt))
            )
            .subscribe((totalDamageDealt) => this.myTotalDamageDealt$.next(totalDamageDealt));
    }
    //#endregion

    //#region Damage Roster
    private setupDamageRosterPlayer(): void {
        this.player.me$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((me) => !!me)
            )
            .subscribe((myself) => {
                this._damageRoster.primaryAttacker = myself;
            });
    }

    /** Damage events from the info update feed */
    private setupDamageEvents(): void {
        this.overwolf.newGameEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((gameEvent) => gameEvent.name === "damage"),
                map((gameEvent) => gameEvent.data as overwolf.gep.ApexLegends.GameEventDamage),
                filter(() => this.player.me$.value.status !== PlayerStatus.Eliminated)
            )
            .subscribe((damageEvent) => {
                const matchRoster = this.matchRoster.roster$.value;
                const victim = matchRoster.players.find((p) => p.name === damageEvent.targetName);
                if (!victim) {
                    console.warn(`[${this.constructor.name}] Unable to find "${damageEvent.targetName}" from roster.`);
                    return;
                }

                const newDamageEvent = this._damageRoster.inflictPlayerDamage({
                    attacker: this.player.me$.value,
                    victim: victim,
                    shieldDamage: parseBoolean(damageEvent.armor) ? damageEvent.damageAmount : 0,
                    healthDamage: !parseBoolean(damageEvent.armor) ? damageEvent.damageAmount : 0,
                    isHeadshot: damageEvent.headshot,
                    hasShield: parseBoolean(damageEvent.armor),
                });

                if (newDamageEvent) {
                    this.myDamageEvent$.next(newDamageEvent);
                    this.myDamageRoster$.next(this._damageRoster);
                }

                this.matchRoster.setPlayerHasActivity(victim);
            });
    }

    /** Knockdown & Kill events from the game event kill feed */
    private setupInflictionEvents(): void {
        this.overwolf.newGameEvent$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((gameEvent) => gameEvent.name === "knockdown" || gameEvent.name === "kill"),
                filter(
                    (gameEvent) =>
                        !!gameEvent.data && !!(gameEvent.data as overwolf.gep.ApexLegends.GameEventKill).victimName
                )
            )
            .subscribe((gameEvent) => {
                const victimName = (gameEvent.data as overwolf.gep.ApexLegends.GameEventKill).victimName;
                const matchRoster = this.matchRoster.roster$.value;
                const victim = matchRoster.players.find((p) => p.name === victimName);
                if (!victim) {
                    console.warn(`[${this.constructor.name}] Unable to find "${victimName}" from roster.`);
                    return;
                }

                let damageEvent: Optional<DamageEvent>;
                if (gameEvent.name === "knockdown")
                    damageEvent = this._damageRoster.knockdownPlayer(victim, this.player.me$.value);
                else if (gameEvent.name === "kill")
                    damageEvent = this._damageRoster.eliminatePlayer(victim, this.player.me$.value);

                if (damageEvent) {
                    this.myDamageRoster$.next(this._damageRoster);
                    this.myDamageEvent$.next(damageEvent);
                }
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
                filter(() => this.player.me$.value.status !== PlayerStatus.Eliminated),
                filter((infoUpdate) => infoUpdate.feature === "rank"),
                map((infoUpdate) => infoUpdate.info.match_info),
                filter((matchInfo) => !!matchInfo && !!Object.keys(matchInfo).includes("victory")),
                map((matchInfo) => parseBoolean(matchInfo?.victory))
            )
            .subscribe((isVictory) => {
                this.myPlacement$.next(1);
                this.victory$.next(isVictory);
            });
    }
    //#endregion
}
