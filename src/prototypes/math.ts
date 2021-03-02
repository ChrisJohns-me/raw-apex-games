interface Math {
    /**
     * Restricts the number to be within the inclusive lower and upper bounds.
     */
    clamp: (inputNumber: number, min: number, max: number) => number;
}

Object.assign(Math, {
    clamp: (inputNumber: number, min: number, max: number): number => Math.min(Math.max(inputNumber, min), max),
});
