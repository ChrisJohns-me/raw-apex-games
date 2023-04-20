declare const performance: Performance;

export class Stopwatch {
    private performanceAPI = false;
    private startTime: Optional<number>;
    private stopTime: Optional<number>;

    public constructor() {
        if (typeof performance === "object" && typeof performance.now === "function") {
            this.performanceAPI = true;
        }
    }

    public start(): number {
        this.startTime = this.now();
        return this.startTime;
    }

    public stop(): number {
        this.stopTime = this.now();
        return this.stopTime;
    }

    public result(roundToMs = true): number {
        if (!this.startTime) {
            throw new Error(`${this.constructor.name}: start() was never called.`);
        }

        const stopTime = this.stopTime ?? this.now();
        let result = stopTime - this.startTime;

        if (roundToMs && this.performanceAPI) {
            result = Math.round(result);
        }

        return result;
    }

    public clear(): void {
        this.startTime = undefined;
        this.stopTime = undefined;
    }

    /**
     * @param {number} minimumMs - Amount of time to at least trigger the output
     * @param {string} [output] - Logged to the console
     * @param {(result: number) => string} [output] - Callback function to run upon trigger.
     *          The callback function can also provide a string to be logged to the console.
     * @param {undefined} [output] - If undefined, a default message is logged to the console.
     */
    public watchdog(minimumMs: number, output?: string | ((result: number) => Optional<string>)): void {
        const resultMs = this.result();
        let bark: Optional<string>;
        if (resultMs < minimumMs) {
            return;
        }

        if (typeof output === "string") {
            bark = output;
        } else if (typeof output === "function") {
            bark = output(resultMs);
        } else {
            bark = `[${this.constructor.name}.watchdog(${minimumMs}ms)]: Recorded ${resultMs}ms`;
        }

        if (bark) {
            console.log(bark);
        }
    }

    private now(): number {
        return this.performanceAPI ? performance.now() : Date.now();
    }
}
