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
    const spiedObject = owObjPath
        .split(".")
        .reverse()
        .reduce((prev, curr) => {
            return { [curr]: prev };
        }, spyObj as any);
    globalThis.overwolf = spiedObject;

    return spyObj as jasmine.SpyObj<T>;
}
