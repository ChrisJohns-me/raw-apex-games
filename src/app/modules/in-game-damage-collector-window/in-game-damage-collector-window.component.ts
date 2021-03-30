import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { MatchInflictionEventAccum } from "@common/match/match-infliction-event";
import { MatchLocationPhase } from "@common/match/match-location";
import { MatchRosterPlayer } from "@common/match/match-roster-player";
import { MatchRosterTeam } from "@common/match/match-roster-team";
import { MatchState } from "@common/match/match-state";
import { PlayerState } from "@common/player-state";
import { InflictionAggregator } from "@common/utilities/infliction-aggregator";
import { isPlayerNameEqual } from "@common/utilities/player";
import { MatchPlayerInflictionService } from "@core/match/match-player-infliction.service";
import { MatchPlayerLocationService } from "@core/match/match-player-location.service";
import { MatchPlayerService } from "@core/match/match-player.service";
import { MatchRosterService } from "@core/match/match-roster.service";
import { MatchService } from "@core/match/match.service";
import { PlayerService } from "@core/player.service";
import { combineLatest, merge, Subject } from "rxjs";
import { distinctUntilChanged, filter, takeUntil } from "rxjs/operators";
import { isEmpty } from "src/utilities";

const ACCUM_EXPIRE = 5000;

interface EnemyBadge {
    isTeammate: boolean;
    rosterPlayer: MatchRosterPlayer;
    latestInflictionAccum?: MatchInflictionEventAccum;
}

@Component({
    selector: "app-in-game-damage-collector-window",
    templateUrl: "./in-game-damage-collector-window.component.html",
    styleUrls: ["./in-game-damage-collector-window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InGameDamageCollectorWindowComponent implements OnInit, OnDestroy {
    public isVisible = false;
    public enemyBadgeList$ = new Subject<EnemyBadge[]>();

    private inflictionEventList: MatchInflictionEventAccum[] = [];
    private readonly inflictionAggregator = new InflictionAggregator({
        expireAggregateMs: ACCUM_EXPIRE,
        emitOnExpire: true,
    });
    private _unsubscribe = new Subject<void>();

    constructor(
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
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private setupVisibleStates(): void {
        const nonAliveEvents$ = this.matchPlayer.myState$.pipe(filter((myState) => myState !== PlayerState.Alive));

        combineLatest([this.match.state$, this.matchPlayer.myState$, this.matchPlayerLocation.myLocationPhase$])
            .pipe(
                takeUntil(this._unsubscribe),
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
            });

        merge(this.match.endedEvent$, nonAliveEvents$)
            .pipe(takeUntil(this._unsubscribe))
            .subscribe(() => {
                this.isVisible = false;
            });
    }

    /**
     * Reset state on match end
     */
    private setupOnMatchEnd(): void {
        this.match.endedEvent$.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
            this.inflictionEventList = [];
            this.enemyBadgeList$.next([]);
        });
    }

    private setupDamageEventList(): void {
        this.inflictionAggregator
            .getInflictionAggregate$([this.matchPlayerInfliction.myDamageEvent$, this.matchPlayerInfliction.myKillfeedEvent$])
            .pipe(takeUntil(this._unsubscribe))
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
        const enemyBadgeList: EnemyBadge[] = inflictionList
            .filter((damage) => !isEmpty(damage.victim?.name))
            .map((damage) => ({
                isTeammate: false,
                rosterPlayer: damage.victim!,
                latestDamageAggregate: damage,
            }));

        // Add teammates
        inflictionList.forEach((damage) => {
            const badgeListTeammate = enemyBadgeList.find((badge) => isPlayerNameEqual(badge.rosterPlayer.name, damage.victim?.name));
            if (badgeListTeammate) return;

            const victimTeam: Optional<MatchRosterTeam> = matchRoster.teams.find((t) => t.teamId === damage.victim?.teamId);
            const victimTeammates: MatchRosterPlayer[] = victimTeam?.members ?? [];
            if (!victimTeammates) return;

            victimTeammates.forEach((teammate) =>
                enemyBadgeList.push({
                    isTeammate: true,
                    rosterPlayer: teammate,
                })
            );
        });
        this.enemyBadgeList$.next(enemyBadgeList);
    }
}
