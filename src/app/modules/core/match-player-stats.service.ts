import { Injectable, OnDestroy } from "@angular/core";
import { MatchState } from "@common/match/match";
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

/**
 * @classdesc Provides damage/knockdown/kill, etc. count updates
 */
@Injectable({
    providedIn: "root",
    deps: [MatchService, MatchRosterService, OverwolfDataProviderService, PlayerService],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("MatchPlayerStatsService", MatchPlayerStatsService, deps),
})
export class MatchPlayerStatsService implements OnDestroy {
    /** */
    public readonly myEliminations = new BehaviorSubject<number>(0);
    /** */
    public readonly myAssists$ = new BehaviorSubject<number>(0);
    /** */
    public readonly myDamage$ = new BehaviorSubject<number>(0);
    /** @deprecated May not work; Feature is unavailable in game-UI. */
    public readonly mySpectators$ = new BehaviorSubject<number>(0);

    public readonly myPlacement$ = new BehaviorSubject<number>(0);
    public readonly victory$ = new BehaviorSubject<boolean>(false);
    /**
     * Damage amount does not take into consideration victim's HP, only the raw inflicted amount.
     * The contained damage amount will then appear to be inflated.
     * Info directly from Overwolf's me.damage_dealt data.
     */
    public readonly myTotalDamageDealt$ = new BehaviorSubject<number>(0);

    // private _damageRoster = new DamageRoster();
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
        this.setupInfoTabs();
        this.setupTotalDamageDealt();
        this.setupVictory();
    }

    private setupMatchStateEvents(): void {
        this.match.startedEvent$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this.myDamage$.next(0);
            this.myEliminations.next(0);
            this.myAssists$.next(0);
            this.mySpectators$.next(0);
            this.myPlacement$.next(0);
            this.victory$.next(false);
        });
    }

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
                setTabsHigherAmountFn(tabs.kills, this.myEliminations);
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
}
