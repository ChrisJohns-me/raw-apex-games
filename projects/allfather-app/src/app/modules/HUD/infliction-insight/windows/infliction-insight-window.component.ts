import { MatchInflictionEventAccum } from "@allfather-app/app/common/match/infliction-event";
import { MatchLocationPhase } from "@allfather-app/app/common/match/location";
import { MatchRosterPlayer } from "@allfather-app/app/common/match/roster-player";
import { MatchRosterTeam } from "@allfather-app/app/common/match/roster-team";
import { MatchState } from "@allfather-app/app/common/match/state";
import { OverwolfWindowName } from "@allfather-app/app/common/overwolf-window";
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
import { environment } from "@allfather-app/environments/environment";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { isEmpty, mathClamp } from "common/utilities/";
import { addMilliseconds } from "date-fns";
import { combineLatest, merge, Observable, Subject } from "rxjs";
import { delay, distinctUntilChanged, filter, pairwise, takeUntil, tap } from "rxjs/operators";
import { OpponentBanner } from "../components/opponent-banner/opponent-banner.component";

export enum InflictionInsightType {
    Disabled = "disabled",
    Digits = "digits",
    Emulated = "emulated",
}

@Component({
    selector: "app-hud-infliction-insight-window",
    templateUrl: "./infliction-insight-window.component.html",
    styleUrls: ["./infliction-insight-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InflictionInsightWindowComponent implements OnInit, OnDestroy {
    private TRACELOG = environment.DEV && false;
    public isVisible = false;

    public get sortedOpponentBannerList(): OpponentBanner[] {
        return this.sortOpponentBannerList(this.opponentBannerList);
    }
    public opponentBannerList: OpponentBanner[] = [];
    public rgbTeamColors: string[] = generateTeamColorList(65);

    public readonly OverwolfWindowName = OverwolfWindowName;

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
                this.traceLog("Match State Active, My State Alive, Location Phase HasLanded");
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
                this.traceLog("Match Ended or Player Died or Player Disconnected - Resetting Accumulations");
                this.isVisible = false;
                this.inflictionAggregator.clearAccumulations();
                this.opponentBannerList = [];
                this.cdr.detectChanges();
            });
    }

    private setupInflictionEventList(): void {
        merge(this.createMyInflictionEvents$(), this.createIndirectInflictionEvents$())
            .pipe(takeUntil(this.destroy$))
            .subscribe((inflAccum) => {
                this.traceLog("setupInflictionEventList() subscription:", inflAccum);
                if (isEmpty(inflAccum.victim?.name)) return;
                const foundOpponentBanner = this.opponentBannerList.find((b) =>
                    isPlayerNameEqual(b.rosterPlayer?.name, inflAccum.victim?.name)
                );
                this.traceLog("setupInflictionEventList() foundOpponentBanner:", foundOpponentBanner);

                if (foundOpponentBanner) {
                    const updatedOpponentBanner = this.addInflictionToBanner(foundOpponentBanner, inflAccum);
                    this.traceLog("setupInflictionEventList() updatedOpponentBanner:", updatedOpponentBanner);

                    if (updatedOpponentBanner) {
                        this.opponentBannerList = [
                            updatedOpponentBanner,
                            ...this.opponentBannerList.filter(
                                (e) => !isPlayerNameEqual(e.rosterPlayer.name, updatedOpponentBanner?.rosterPlayer.name)
                            ),
                        ];
                    }

                    this.traceLog(
                        "setupInflictionEventList() isTimestampExpired(inflAccum.latestTimestamp):",
                        this.isTimestampExpired(inflAccum.latestTimestamp),
                        inflAccum.latestTimestamp
                    );
                    if (this.isTimestampExpired(inflAccum.latestTimestamp)) {
                        if (this.acceptingResetEvents) this.resetBanner(foundOpponentBanner);
                    } else {
                        this.setIndirectBanners(foundOpponentBanner);
                    }
                } else {
                    const newOpponentBanner = this.createOpponentBanner(inflAccum);
                    this.traceLog("setupInflictionEventList() newOpponentBanner:", newOpponentBanner);

                    if (newOpponentBanner) {
                        this.opponentBannerList.push(newOpponentBanner);
                        this.setIndirectBanners(newOpponentBanner);
                        if (this.acceptingResetEvents) this.resetBanner(newOpponentBanner);
                    }
                }

                this.cdr.detectChanges();
            });
    }

    /**
     * Keeps track of the local player's damage inflicted onto other players
     * and converts them to accumulated events for banners to consume.
     * Sends out reset events.
     */
    private createMyInflictionEvents$(): Observable<MatchInflictionEventAccum> {
        return this.inflictionAggregator
            .getInflictionAggregate$([
                this.matchPlayerInfliction.myUniqueDamageEvent$.pipe(
                    tap((data) => this.traceLog("createMyInflictionEvents$() matchPlayerInfliction.myUniqueDamageEvent$ Emitted", data))
                ),
            ])
            .pipe(
                tap((data) =>
                    this.traceLog(
                        "createMyInflictionEvents$() inflictionAggregator.getInflictionAggregate$([myUniqueDamageEvent$]) Emitted",
                        data
                    )
                )
            );
    }

    /**
     * Keep track of opponents' status using the killfeed
     * and converts them to accumulated events for banners to consume.
     * Sends out reset events.
     */
    private createIndirectInflictionEvents$(): Observable<MatchInflictionEventAccum> {
        const relevantKillfeedEvent$ = this.matchPlayerInfliction.notMyKillfeedEvent$.pipe(
            filter((killfeedEvent) =>
                this.opponentBannerList.some((b) => isPlayerNameEqual(b.rosterPlayer?.name, killfeedEvent?.victim?.name))
            ),
            tap((data) => this.traceLog("createIndirectInflictionEvents$() matchPlayerInfliction.notMyKillfeedEvent$ Emitted", data))
        );
        return this.inflictionAggregator
            .getInflictionAggregate$([relevantKillfeedEvent$])
            .pipe(
                tap((data) =>
                    this.traceLog(
                        "createIndirectInflictionEvents$() inflictionAggregator.getInflictionAggregate$([relevantKillfeedEvent$]) Emitted",
                        data
                    )
                )
            );
    }

    private createOpponentBanner(inflictionEvent: MatchInflictionEventAccum): Optional<OpponentBanner> {
        this.traceLog("createOpponentBanner()", inflictionEvent);
        if (isEmpty(inflictionEvent.victim?.name)) return;
        const opponentBanner: OpponentBanner = {
            isIndirectBanner: false,
            rosterPlayer: inflictionEvent.victim!,
            latestInflictionAccum: inflictionEvent,
            maybeMaxShield: inflictionEvent.hasShield ? this.config.assumptions.opponentShieldDefault : 0,
            maybeShieldAmount: this.config.assumptions.opponentShieldDefault - inflictionEvent.shieldDamageSum,
            maybeHealthAmount: this.config.assumptions.opponentHealthDefault - inflictionEvent.healthDamageSum,
        };
        this.traceLog("createOpponentBanner() returning", opponentBanner);
        return opponentBanner;
    }

    private createOpponentIndirectBanner(player: MatchRosterPlayer): Optional<OpponentBanner> {
        this.traceLog("createOpponentIndirectBanner()", player);
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
        this.traceLog("createOpponentIndirectBanner() returning", opponentBanner);
        return opponentBanner;
    }

    /**
     * Add accumulated infliction onto an existing banner or indirect-banner
     */
    private addInflictionToBanner(currBanner: OpponentBanner, inflEvent: MatchInflictionEventAccum): Optional<OpponentBanner> {
        this.traceLog("addInflictionToBanner()", currBanner, inflEvent);
        if (!currBanner) return;
        if (!inflEvent?.latestTimestamp) return;
        if (inflEvent.hasShield) {
            this.traceLog("addInflictionToBanner() infliction event, opponent has shield");
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
            this.traceLog("addInflictionToBanner() infliction event, opponent does not have shield");
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
        this.traceLog("addInflictionToBanner() returning", currBanner);
        return currBanner;
    }

    private setIndirectBanners(opponentBanner: OpponentBanner): void {
        this.traceLog("setIndirectBanners()", opponentBanner);
        const matchRoster = this.matchRoster.matchRoster$.value;
        const victimRosterTeam: Optional<MatchRosterTeam> = matchRoster.teams.find((t) => t.teamId === opponentBanner.rosterPlayer?.teamId);
        const victimRosterTeammates: MatchRosterPlayer[] = victimRosterTeam?.members ?? [];
        if (isEmpty(victimRosterTeammates)) return;

        this.traceLog("setIndirectBanners() creating indirect banners from opponentBanner", opponentBanner);
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
        this.traceLog("resetBanner()", banner);

        const opponentTeamHasEvents = this.opponentBannerList
            .filter((e) => e.rosterPlayer.teamId === banner.rosterPlayer.teamId)
            .some((team) => !this.isTimestampExpired(team.latestInflictionAccum?.latestTimestamp));

        // Set this current banner to an "opponent teammate" or "indirect" banner, if their teammates have latest infliction events
        if (opponentTeamHasEvents) {
            this.traceLog("resetBanner() opponent's team has infliction events; setting to indirect banner");
            banner.isIndirectBanner = true;
        } else {
            this.traceLog("resetBanner() Removing banner and all teammates if there are no more latest infliction events");
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

    /**
     * Sorts by:
     *  - team with the latest inflication timestamp
     *  - roster ID
     */
    private sortOpponentBannerList(opponentBannerList: OpponentBanner[]): OpponentBanner[] {
        return opponentBannerList.slice().sort((ob1, ob2) => {
            if (ob1.rosterPlayer.teamId !== ob2.rosterPlayer.teamId) {
                const ob1LatestInfl = [...opponentBannerList.filter((o) => o.rosterPlayer.teamId === ob1.rosterPlayer.teamId)]
                    .slice()
                    .sort(
                        (a, b) =>
                            (b.latestInflictionAccum?.latestTimestamp?.getTime() ?? 0) -
                            (a.latestInflictionAccum?.latestTimestamp?.getTime() ?? 0)
                    )[0];
                const ob2LatestInfl = [...opponentBannerList.filter((o) => o.rosterPlayer.teamId === ob2.rosterPlayer.teamId)]
                    .slice()
                    .sort(
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

    private traceLog(...args: any[]): void {
        if (this.TRACELOG) console.log(`[InflictionInsightWindow]`, ...args);
    }
}
