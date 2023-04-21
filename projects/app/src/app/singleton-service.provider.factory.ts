/*
 * Overwolf's windows spawn new instances of Angular services.
 * Singletons are used to re-use already instantiated services,
 * which are created from within the Background service.
 * Singleton services should be typically be registered with
 * the Background service. Non-registered services may cause memory leaks.
 */
import { environment } from "#app/../environments/environment.js";
import { Provider } from "@angular/core";
import { take } from "rxjs/operators";
import { OverwolfWindow, OverwolfWindowName } from "./models/overwolf-window.js";

export const INSTANTIATIONS_KEY = "$__singletonInstantiations";
type Singleton = Provider;
declare interface Window {
    [INSTANTIATIONS_KEY]: { [key: string]: Singleton };
}

/**
 * Makes an Angular Service a singleton across Overwolf windows.
 * Will need to manually inject dependencies.
 * Requires that the service be registered.
 * @param referenceKey Key to add to the Overwolf window references array.
 * @param service Angular Service.
 */
export function SingletonServiceProviderFactory(referenceKey: string, service: Provider, deps: any[] = []): Singleton {
    const logPrefix = `[SingletonServiceProvider] "${referenceKey}"`;
    const owWindow = OverwolfWindow.getMainWindow() as unknown as Window;
    validateNumDependencies(service, deps, referenceKey);

    if (!owWindow[INSTANTIATIONS_KEY]) owWindow[INSTANTIATIONS_KEY] = {};
    if (!isServiceInstantiated(referenceKey)) {
        if (typeof service !== "function") throw new Error(`${logPrefix} Not an Angular service`);

        // console.debug(`${logPrefix} Instantiating as a singleton service`);
        owWindow[INSTANTIATIONS_KEY][referenceKey] = new service(...deps);
        validateIsBackgroundWindow(referenceKey);
    } else {
        // console.debug(`${logPrefix} Using existing singleton service`);
    }

    return owWindow[INSTANTIATIONS_KEY][referenceKey];
}

function isServiceInstantiated(referenceKey: string): boolean {
    const owWindow = OverwolfWindow.getMainWindow() as unknown as Window;
    const serviceRef = owWindow?.[INSTANTIATIONS_KEY]?.[referenceKey];
    const isInstantiated = !!serviceRef && typeof serviceRef === "object";
    return isInstantiated;
}

function validateIsBackgroundWindow(referenceKey: string): void {
    const isMockEnvironment = !!(overwolf as any).__mockInstallationCheck;

    if (isMockEnvironment) {
        console.error(`This is a unit test; bailing`);
        return;
    }
    OverwolfWindow.getCurrentWindow()
        .pipe(take(1))
        .subscribe((currentWindow) => {
            if (currentWindow.name !== OverwolfWindowName.Background) {
                const errMsg = `[SingletonServiceProvider] "${referenceKey}" Singleton Service is not instantiated on the Background Window; is instantiated on "${currentWindow.name}"`;
                if (environment.DEV) throw new Error(errMsg);
                console.error(errMsg);
            }
        });
}

function validateNumDependencies(service: Provider, deps: any[], referenceKey?: string): void {
    const numDepsExpected = (service as new (...args: unknown[]) => unknown).length;
    const numDeps = deps.length;

    if (numDeps !== numDepsExpected) {
        const serviceStr = service.toString();
        const serviceName = serviceStr.substring(serviceStr.indexOf("class") + "class".length, serviceStr.indexOf("{")).trim();
        const errMsg =
            `["${referenceKey || "[empty referenceKey]"}": ${serviceName}] ` +
            `Dependency Injection failed; expected ${numDepsExpected} dependencies to be provided, ` +
            `got ${numDeps}`;

        throw new Error(errMsg);
    }
}
