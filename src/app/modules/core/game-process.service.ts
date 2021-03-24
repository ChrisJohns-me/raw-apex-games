import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { SingletonServiceProviderFactory } from "src/app/singleton-service.provider.factory";
import { OverwolfDataProviderService } from "./overwolf-data-provider";
import { OWCONFIG } from "./overwolf-data-provider/overwolf/overwolf-config";

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

    private readonly _unsubscribe = new Subject<void>();

    constructor(private readonly overwolf: OverwolfDataProviderService) {}

    public ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    public start(): void {
        this.setupGameInfoUpdated();
    }

    private setupGameInfoUpdated(): void {
        this.overwolf.gameInfo$
            .pipe(
                takeUntil(this._unsubscribe),
                filter((gameInfo) => gameInfo?.classId === OWCONFIG.APEXLEGENDSCLASSID)
            )
            .subscribe((gameInfo) => {
                if (!gameInfo) return;
                if (gameInfo.isRunning !== this.isRunning$.value) this.isRunning$.next(gameInfo.isRunning);
                if (gameInfo.isInFocus !== this.isInFocus$.value) this.isInFocus$.next(gameInfo.isInFocus);
            });
    }
}
