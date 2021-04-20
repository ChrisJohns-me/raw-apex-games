import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { OverwolfGameDataService } from "./overwolf";

/**
 * @classdesc Provides general information about the game process
 */
@Injectable({
    providedIn: "root",
    deps: [OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("GameProcessService", GameProcessService, deps),
})
export class GameProcessService implements OnDestroy {
    public readonly isRunning$ = new BehaviorSubject<boolean>(false);
    public readonly isInFocus$ = new BehaviorSubject<boolean>(false);

    private readonly _unsubscribe$ = new Subject<void>();

    constructor(private readonly overwolfGameData: OverwolfGameDataService) {}

    public ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    public init(): void {
        this.setupGameInfoUpdated();
    }

    private setupGameInfoUpdated(): void {
        this.overwolfGameData.gameInfo$.pipe(takeUntil(this._unsubscribe$)).subscribe((gameInfo) => {
            if (!gameInfo) return;
            if (gameInfo.isRunning !== this.isRunning$.value) this.isRunning$.next(gameInfo.isRunning);
            if (gameInfo.isInFocus !== this.isInFocus$.value) this.isInFocus$.next(gameInfo.isInFocus);
        });
    }
}
