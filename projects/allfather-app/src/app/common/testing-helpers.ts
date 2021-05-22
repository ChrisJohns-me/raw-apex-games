/**
 * Helper function to create a nested Jasmine Spy within Overwolf's API.
 * Also injects the Spy into the globalThis scope.
 * @param {string} owObjPath base path to where the spy will be located; eg. overwolf.games.events
 * @param {string} owMethodName method name; eg. setRequiredFeatures
 * @returns {jasmine.SpyObj} Spied object that was injected into the globalThis scope.
 * @example
 *  const eventsSpy = createOverwolfSpyObj<typeof overwolf.games.events>("overwolf.games.events", ["setRequiredFeatures"]);
 *  eventsSpy.setRequiredFeatures.and.callFake(fakeFn);
 * @example expect(eventsSpy.setRequiredFeatures).toHaveBeenCalled();
 * @example expect(overwolf.games.events.setRequiredFeatures).toHaveBeenCalled();
 */
export function createOverwolfSpyObj<T>(owObjPath: string, owMethodNames: string[]): jasmine.SpyObj<T> {
    owObjPath = owObjPath.replace("overwolf.", "");
    const baseName = owObjPath.substring(owObjPath.lastIndexOf(".") + 1);
    const spyObj = jasmine.createSpyObj(baseName, owMethodNames);
    const spiedObj = createOverwolfObj(owObjPath, spyObj);
    globalThis.overwolf = spiedObj;

    return spyObj as jasmine.SpyObj<T>;
}

/**
 * Creates an object at the specified overwolf path.
 * Helpful to remove "overwolf is not defined" errors, or to insert spies.
 * This will replace the "overwolf" global variable.
 * @param {string} owObjPath base overwolf path to create; eg. overwolf.games.events.onInfoUpdates2
 * @param {any} endObj Object to place at the end of the path; defaults to an empty object.
 * @returns {overwolf} The entire overwolf global object that was injected.
 * @example createOverwolfObj("overwolf.games.events.onInfoUpdates2.addListener", () => {});
 * @example Create multiple objects
 *  createOverwolfObj("overwolf.games.events.onInfoUpdates2", {
 *      addListener: () => {},
 *      removeListener: () => {}
 *  });
 */
type OverwolfObj = typeof overwolf;
export function createOverwolfObj(owObjPath?: string, endObj?: any): OverwolfObj {
    if (!owObjPath) return (globalThis.overwolf = {} as OverwolfObj);

    owObjPath = owObjPath!.replace("overwolf.", "");
    const emptyObject = owObjPath
        .split(".")
        .reverse()
        .reduce((prev, curr) => {
            return { [curr]: prev };
        }, endObj ?? {});

    return (globalThis.overwolf = emptyObject);
}

export function supressConsoleLog(): void {
    const consoleSpy = spyOnAllFunctions(console);
    consoleSpy.debug?.and.callFake(() => {});
    consoleSpy.error?.and.callFake(() => {});
    consoleSpy.exception?.and.callFake(() => {});
    consoleSpy.info?.and.callFake(() => {});
    consoleSpy.log?.and.callFake(() => {});
    consoleSpy.trace?.and.callFake(() => {});
    consoleSpy.warn?.and.callFake(() => {});
}
