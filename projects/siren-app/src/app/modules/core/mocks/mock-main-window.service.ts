import { MockUIWindow } from "@shared-app/mocks/components/mock-ui-window";
import { UIWindow } from "@shared-app/_refactor/ui-window";
import { BehaviorSubject, of } from "rxjs";
import { MainPage } from "../../main/pages/main-page";
import { MainWindowService } from "../../main/windows/main-window.service";

export class MockMainWindowService implements MockedClass<MainWindowService> {
    public isRequestingExit$: MainWindowService["isRequestingExit$"] = new BehaviorSubject<boolean>(false);
    public mainPage: MainWindowService["mainPage"] = new BehaviorSubject<MainPage>(MainPage.Dashboard);
    public isStarting$: MainWindowService["isStarting$"] = new BehaviorSubject<boolean>(false);
    public open(page?: MainPage): ReturnType<MainWindowService["open"]> {
        return of();
    }
    public close(): ReturnType<MainWindowService["close"]> {
        return of();
    }
    public restore(page?: MainPage): ReturnType<MainWindowService["restore"]> {
        return of();
    }
    public focus(page?: MainPage): ReturnType<MainWindowService["focus"]> {
        return of();
    }
    public goToPage(page: MainPage): ReturnType<MainWindowService["goToPage"]> {}
    public setIsStarting(value: boolean): ReturnType<MainWindowService["setIsStarting"]> {}
    public requestExit(): void {}
    public cancelExit(): void {}
    public uiWindow = new MockUIWindow() as UIWindow;
}
