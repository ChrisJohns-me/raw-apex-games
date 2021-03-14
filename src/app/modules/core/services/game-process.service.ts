import { Injectable, OnDestroy } from "@angular/core";
import { GameClassId } from "@common/game";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { OverwolfDataProviderService } from "./overwolf-data-provider";
import { OWRunningGameInfo } from "./overwolf-data-provider/overwolf-types";

@Injectable({
    providedIn: "root",
    deps: [OverwolfDataProviderService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("GameProcessService", GameProcessService, deps),
})
export class GameProcessService implements OnDestroy {
    public readonly isRunning$ = new BehaviorSubject<boolean>(false);
    public readonly isInFocus$ = new BehaviorSubject<boolean>(false);

    private readonly _unsubscribe = new Subject<void>();

    constructor(private readonly overwolf: OverwolfDataProviderService) {
        console.debug(`[${this.constructor.name}] Instantiated`);

        this.start();
    }

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    private start(): void {
        this.setupGameInfoUpdated();
    }

    private setupGameInfoUpdated(): void {
        this.overwolf.gameInfoUpdated$.pipe(takeUntil(this._unsubscribe)).subscribe((gameInfoUpdated) => {
            if (gameInfoUpdated.runningChanged && gameInfoUpdated.gameInfo) {
                this.onGameInfoIsRunningChanged(gameInfoUpdated.gameInfo);
            }
        });
    }

    private onGameInfoIsRunningChanged(runningGameInfo: OWRunningGameInfo): void {
        if (runningGameInfo.classId !== GameClassId.ApexLegends) return;
        this.isRunning$.next(runningGameInfo.isRunning);
        this.isInFocus$.next(runningGameInfo.isInFocus);
    }
}
