import { Injectable, OnDestroy } from "@angular/core";
import { SingletonServiceProviderFactory } from "@raw-apex-games-app/app/singleton-service.provider.factory";
import { BehaviorSubject, Subject, takeUntil } from "rxjs";
import packageJson from "../../../../../../package.json";
import { OverwolfExtensionsService } from "./overwolf/overwolf-extensions.service";

@Injectable({
    providedIn: "root",
    deps: [OverwolfExtensionsService],
    useFactory: (...deps: unknown[]) => SingletonServiceProviderFactory("VersionService", VersionService, deps),
})
export class VersionService implements OnDestroy {
    public packageVersion$ = new BehaviorSubject<string>("");
    public overwolfExtensionVersion$ = new BehaviorSubject<string>("");

    private destroy$ = new Subject<void>();

    constructor(private readonly overwolfExtensions: OverwolfExtensionsService) {
        this.packageVersion$.next(packageJson.version);
        this.overwolfExtensions
            .getManifest()
            .pipe(takeUntil(this.destroy$))
            .subscribe((manifest) => {
                const manifestVersion = manifest?.meta?.version;
                this.overwolfExtensionVersion$.next(manifestVersion);
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
