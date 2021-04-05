import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatchPlayerInflictionService } from "@core/match/match-player-infliction.service";
import { MatchPlayerLocationService } from "@core/match/match-player-location.service";
import { MatchPlayerService } from "@core/match/match-player.service";
import { MatchRosterService } from "@core/match/match-roster.service";
import { MatchService } from "@core/match/match.service";
import { PlayerService } from "@core/player.service";
import { MatchInflictionEventAccum } from "@shared/models/match/match-infliction-event";
import { MatchLocationPhase } from "@shared/models/match/match-location";
import { MatchRosterPlayer } from "@shared/models/match/match-roster-player";
import { MatchRosterTeam } from "@shared/models/match/match-roster-team";
import { MatchState } from "@shared/models/match/match-state";
import { PlayerState } from "@shared/models/player-state";
import { InflictionAggregator } from "@shared/models/utilities/infliction-aggregator";
import { isPlayerNameEqual } from "@shared/models/utilities/player";
import { isEmpty, mathClamp } from "@shared/utilities";
import { addMilliseconds } from "date-fns";
import { combineLatest, merge, Subject } from "rxjs";
import { distinctUntilChanged, filter, takeUntil } from "rxjs/operators";
import { OpponentBanner } from "../components/opponent-banner/opponent-banner.component";

const ACCUM_EXPIRE = 15000;
const SHIELD_MAX = 125;
const HEALTH_MAX = 100;
const SHIELD_DEFAULT_ASSUMPTION = 75;
const HEALTH_DEFAULT_ASSUMPTION = 100;

@Component({
    selector: "app-in-game-infliction-insight-window",
    templateUrl: "./infliction-insight-window.component.html",
    styleUrls: ["./infliction-insight-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InflictionInsightWindowComponent implements OnInit, OnDestroy {
    public isVisible = false;

    public opponentBannerList: OpponentBanner[] = [];
    private readonly inflictionAggregator = new InflictionAggregator({
        expireAggregateMs: ACCUM_EXPIRE,
        emitOnExpire: true,
    });
    private _unsubscribe$ = new Subject<void>();

    constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly match: MatchService,
        private readonly matchPlayer: MatchPlayerService,
        private readonly matchPlayerInfliction: MatchPlayerInflictionService,
        private readonly matchPlayerLocation: MatchPlayerLocationService,
        private readonly matchRoster: MatchRosterService,
        private readonly player: PlayerService
    ) {}

    public ngOnInit(): void {
        this.setupVisibleStates();
        this.setupOnMatchEnd();
        this.setupInflictionEventList();
    }

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    private setupVisibleStates(): void {
        const nonAliveEvents$ = this.matchPlayer.myState$.pipe(filter((myState) => myState !== PlayerState.Alive));

        combineLatest([this.match.state$, this.matchPlayer.myState$, this.matchPlayerLocation.myLocationPhase$])
            .pipe(
                takeUntil(this._unsubscribe$),
                filter(
                    ([matchState, myState, locationPhase]) =>
                        matchState.state === MatchState.Active &&
                        myState === PlayerState.Alive &&
                        locationPhase === MatchLocationPhase.HasLanded
                ),
                distinctUntilChanged()
            )
            .subscribe(() => {
                this.isVisible = true;
                this.cdr.detectChanges();
            });

        merge(this.match.endedEvent$, nonAliveEvents$)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe(() => {
                this.isVisible = false;
                this.cdr.detectChanges();
            });
    }

    /**
     * Reset state on match end
     */
    private setupOnMatchEnd(): void {
        this.match.endedEvent$.pipe(takeUntil(this._unsubscribe$)).subscribe(() => {
            this.inflictionAggregator.clearAccumulations();
            this.opponentBannerList = [];
            this.cdr.detectChanges();
        });
    }

    private setupInflictionEventList(): void {
        this.inflictionAggregator
            .getInflictionAggregate$([this.matchPlayerInfliction.myDamageEvent$, this.matchPlayerInfliction.myKillfeedEvent$])
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((inflictionEvent) => {
                if (isEmpty(inflictionEvent.victim?.name)) return;
                const foundOpponentBanner = this.opponentBannerList.find((b) =>
                    isPlayerNameEqual(b.rosterPlayer?.name, inflictionEvent.victim?.name)
                );

                if (foundOpponentBanner) {
                    const updatedOpponentBanner = this.addInflictionToBanner(foundOpponentBanner, inflictionEvent);

                    if (updatedOpponentBanner) {
                        this.opponentBannerList = [
                            updatedOpponentBanner,
                            ...this.opponentBannerList.filter(
                                (e) => !isPlayerNameEqual(e.rosterPlayer.name, updatedOpponentBanner?.rosterPlayer.name)
                            ),
                        ];
                    }

                    if (this.isTimestampExpired(inflictionEvent.latestTimestamp)) {
                        this.resetBanner(foundOpponentBanner);
                    } else {
                        this.setTeammates(foundOpponentBanner);
                    }
                } else {
                    const newOpponentBanner = this.createOpponentBanner(inflictionEvent);
                    if (newOpponentBanner) {
                        this.opponentBannerList.push(newOpponentBanner);
                        this.setTeammates(newOpponentBanner);
                    }
                }
                this.cdr.detectChanges();
            });
    }

    private createOpponentBanner(inflictionEvent: MatchInflictionEventAccum): Optional<OpponentBanner> {
        if (isEmpty(inflictionEvent.victim?.name)) return;
        const opponentBanner: OpponentBanner = {
            isVictimTeammate: false,
            rosterPlayer: inflictionEvent.victim!,
            latestInflictionAccum: inflictionEvent,
            maybeShieldMax: inflictionEvent.hasShield ? SHIELD_DEFAULT_ASSUMPTION : 0,
            maybeShieldAmount: SHIELD_DEFAULT_ASSUMPTION - inflictionEvent.shieldDamageSum,
            maybeHealthAmount: HEALTH_DEFAULT_ASSUMPTION - inflictionEvent.healthDamageSum,
        };
        return opponentBanner;
    }

    private createOpponentTeammateBanner(player: MatchRosterPlayer): Optional<OpponentBanner> {
        if (isEmpty(player.name)) return;
        const opponentBanner: OpponentBanner = {
            isVictimTeammate: true,
            rosterPlayer: player,
            latestInflictionAccum: undefined,
            maybeShieldMax: SHIELD_DEFAULT_ASSUMPTION,
            maybeShieldAmount: SHIELD_DEFAULT_ASSUMPTION,
            maybeHealthAmount: HEALTH_DEFAULT_ASSUMPTION,
        };
        return opponentBanner;
    }

    private addInflictionToBanner(currentBanner: OpponentBanner, inflictionEvent: MatchInflictionEventAccum): Optional<OpponentBanner> {
        if (!currentBanner) return;
        if (!inflictionEvent.latestTimestamp) return;
        if (inflictionEvent.hasShield) {
            currentBanner.maybeShieldMax = mathClamp(
                inflictionEvent.shieldDamageSum > SHIELD_DEFAULT_ASSUMPTION ? inflictionEvent.shieldDamageSum : SHIELD_DEFAULT_ASSUMPTION,
                0,
                SHIELD_MAX
            );
            currentBanner.maybeShieldAmount = mathClamp(SHIELD_DEFAULT_ASSUMPTION - inflictionEvent.shieldDamageSum, 0, SHIELD_MAX);
        } else {
            currentBanner.maybeShieldMax = mathClamp(inflictionEvent.shieldDamageSum, 0, SHIELD_MAX);
            currentBanner.maybeShieldAmount = 0;
        }
        currentBanner.isVictimTeammate = false;
        currentBanner.latestInflictionAccum = inflictionEvent;
        currentBanner.maybeHealthAmount = mathClamp(HEALTH_DEFAULT_ASSUMPTION - inflictionEvent.healthDamageSum, 0, HEALTH_MAX);
        return currentBanner;
    }

    private setTeammates(opponentBanner: OpponentBanner): void {
        const matchRoster = this.matchRoster.matchRoster$.value;
        const victimRosterTeam: Optional<MatchRosterTeam> = matchRoster.teams.find((t) => t.teamId === opponentBanner.rosterPlayer?.teamId);
        const victimRosterTeammates: MatchRosterPlayer[] = victimRosterTeam?.members ?? [];
        if (isEmpty(victimRosterTeammates)) return;

        victimRosterTeammates
            .filter((rosterTeammate) => !isPlayerNameEqual(rosterTeammate.name, opponentBanner.rosterPlayer.name))
            .filter((rosterTeammate) => !this.opponentBannerList.some((b) => isPlayerNameEqual(b.rosterPlayer.name, rosterTeammate.name)))
            .forEach((rosterTeammate) => {
                const teammateBanner = this.createOpponentTeammateBanner(rosterTeammate);
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

        // Set this current banner to an "opponent teammate" banner, if their teammates have latest infliction events
        if (opponentTeamHasEvents) {
            banner.isVictimTeammate = true;
        } else {
            // Remove banner and all teammates if there are no more latest infliction events
            this.opponentBannerList = this.opponentBannerList.filter((b) => b.rosterPlayer.teamId !== banner.rosterPlayer.teamId);
        }
    }

    /**
     * @returns true if timestamp is undefined or expired
     */
    private isTimestampExpired(timestamp?: Date): boolean {
        return !timestamp || addMilliseconds(timestamp ?? 0, ACCUM_EXPIRE).getTime() <= Date.now();
    }
}
