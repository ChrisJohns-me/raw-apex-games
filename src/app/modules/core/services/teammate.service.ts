import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { MatchService } from "./match.service";
import { OverwolfDataProviderService } from "./overwolf-data-provider";

@Injectable({
    providedIn: "root",
    deps: [MatchService, OverwolfDataProviderService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("TeammateService", TeammateService, deps),
})
export class TeammateService implements OnDestroy {
    // public readonly teammates$ = new BehaviorSubject<>();

    private readonly _unsubscribe = new Subject<void>();

    constructor(private readonly match: MatchService, private readonly overwolf: OverwolfDataProviderService) {
        console.debug(`[${this.constructor.name}] Instantiated`);

        this.start();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private start(): void {
        this.setupTeammates();
    }

    //#region Teammates
    private setupTeammates(): void {}
    //#endregion
}
