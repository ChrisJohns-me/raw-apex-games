import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Inject, Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable, Subject, switchMap, takeUntil, tap, timer } from "rxjs";
import packageJson from "../../../../../../package.json";
import { OWConfig, OW_CONFIG } from "./overwolf/overwolf-config";
import { OverwolfExtensionsService } from "./overwolf/overwolf-extensions.service";
import { OWExtensionUpdateState } from "./overwolf/types/overwolf-types";

@Injectable({
    providedIn: "root",
    deps: [OverwolfExtensionsService, OW_CONFIG],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("VersionService", VersionService, deps),
})
export class VersionService implements OnDestroy {
    public packageVersion$ = new BehaviorSubject<string>("");
    public overwolfExtensionVersion$ = new BehaviorSubject<string>("");
    public appUpdateState$ = new BehaviorSubject<OWExtensionUpdateState>(overwolf.extensions.ExtensionUpdateState.UpToDate);

    private destroy$ = new Subject<void>();

    constructor(private readonly overwolfExtensions: OverwolfExtensionsService, @Inject(OW_CONFIG) private readonly owConfig: OWConfig) {
        this.packageVersion$.next(packageJson.version);
        this.setupOverwolfManifestVersion();
        this.setupAppUpdateState();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Force checsk to see if App has an update available
     * Also updates the property if changed.
     */
    public getAppUpdateState$(): Observable<OWExtensionUpdateState> {
        return this.overwolfExtensions.checkForExtensionUpdate().pipe(
            tap((updateState) => {
                if (updateState !== this.appUpdateState$.value) this.appUpdateState$.next(updateState);
            })
        );
    }

    private setupOverwolfManifestVersion(): void {
        this.overwolfExtensions
            .getManifest()
            .pipe(takeUntil(this.destroy$))
            .subscribe((manifest) => {
                const manifestVersion = manifest?.meta?.version;
                this.overwolfExtensionVersion$.next(manifestVersion);
            });
    }

    private setupAppUpdateState(): void {
        timer(0, this.owConfig.APP_UPDATE_CHECK_INTERVAL)
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() => this.getAppUpdateState$())
            )
            .subscribe();
    }
}
