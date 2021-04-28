import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export abstract class AllfatherService implements OnDestroy {
    protected readonly isDestroyed$ = new Subject<void>();

    public ngOnDestroy(): void {
        this.isDestroyed$.next();
        this.isDestroyed$.complete();
    }

    public abstract init(): void;
}
