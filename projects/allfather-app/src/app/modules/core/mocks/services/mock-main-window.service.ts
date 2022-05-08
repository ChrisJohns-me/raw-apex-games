import { OverwolfWindow } from "@allfather-app/app/common/overwolf-window";
import { MainPage } from "@allfather-app/app/modules/main/pages/main-page";
import { MainWindowService } from "@allfather-app/app/modules/main/windows/main-window.abstract";
import { BehaviorSubject, of } from "rxjs";
import { MockOverwolfWindow } from "../components/mock-ui-window";

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
    public toggle(): ReturnType<MainWindowService["toggle"]> {
        return of();
    }
    public goToPage(page: MainPage): ReturnType<MainWindowService["goToPage"]> {}
    public setIsStarting(value: boolean): ReturnType<MainWindowService["setIsStarting"]> {}
    public requestExit(): void {}
    public cancelExit(): void {}
    public overwolfWindow = new MockOverwolfWindow() as OverwolfWindow;
}
