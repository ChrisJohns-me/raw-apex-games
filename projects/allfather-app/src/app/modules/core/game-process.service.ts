import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { OverwolfDataProviderService } from "./overwolf-data-provider";

/**
 * @classdesc Provides general information about the game process
 */
@Injectable({
    providedIn: "root",
    deps: [OverwolfDataProviderService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("GameProcessService", GameProcessService, deps),
})
export class GameProcessService implements OnDestroy {
    public readonly isRunning$ = new BehaviorSubject<boolean>(false);
    public readonly isInFocus$ = new BehaviorSubject<boolean>(false);

    private readonly _unsubscribe$ = new Subject<void>();

    constructor(private readonly overwolfData: OverwolfDataProviderService) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public start(): void {
        this.setupGameInfoUpdated();
    }

    private setupGameInfoUpdated(): void {
        this.overwolfData.gameInfo$.pipe(takeUntil(this._unsubscribe$)).subscribe((gameInfo) => {
            if (!gameInfo) return;
            if (gameInfo.isRunning !== this.isRunning$.value) this.isRunning$.next(gameInfo.isRunning);
            if (gameInfo.isInFocus !== this.isInFocus$.value) this.isInFocus$.next(gameInfo.isInFocus);
        });
    }
}
