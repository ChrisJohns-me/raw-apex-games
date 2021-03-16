import { Provider } from "@angular/core";
import { UIWindow } from "./modules/core/_refactor/ui-window";

export const REFERENCES_KEY = "$singletonReferences";
type Singleton = Provider;
declare interface Window {
    [REFERENCES_KEY]: { [key: string]: Singleton };
}

/**
 * Makes an Angular Service a singleton across Overwolf windows.
 * Will need to manually inject dependencies.
 * @param referenceKey Key to add to the Overwolf window references array.
 * @param service Angular Service.
 */
export const SingletonServiceProviderFactory = (
    referenceKey: string,
    service: Provider,
    deps: any[] = []
): Singleton => {
    const logPrefix = `[Singleton] "${referenceKey}"`;
    const owWindow = (UIWindow.getMainWindow() as unknown) as Window;

    if (!owWindow[REFERENCES_KEY]) owWindow[REFERENCES_KEY] = {};
    if (!owWindow[REFERENCES_KEY][referenceKey]) {
        if (typeof service === "function") {
            owWindow[REFERENCES_KEY][referenceKey] = new service(...deps);
            addInstanceListing(referenceKey);
            console.debug(`${logPrefix} Adding as a singleton service`);
        } else {
            console.error(`${logPrefix} Not an Angular service`);
        }
    } else {
        console.debug(`${logPrefix} Using existing singleton service`);
    }

    const singletonService = owWindow[REFERENCES_KEY][referenceKey];
    return singletonService;
};

// =====
// TODO: Delete; Used for debugging.
const listingReferenceKey = "$__singletonInstantiations";
declare interface Window {
    [listingReferenceKey]: Array<{ referenceName: string; createdDate: Date }>;
}
/**
 * Adds the singleton class (whether newly instantiated, or referenced).
 * Probably temporary.
 * @param reference Class reference.
 */
function addInstanceListing(name: string): void {
    const owWindow = (UIWindow.getMainWindow() as unknown) as Window;
    if (!owWindow[listingReferenceKey] || !Array.isArray(owWindow[listingReferenceKey]))
        owWindow[listingReferenceKey] = [];
    owWindow[listingReferenceKey].push({ referenceName: name, createdDate: new Date() });
}
