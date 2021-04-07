import { GameProcessService } from "@core/game-process.service";
import { BehaviorSubject } from "rxjs";

export class MockGameProcessService implements MockedClass<GameProcessService> {
    public isRunning$: GameProcessService["isRunning$"] = new BehaviorSubject<GameProcessService["isRunning$"]["value"]>(false);
    public isInFocus$: GameProcessService["isInFocus$"] = new BehaviorSubject<GameProcessService["isInFocus$"]["value"]>(false);

    public start(): void {
        throw new Error("Method not implemented.");
    }
}
