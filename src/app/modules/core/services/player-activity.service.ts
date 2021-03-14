import { Injectable, OnDestroy } from "@angular/core";
import { DamageRoster } from "@common/damage-roster";
import { MatchState } from "@common/match";
import { BehaviorSubject, Subject } from "rxjs";
import { distinctUntilChanged, filter, map, takeUntil, tap } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { MatchRosterService } from "./match-roster.service";
import { MatchService } from "./match.service";
import { OverwolfDataProviderService } from "./overwolf-data-provider";
import { PlayerService } from "./player.service";

@Injectable({
    providedIn: "root",
    deps: [MatchRosterService, OverwolfDataProviderService],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("PlayerActivityService", PlayerActivityService, deps),
})
export class PlayerActivityService implements OnDestroy {
    public readonly damageRoster$ = new BehaviorSubject<Optional<DamageRoster>>(undefined);

    private _damageRoster: Optional<DamageRoster>;

    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly match: MatchService,
        private readonly matchRoster: MatchRosterService,
        private readonly overwolf: OverwolfDataProviderService,
        private readonly player: PlayerService
    ) {
        console.debug(`[${this.constructor.name}] Instantiated`);

        this.start();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private start(): void {
        this.setupDamageRoster();
        this.setupDamageEvents();
        this.setupKillfeedEvents();
    }

    //#region Damage Roster
    private setupDamageRoster(): void {
        this.match.state$
            .pipe(
                takeUntil(this._unsubscribe),
                distinctUntilChanged(),
                filter((matchState) => matchState === MatchState.Active),
                tap(() => (this._damageRoster = new DamageRoster(this.player.playerName$.value)))
            )
            .subscribe();
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
        this.matchRoster.killfeed$.pipe(takeUntil(this._unsubscribe)).subscribe((killfeed) => {
            if (killfeed.isKnockdown) {
                this._damageRoster?.knockdownPlayer(killfeed.victimName, killfeed.attackerName);
            } else if (killfeed.isElimination) {
                this._damageRoster?.eliminatePlayer(killfeed.victimName, killfeed.attackerName);
            }
            this.damageRoster$.next(this._damageRoster);
        });
    }
}
