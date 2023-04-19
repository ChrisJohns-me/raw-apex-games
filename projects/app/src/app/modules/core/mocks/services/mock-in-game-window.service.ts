import { of } from "rxjs";
import { InGameWindowService } from "../../../in-game/windows/in-game-window.service";

export class MockInGameWindowService implements MockedClass<InGameWindowService> {
    public isOpen(): ReturnType<InGameWindowService["isOpen"]> {
        return of();
    }
    public open(): ReturnType<InGameWindowService["open"]> {
        return of();
    }
    public close(): ReturnType<InGameWindowService["close"]> {
        return of();
    }
}
