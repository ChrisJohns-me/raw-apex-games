import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, bindCallback, defer, Observable, of, throwError } from "rxjs";
import { catchError, delay, map, mergeMap, retryWhen, takeUntil, tap } from "rxjs/operators";
import { BaseService } from "../base-service.abstract";
import { OWConfig, OW_CONFIG } from "./overwolf-config";

export enum OWFeatureRegistrationStatus {
    NOT_REGISTERED = "not_registered",
    IN_PROGRESS = "in_progress",
    SUCCESS = "success",
    FAIL = "fail",
}

/**
 * @classdesc Overwolf registration hook; required before listening to events.
 * @see https://overwolf.github.io/docs/topics/using-events#how-to-register-to-features
 */
@Injectable({
    providedIn: "root",
})
export class OverwolfFeatureRegistrationService extends BaseService {
    public readonly registrationStatus$ = new BehaviorSubject<OWFeatureRegistrationStatus>(OWFeatureRegistrationStatus.NOT_REGISTERED);

    constructor(@Inject(OW_CONFIG) private readonly owConfig: OWConfig) {
        super();
    }

    public setRegisteredFeatures(features: string[] = this.owConfig.REQUIRED_FEATURES): Observable<OWFeatureRegistrationStatus> {
        if (this.registrationStatus$.value === OWFeatureRegistrationStatus.SUCCESS) return of(OWFeatureRegistrationStatus.SUCCESS);
        if (this.registrationStatus$.value === OWFeatureRegistrationStatus.IN_PROGRESS) return of(OWFeatureRegistrationStatus.IN_PROGRESS);
        this.registrationStatus$.next(OWFeatureRegistrationStatus.IN_PROGRESS);
        console.debug(`[${this.constructor.name}] Registering Overwolf features:`, features);

        return defer(() => this.createRequest$(features)).pipe(
            retryWhen((errors) => this.retry$(errors)),
            map((features) => !!features?.length),
            map(
                (success): OWFeatureRegistrationStatus => (success ? OWFeatureRegistrationStatus.SUCCESS : OWFeatureRegistrationStatus.FAIL)
            ),
            tap((status) => this.registrationStatus$.next(status)),
            catchError((error) => {
                console.error(
                    `[${this.constructor.name}] Could not set Overwolf features: ${JSON.stringify(features)}, ` +
                        `error: ${error?.message ?? JSON.stringify(error)}`
                );
                return of(OWFeatureRegistrationStatus.FAIL);
            })
        );
    }

    public unregisterFeatures(): Observable<void> {
        return this.setRegisteredFeatures([]).pipe(
            takeUntil(this.destroy$),
            tap(() => this.registrationStatus$.next(OWFeatureRegistrationStatus.NOT_REGISTERED)),
            map(() => undefined)
        );
    }

    private createRequest$(features: string[]): Observable<string[]> {
        const getSetRequiredFeaturesObs = bindCallback(overwolf.games.events.setRequiredFeatures);
        return getSetRequiredFeaturesObs(features).pipe(
            map((result) => {
                if (result.success) return result.supportedFeatures ?? [];
                else return result.error || (result as any).reason;
            })
        );
    }

    private retry$(errors: Observable<any>): Observable<any> {
        return errors.pipe(
            mergeMap((error, i) => {
                const retryAttempt = i + 1;
                if (retryAttempt >= this.owConfig.REQUIRED_FEATURES_RETRY_COUNT) {
                    return throwError(() => error);
                }
                console.warn(
                    `[${this.constructor.name}] Registration for Overwolf features failed. Retrying...(#${retryAttempt})\n` +
                        `Error: ${error?.message ?? JSON.stringify(error)}`
                );
                const delayMs = retryAttempt * this.owConfig.REQUIRED_FEATURES_RETRY_DELAY_MULTIPLIER;
                return of(error).pipe(delay(delayMs));
            })
        );
    }
}
