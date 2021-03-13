import { Injectable, OnDestroy } from "@angular/core";
import { DamageRoster } from "@common/damage-roster";
import { BehaviorSubject, Subject } from "rxjs";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { MatchRosterService } from "./match-roster.service";
import { OverwolfDataProviderService } from "./overwolf-data-provider";

// TODO:
//  Damage events here
//  Kills
//  Knockdowns
//  probably also deaths... respawns --> move from playerService
@Injectable({
    providedIn: "root",
    deps: [MatchRosterService, OverwolfDataProviderService],
    useFactory: (...deps: unknown[]) =>
        SingletonServiceProviderFactory("PlayerActivityService", PlayerActivityService, deps),
})
export class PlayerActivityService implements OnDestroy {
    public readonly damageRoster$ = new BehaviorSubject<Optional<DamageRoster>>(undefined);

    private readonly _unsubscribe = new Subject<void>();

    constructor(
        private readonly matchRoster: MatchRosterService,
        private readonly overwolf: OverwolfDataProviderService
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
    }

    //#region Damage Roster
    private setupDamageRoster(): void {}
    ;; TODO SETUP DAMAGE roster
    new DamageRoster(); <----
    //#endregion
}
