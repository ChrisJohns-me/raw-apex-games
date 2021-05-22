import { MainPage } from "@allfather-app/app/modules/main/pages/main-page";
import { MainWindowService } from "@allfather-app/app/modules/main/windows/main-window.service";
import { BehaviorSubject, of } from "rxjs";

export class MockMainWindowService implements MockedClass<MainWindowService> {
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
}
