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

const ACCUM_EXPIRE = 10000;
const SHIELD_MAX = 125;
const HEALTH_MAX = 100;
const SHIELD_DEFAULT_ASSUMPTION = 75;
const HEALTH_DEFAULT_ASSUMPTION = 100;

const DEBUG_ALLOW_RESET = true;

export interface EnemyBadge {
    isVictimTeammate: boolean;
    rosterPlayer: MatchRosterPlayer;
    latestInflictionAccum?: MatchInflictionEventAccum;
    maybeShieldMax: number;
    maybeShieldAmount: number;
    maybeHealthAmount: number;
}

@Component({
    selector: "app-in-game-damage-collector-window",
    templateUrl: "./damage-collector-window.component.html",
    styleUrls: ["./damage-collector-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DamageCollectorWindowComponent implements OnInit, OnDestroy {
    public isVisible = false;

    public enemyBadgeList: EnemyBadge[] = [];
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
            this.enemyBadgeList = [];
            this.cdr.detectChanges();
        });
    }

    private setupInflictionEventList(): void {
        this.inflictionAggregator
            .getInflictionAggregate$([this.matchPlayerInfliction.myDamageEvent$, this.matchPlayerInfliction.myKillfeedEvent$])
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((inflictionEvent) => {
                if (isEmpty(inflictionEvent.victim?.name)) return;
                const foundVictimBadge = this.enemyBadgeList.find((b) =>
                    isPlayerNameEqual(b.rosterPlayer?.name, inflictionEvent.victim?.name)
                );

                if (foundVictimBadge) {
                    this.updateExistingVictimBadge(foundVictimBadge, inflictionEvent);
                    if (this.isTimestampExpired(inflictionEvent.latestTimestamp)) {
                        this.resetBadge(foundVictimBadge);
                    } else {
                        this.updateTeammates(foundVictimBadge);
                    }
                } else {
                    const newEnemyBadge = this.createVictimBadge(inflictionEvent);
                    if (newEnemyBadge) {
                        this.enemyBadgeList.push(newEnemyBadge);
                        this.updateTeammates(newEnemyBadge);
                    }
                }
                this.cdr.detectChanges();
            });
    }

    private createVictimBadge(inflictionEvent: MatchInflictionEventAccum): Optional<EnemyBadge> {
        if (isEmpty(inflictionEvent.victim?.name)) return;
        const enemyBadge: EnemyBadge = {
            isVictimTeammate: false,
            rosterPlayer: inflictionEvent.victim!,
            latestInflictionAccum: inflictionEvent,
            maybeShieldMax: inflictionEvent.hasShield ? SHIELD_DEFAULT_ASSUMPTION : 0,
            maybeShieldAmount: SHIELD_DEFAULT_ASSUMPTION - inflictionEvent.shieldDamageSum,
            maybeHealthAmount: HEALTH_DEFAULT_ASSUMPTION - inflictionEvent.healthDamageSum,
        };
        return enemyBadge;
    }

    private createVictimTeammateBadge(player: MatchRosterPlayer): Optional<EnemyBadge> {
        if (isEmpty(player.name)) return;
        const enemyBadge: EnemyBadge = {
            isVictimTeammate: true,
            rosterPlayer: player,
            latestInflictionAccum: undefined,
            maybeShieldMax: SHIELD_DEFAULT_ASSUMPTION,
            maybeShieldAmount: SHIELD_DEFAULT_ASSUMPTION,
            maybeHealthAmount: HEALTH_DEFAULT_ASSUMPTION,
        };
        return enemyBadge;
    }

    private updateExistingVictimBadge(foundVictimBadge: EnemyBadge, inflictionEvent: MatchInflictionEventAccum): void {
        if (!DEBUG_ALLOW_RESET && !inflictionEvent.latestTimestamp) return;
        if (inflictionEvent.hasShield) {
            foundVictimBadge.maybeShieldMax = mathClamp(
                inflictionEvent.shieldDamageSum > SHIELD_DEFAULT_ASSUMPTION ? inflictionEvent.shieldDamageSum : SHIELD_DEFAULT_ASSUMPTION,
                0,
                SHIELD_MAX
            );
            foundVictimBadge.maybeShieldAmount = mathClamp(SHIELD_DEFAULT_ASSUMPTION - inflictionEvent.shieldDamageSum, 0, SHIELD_MAX);
        } else {
            foundVictimBadge.maybeShieldMax = mathClamp(inflictionEvent.shieldDamageSum, 0, SHIELD_MAX);
            foundVictimBadge.maybeShieldAmount = 0;
        }
        foundVictimBadge.isVictimTeammate = false;
        foundVictimBadge.latestInflictionAccum = inflictionEvent;
        foundVictimBadge.maybeHealthAmount = mathClamp(HEALTH_DEFAULT_ASSUMPTION - inflictionEvent.healthDamageSum, 0, HEALTH_MAX);
    }

    private updateTeammates(victimBadge: EnemyBadge): void {
        const matchRoster = this.matchRoster.matchRoster$.value;
        const victimRosterTeam: Optional<MatchRosterTeam> = matchRoster.teams.find((t) => t.teamId === victimBadge.rosterPlayer?.teamId);
        const victimRosterTeammates: MatchRosterPlayer[] = victimRosterTeam?.members ?? [];
        if (isEmpty(victimRosterTeammates)) return;

        victimRosterTeammates
            .filter((rosterTeammate) => !isPlayerNameEqual(rosterTeammate.name, victimBadge.rosterPlayer.name))
            .filter((rosterTeammate) => !this.enemyBadgeList.some((b) => isPlayerNameEqual(b.rosterPlayer.name, rosterTeammate.name)))
            .forEach((rosterTeammate) => {
                const teammateBadge = this.createVictimTeammateBadge(rosterTeammate);
                if (teammateBadge) this.enemyBadgeList.push(teammateBadge);
            });
    }

    /**
     * - Removes the badge if there are no more infliction events for their team.
     * - Sets the badge to an "enemy teammate" badge, if their teammates do still have infliction events.
     */
    private resetBadge(badge: EnemyBadge): void {
        if (!DEBUG_ALLOW_RESET) return;
        const enemyTeamHasEvents = this.enemyBadgeList
            .filter((e) => e.rosterPlayer.teamId === badge.rosterPlayer.teamId)
            .some((team) => !this.isTimestampExpired(team.latestInflictionAccum?.latestTimestamp));

        // Set this current badge to an "enemy teammate" badge, if their teammates have latest infliction events
        if (enemyTeamHasEvents) {
            badge.isVictimTeammate = true;
        } else {
            // Remove badge and all teammates if there are no more latest infliction events
            this.enemyBadgeList = this.enemyBadgeList.filter((b) => b.rosterPlayer.teamId !== badge.rosterPlayer.teamId);
        }
    }

    /**
     * @returns true if timestamp is undefined or expired
     */
    private isTimestampExpired(timestamp?: Date): boolean {
        return !timestamp || addMilliseconds(timestamp ?? 0, ACCUM_EXPIRE).getTime() <= Date.now();
    }
}
