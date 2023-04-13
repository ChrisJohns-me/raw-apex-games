import { InGameWindowService } from "@raw-apex-games-app/app/modules/in-game/windows/in-game-window.service";
import { of } from "rxjs";

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
