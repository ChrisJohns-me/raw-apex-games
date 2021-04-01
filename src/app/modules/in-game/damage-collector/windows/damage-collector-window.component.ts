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
import { isEmpty } from "@shared/utilities";
import { combineLatest, merge, Subject } from "rxjs";
import { distinctUntilChanged, filter, takeUntil } from "rxjs/operators";

const ACCUM_EXPIRE = 20000;

export interface EnemyBadge {
    isTeammate: boolean;
    rosterPlayer: MatchRosterPlayer;
    latestInflictionAccum?: MatchInflictionEventAccum;
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
    private inflictionEventList: MatchInflictionEventAccum[] = [];
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
        this.setupDamageEventList();
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
            this.inflictionEventList = [];
            this.enemyBadgeList = [];
            this.cdr.detectChanges();
        });
    }

    private setupDamageEventList(): void {
        this.inflictionAggregator
            .getInflictionAggregate$([this.matchPlayerInfliction.myDamageEvent$, this.matchPlayerInfliction.myKillfeedEvent$])
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((inflictionEvent) => {
                console.debug(`[${this.constructor.name}] InflictionEvent received:`, inflictionEvent);
                this.inflictionEventList = [
                    ...this.inflictionEventList.filter((e) => !isPlayerNameEqual(e.victim?.name, inflictionEvent.victim?.name)),
                    inflictionEvent,
                ];
                this.updateEnemyBadgeList();
            });
    }

    private updateEnemyBadgeList(): void {
        const matchRoster = this.matchRoster.matchRoster$.value;
        const inflictionList = this.inflictionEventList;
        const newEnemyBadgeList: EnemyBadge[] = inflictionList
            .filter((infliction) => !isEmpty(infliction.victim?.name))
            .map((infliction) => {
                return {
                    isTeammate: false,
                    rosterPlayer: infliction.victim!,
                    latestInflictionAccum: infliction,
                } as EnemyBadge;
            });

        // Add teammates
        inflictionList.forEach((damage) => {
            const badgeListTeammate = newEnemyBadgeList.find((badge) => isPlayerNameEqual(badge.rosterPlayer.name, damage.victim?.name));
            if (badgeListTeammate) return;

            const victimTeam: Optional<MatchRosterTeam> = matchRoster.teams.find((t) => t.teamId === damage.victim?.teamId);
            const victimTeammates: MatchRosterPlayer[] = victimTeam?.members ?? [];
            if (!victimTeammates) return;

            victimTeammates.forEach((teammate) =>
                newEnemyBadgeList.push({
                    isTeammate: true,
                    rosterPlayer: teammate,
                })
            );
        });
        this.enemyBadgeList = newEnemyBadgeList;
        this.cdr.detectChanges();
    }
}
