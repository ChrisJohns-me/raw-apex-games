import { MatchInflictionEventAccum } from "@allfather-app/app/common/match/infliction-event";
import { MatchLocationPhase } from "@allfather-app/app/common/match/location";
import { MatchRosterPlayer } from "@allfather-app/app/common/match/roster-player";
import { MatchRosterTeam } from "@allfather-app/app/common/match/roster-team";
import { MatchState } from "@allfather-app/app/common/match/state";
import { PlayerState } from "@allfather-app/app/common/player-state";
import { generateTeamColorList } from "@allfather-app/app/common/team-color-generator";
import { InflictionAggregator } from "@allfather-app/app/common/utilities/infliction-aggregator";
import { isPlayerNameEqual } from "@allfather-app/app/common/utilities/player";
import { ConfigurationService } from "@allfather-app/app/modules/core/configuration.service";
import { MatchKillfeedService } from "@allfather-app/app/modules/core/match/match-killfeed.service";
import { MatchPlayerInflictionService } from "@allfather-app/app/modules/core/match/match-player-infliction.service";
import { MatchPlayerLocationService } from "@allfather-app/app/modules/core/match/match-player-location.service";
import { MatchPlayerService } from "@allfather-app/app/modules/core/match/match-player.service";
import { MatchRosterService } from "@allfather-app/app/modules/core/match/match-roster.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { Configuration } from "@allfather-app/configs/config.interface";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { isEmpty, mathClamp } from "common/utilities/";
import { addMilliseconds } from "date-fns";
import { combineLatest, interval, merge, Observable, Subject } from "rxjs";
import { delay, delayWhen, distinctUntilChanged, filter, map, pairwise, share, takeUntil, tap } from "rxjs/operators";
import { OpponentBanner } from "../components/opponent-banner/opponent-banner.component";

@Component({
    selector: "app-hud-infliction-insight-window",
    templateUrl: "./infliction-insight-window.component.html",
    styleUrls: ["./infliction-insight-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InflictionInsightWindowComponent implements OnInit, OnDestroy {
    public isVisible = false;

    /**
     * Sorts by:
     *  - team with the latest inflication timestamp
     *  - roster ID
     */
    public get sortedOpponentBannerList(): OpponentBanner[] {
        return [...this.opponentBannerList].sort((ob1, ob2) => {
            if (ob1.rosterPlayer.teamId !== ob2.rosterPlayer.teamId) {
                const ob1LatestInfl = [...this.opponentBannerList.filter((o) => o.rosterPlayer.teamId === ob1.rosterPlayer.teamId)].sort(
                    (a, b) =>
                        (b.latestInflictionAccum?.latestTimestamp?.getTime() ?? 0) -
                        (a.latestInflictionAccum?.latestTimestamp?.getTime() ?? 0)
                )[0];
                const ob2LatestInfl = [...this.opponentBannerList.filter((o) => o.rosterPlayer.teamId === ob2.rosterPlayer.teamId)].sort(
                    (a, b) =>
                        (b.latestInflictionAccum?.latestTimestamp?.getTime() ?? 0) -
                        (a.latestInflictionAccum?.latestTimestamp?.getTime() ?? 0)
                )[0];
                return (
                    (ob2LatestInfl.latestInflictionAccum?.latestTimestamp?.getTime() ?? 0) -
                    (ob1LatestInfl.latestInflictionAccum?.latestTimestamp?.getTime() ?? 0)
                );
            }
            return (ob1.rosterPlayer.rosterId ?? 0) - (ob2.rosterPlayer.rosterId ?? 0);
        });
    }
    public opponentBannerList: OpponentBanner[] = [];
    public rgbTeamColors: string[] = generateTeamColorList(65);
    private config: Configuration;

    private readonly inflictionAggregator;
    private acceptingResetEvents = false;
    private destroy$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly configuration: ConfigurationService,
        private readonly match: MatchService,
        private readonly matchKillfeed: MatchKillfeedService,
        private readonly matchPlayer: MatchPlayerService,
        private readonly matchPlayerInfliction: MatchPlayerInflictionService,
        private readonly matchPlayerLocation: MatchPlayerLocationService,
        private readonly matchRoster: MatchRosterService
    ) {
        this.config = this.configuration.defaultConfig;
        this.inflictionAggregator = new InflictionAggregator({
            expireAggregateMs: this.config.featureConfigs.inflictionInsight.damageResetTime,
            emitOnExpire: true,
        });
    }

    public trackByFn(index: number, banner: OpponentBanner): string {
        return banner.rosterPlayer.name;
    }

    public ngOnInit(): void {
        this.configuration.config$.pipe(takeUntil(this.destroy$)).subscribe((config) => (this.config = config));
        this.setupOnMatchStart();
        this.setupOnMatchEnd();
        this.setupInflictionEventList();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupOnMatchStart(): void {
        combineLatest([this.match.state$, this.matchPlayer.myState$, this.matchPlayerLocation.myLocationPhase$])
            .pipe(
                takeUntil(this.destroy$),
                filter(
                    ([matchState, myState, locationPhase]) =>
                        matchState.state === MatchState.Active &&
                        myState === PlayerState.Alive &&
                        locationPhase === MatchLocationPhase.HasLanded
                ),
                distinctUntilChanged()
            )
            .subscribe(() => {
                this.acceptingResetEvents = true;
                this.isVisible = true;
                this.cdr.detectChanges();
            });
    }

    /**
     * Reset state on match end or elimination
     */
    private setupOnMatchEnd(): void {
        const deathEvents = this.matchPlayer.myState$.pipe(
            pairwise(),
            filter(
                ([prevState, currState]) =>
                    prevState === PlayerState.Alive && (currState === PlayerState.Eliminated || currState === PlayerState.Disconnected)
            )
        );
        merge(this.match.endedEvent$, deathEvents)
            .pipe(
                takeUntil(this.destroy$),
                tap(() => (this.acceptingResetEvents = false)),
                delay(this.config.common.matchEndHUDTimeout)
            )
            .subscribe(() => {
                this.isVisible = false;
                this.inflictionAggregator.clearAccumulations();
                this.opponentBannerList = [];
                this.cdr.detectChanges();
            });
    }

    private setupInflictionEventList(): void {
        // merge(this.createMyDamageInflictionEvents$(), this.createIndirectInflictionEvents$())
        merge(this.createMyDamageInflictionEvents$())
            .pipe(takeUntil(this.destroy$))
            .subscribe((inflAccum) => {
                if (isEmpty(inflAccum.victim?.name)) return;
                const foundOpponentBanner = this.opponentBannerList.find((b) =>
                    isPlayerNameEqual(b.rosterPlayer?.name, inflAccum.victim?.name)
                );

                if (foundOpponentBanner) {
                    const updatedOpponentBanner = this.addInflictionToBanner(foundOpponentBanner, inflAccum);

                    if (updatedOpponentBanner) {
                        this.opponentBannerList = [
                            updatedOpponentBanner,
                            ...this.opponentBannerList.filter(
                                (e) => !isPlayerNameEqual(e.rosterPlayer.name, updatedOpponentBanner?.rosterPlayer.name)
                            ),
                        ];
                    }

                    if (this.isTimestampExpired(inflAccum.latestTimestamp)) {
                        if (this.acceptingResetEvents) this.resetBanner(foundOpponentBanner);
                    } else {
                        this.setIndirectBanners(foundOpponentBanner);
                    }
                } else {
                    const newOpponentBanner = this.createOpponentBanner(inflAccum);
                    if (newOpponentBanner) {
                        this.opponentBannerList.push(newOpponentBanner);
                        this.setIndirectBanners(newOpponentBanner);
                    }
                }
                this.cdr.detectChanges();
            });
    }

    private createMyDamageInflictionEvents$(): Observable<MatchInflictionEventAccum> {
        return this.inflictionAggregator.getInflictionAggregate$([
            this.matchPlayerInfliction.myDamageEvent$,
            this.matchPlayerInfliction.myKillfeedEvent$,
        ]);
    }

    /**
     * Keep track of opponents' status using the killfeed
     * and convert them to accumulated events for banners to consume.
     * Sends out reset events.
     */
    private createIndirectInflictionEvents$(): Observable<MatchInflictionEventAccum> {
        const indirectAccum$ = this.matchPlayerInfliction.notMyKillfeedEvent$.pipe(
            filter((killfeedEvent) =>
                this.opponentBannerList.some((b) => isPlayerNameEqual(b.rosterPlayer?.name, killfeedEvent?.victim?.name))
            ),
            map((killfeedEvent) => {
                const foundOpponentBanner = this.opponentBannerList.find((b) =>
                    isPlayerNameEqual(b.rosterPlayer?.name, killfeedEvent?.victim?.name)
                ) as OpponentBanner;
                return {
                    latestAttacker: killfeedEvent.attacker,
                    victim: killfeedEvent.victim,
                    hasShield: false,
                    isEliminated: !isEmpty(killfeedEvent.isElimination) ? killfeedEvent.isElimination! : false,
                    isKnocked: !isEmpty(killfeedEvent.isKnockdown) ? killfeedEvent.isKnockdown! : false,
                    healthDamageSum: foundOpponentBanner.latestInflictionAccum?.healthDamageSum ?? 0,
                    shieldDamageSum: foundOpponentBanner.latestInflictionAccum?.shieldDamageSum ?? 0,
                    latestTimestamp: killfeedEvent.timestamp,
                } as MatchInflictionEventAccum;
            }),
            share()
        );

        const indirectKnockdownReset$ = indirectAccum$.pipe(
            filter((inflAccum) => inflAccum.isKnocked && this.config.featureFlags.inflictionInsight.assumeKnockdownExpires),
            tap(() => console.log(`createUntrackedInflictionEvents: indirectKnockdownReset$ -> filtered isKnocked`)),
            delayWhen(() => interval(this.config.assumptions.knockdownExpireTime)),
            map((inflAccum) => {
                return {
                    victim: inflAccum.victim,
                    shieldDamageSum: 0,
                    healthDamageSum: 0,
                    hasShield: true,
                    isKnocked: false,
                    isEliminated: false,
                    latestAttacker: undefined,
                    latestTimestamp: undefined,
                } as MatchInflictionEventAccum;
            }),
            tap((inflAccum) => console.log(`createUntrackedInflictionEvents: indirectKnockdownReset$ -> after delayWhen()`, inflAccum))
        );

        const indirectEliminationReset$ = indirectAccum$.pipe(
            filter((inflAccum) => inflAccum.isEliminated && this.config.featureFlags.inflictionInsight.assumeEliminationExpires),
            tap(() => console.log(`createUntrackedInflictionEvents: indirectEliminationReset$ -> filtered isEliminated`)),
            delayWhen(() => interval(this.config.assumptions.eliminationExpireTime)),
            map((inflAccum) => {
                return {
                    victim: inflAccum.victim,
                    shieldDamageSum: 0,
                    healthDamageSum: 0,
                    hasShield: true,
                    isKnocked: false,
                    isEliminated: false,
                    latestAttacker: undefined,
                    latestTimestamp: undefined,
                } as MatchInflictionEventAccum;
            }),
            tap((inflAccum) => console.log(`createUntrackedInflictionEvents: indirectKnockdownReset$ -> after delayWhen()`, inflAccum))
        );

        return merge(indirectAccum$, indirectKnockdownReset$, indirectEliminationReset$);
    }

    private createOpponentBanner(inflictionEvent: MatchInflictionEventAccum): Optional<OpponentBanner> {
        if (isEmpty(inflictionEvent.victim?.name)) return;
        const opponentBanner: OpponentBanner = {
            isIndirectBanner: false,
            rosterPlayer: inflictionEvent.victim!,
            latestInflictionAccum: inflictionEvent,
            maybeMaxShield: inflictionEvent.hasShield ? this.config.assumptions.opponentShieldDefault : 0,
            maybeShieldAmount: this.config.assumptions.opponentShieldDefault - inflictionEvent.shieldDamageSum,
            maybeHealthAmount: this.config.assumptions.opponentHealthDefault - inflictionEvent.healthDamageSum,
        };
        return opponentBanner;
    }

    private createOpponentIndirectBanner(player: MatchRosterPlayer): Optional<OpponentBanner> {
        if (isEmpty(player.name)) return;
        const now = new Date();
        const lastKnownState = this.matchKillfeed.playerLastKnownState(player);

        const isKnocked = PlayerState.Knocked === lastKnownState?.state;
        const hasKnockExpired =
            this.config.featureFlags.inflictionInsight.assumeKnockdownExpires &&
            now > addMilliseconds(lastKnownState?.timestamp ?? 0, this.config.assumptions.knockdownExpireTime);
        const isEliminated = PlayerState.Eliminated === lastKnownState?.state;
        const hasEliminationExpired =
            this.config.featureFlags.inflictionInsight.assumeEliminationExpires &&
            now > addMilliseconds(lastKnownState?.timestamp ?? 0, this.config.assumptions.eliminationExpireTime);

        const assumedInfliction: MatchInflictionEventAccum = {
            victim: player,
            isKnocked: isKnocked && !hasKnockExpired,
            isEliminated: isEliminated && !hasEliminationExpired,
            shieldDamageSum: 0,
            healthDamageSum: 0,
            hasShield: true,
            latestAttacker: undefined,
            latestTimestamp: lastKnownState?.timestamp,
        };

        const opponentBanner: OpponentBanner = {
            isIndirectBanner: true,
            rosterPlayer: player,
            latestInflictionAccum: assumedInfliction,
            maybeMaxShield: this.config.featureFlags.inflictionInsight.showAssumedOpponentTeammateShields
                ? this.config.assumptions.opponentShieldDefault
                : 0,
            maybeShieldAmount: this.config.featureFlags.inflictionInsight.showAssumedOpponentTeammateShields
                ? this.config.assumptions.opponentShieldDefault
                : 0,
            maybeHealthAmount: this.config.featureFlags.inflictionInsight.showAssumedOpponentTeammateHealth
                ? this.config.assumptions.opponentHealthDefault
                : 0,
        };
        return opponentBanner;
    }

    /**
     * Add accumulated infliction onto an existing banner or indirect-banner
     */
    private addInflictionToBanner(currBanner: OpponentBanner, inflEvent: MatchInflictionEventAccum): Optional<OpponentBanner> {
        if (!currBanner) return;
        if (!inflEvent?.latestTimestamp) return;
        if (inflEvent.hasShield) {
            currBanner.maybeMaxShield = mathClamp(
                inflEvent.shieldDamageSum > this.config.assumptions.opponentShieldDefault
                    ? inflEvent.shieldDamageSum
                    : this.config.assumptions.opponentShieldDefault,
                0,
                this.config.facts.maxShield
            );
            currBanner.maybeShieldAmount = mathClamp(
                this.config.assumptions.opponentShieldDefault - inflEvent.shieldDamageSum,
                0,
                this.config.facts.maxShield
            );
        } else {
            currBanner.maybeMaxShield = mathClamp(inflEvent.shieldDamageSum, 0, this.config.facts.maxShield);
            currBanner.maybeShieldAmount = 0;
        }
        currBanner.latestInflictionAccum = inflEvent;
        currBanner.maybeHealthAmount = mathClamp(
            this.config.assumptions.opponentHealthDefault - inflEvent.healthDamageSum,
            0,
            this.config.facts.maxHealth
        );
        currBanner.isIndirectBanner =
            (!inflEvent.shieldDamageSum || inflEvent.shieldDamageSum === 0) &&
            (!inflEvent.healthDamageSum || inflEvent.healthDamageSum === 0) &&
            !inflEvent.latestAttacker?.isMe;
        return currBanner;
    }

    private setIndirectBanners(opponentBanner: OpponentBanner): void {
        const matchRoster = this.matchRoster.matchRoster$.value;
        const victimRosterTeam: Optional<MatchRosterTeam> = matchRoster.teams.find((t) => t.teamId === opponentBanner.rosterPlayer?.teamId);
        const victimRosterTeammates: MatchRosterPlayer[] = victimRosterTeam?.members ?? [];
        if (isEmpty(victimRosterTeammates)) return;

        victimRosterTeammates
            .filter((rosterTeammate) => !isPlayerNameEqual(rosterTeammate.name, opponentBanner.rosterPlayer.name))
            .filter((rosterTeammate) => !this.opponentBannerList.some((b) => isPlayerNameEqual(b.rosterPlayer.name, rosterTeammate.name)))
            .forEach((rosterTeammate) => {
                const teammateBanner = this.createOpponentIndirectBanner(rosterTeammate);
                if (teammateBanner) this.opponentBannerList.push(teammateBanner);
            });
    }

    /**
     * - Removes the banner if there are no more infliction events for their team.
     * - Sets the banner to an "opponent teammate" banner, if their teammates do still have infliction events.
     */
    private resetBanner(banner: OpponentBanner): void {
        const opponentTeamHasEvents = this.opponentBannerList
            .filter((e) => e.rosterPlayer.teamId === banner.rosterPlayer.teamId)
            .some((team) => !this.isTimestampExpired(team.latestInflictionAccum?.latestTimestamp));

        // Set this current banner to an "opponent teammate" or "indirect" banner, if their teammates have latest infliction events
        if (opponentTeamHasEvents) {
            banner.isIndirectBanner = true;
        } else {
            // Remove banner and all teammates if there are no more latest infliction events
            this.opponentBannerList = this.opponentBannerList.filter((b) => b.rosterPlayer.teamId !== banner.rosterPlayer.teamId);
        }
    }

    /**
     * @returns true if timestamp is undefined or expired
     */
    private isTimestampExpired(timestamp?: Date): boolean {
        return (
            !timestamp ||
            addMilliseconds(timestamp ?? 0, this.config.featureConfigs.inflictionInsight.damageResetTime).getTime() <= Date.now()
        );
    }
}
