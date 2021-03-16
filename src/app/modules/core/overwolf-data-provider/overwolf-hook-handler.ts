export class OverwolfEventHookHandler<T = any> {
    public get isActive(): boolean {
        return this._isActive;
    }

    private _isActive = false;

    constructor(
        private hookEntryFn: (entryCallbackFn: (event: T) => void) => void,
        private hookExitFn: Optional<(exitCallbackFn: (event: T) => void) => void>,
        private targetFn: (callbackFn: T) => void
    ) {
        if (typeof this.hookEntryFn !== "function") console.error(`Provided hook entry is not a function.`);
        if (typeof this.targetFn !== "function") console.error(`Provided hook target is not a function.`);
    }

    public activate(): void {
        this.deactivate();
        this.hookEntryFn(this.targetFn);
        this._isActive = true;
    }

    public reactivate(): void {
        this.activate();
    }

    public deactivate(): void {
        if (typeof this.hookExitFn === "function") this.hookExitFn(this.targetFn);
        this._isActive = false;
    }
}
