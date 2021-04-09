declare const performance: Performance;

export class Stopwatch {
    private performanceAPI = false;
    private startTime: Optional<number>;
    private endTime: Optional<number>;

    public constructor() {
        if (typeof performance === "object" && typeof performance.now === "function") {
            this.performanceAPI = true;
        }
    }

    public start(): number {
        this.startTime = this.performanceAPI ? performance.now() : Date.now();
        return this.startTime;
    }

    public end(): number {
        this.endTime = this.performanceAPI ? performance.now() : Date.now();
        return this.endTime;
    }

    public result(roundToMs = true): number {
        if (!this.startTime) {
            throw new Error(`${this.constructor.name}: start() was never called.`);
        } else if (this.startTime && !this.endTime) {
            this.end();
        }

        let result = this.endTime! - this.startTime;

        if (roundToMs && this.performanceAPI) {
            result = Math.round(result);
        }

        return result;
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
}
