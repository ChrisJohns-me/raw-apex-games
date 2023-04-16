import { supressConsoleLog } from "@app/app/common/testing-helpers";
import { RunCondition } from "./run-condition";

describe("RunCondition Class", () => {
    beforeAll(() => {
        supressConsoleLog();
    });

    it("evaluates that conditions are met", () => {
        // Arrange
        const trueRunCondition = new RunCondition({ id: "true", condition: () => true });
        const falseRunCondition = new RunCondition({ id: "false", condition: () => false });

        // Act
        const trueRunConditionResult = trueRunCondition.conditionMet();
        const falseRunConditionResult = falseRunCondition.conditionMet();

        // Assert
        expect(trueRunConditionResult).toBe(true);
        expect(falseRunConditionResult).toBe(false);
    });

    it("evaluates that conditions are met and evaluates when conditionMet() is called", () => {
        // Arrange
        let value = false;
        const runCondition = new RunCondition({ id: "true", condition: () => !!value });

        // Act
        value = true;
        const result = runCondition.conditionMet();

        // Assert
        expect(result).toBe(true);
    });
});
