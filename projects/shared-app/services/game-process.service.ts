import { Injectable } from "@angular/core";
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { BehaviorSubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { BaseService } from "./base-service.abstract";
import { OverwolfGameDataService } from "./overwolf";

/**
 * @classdesc Provides general information about the game process
 */
@Injectable({
    providedIn: "root",
    deps: [OverwolfGameDataService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("GameProcessService", GameProcessService, deps),
})
export class GameProcessService extends BaseService {
    public readonly isRunning$ = new BehaviorSubject<boolean>(false);
    public readonly isInFocus$ = new BehaviorSubject<boolean>(false);

    constructor(private readonly overwolfGameData: OverwolfGameDataService) {
        super();
        this.overwolfGameData.gameInfo$.pipe(takeUntil(this.destroy$)).subscribe((gameInfo) => {
            if (!gameInfo) return;
            if (gameInfo.isRunning !== this.isRunning$.value) this.isRunning$.next(gameInfo.isRunning);
            if (gameInfo.isInFocus !== this.isInFocus$.value) this.isInFocus$.next(gameInfo.isInFocus);
        });
    }
}
