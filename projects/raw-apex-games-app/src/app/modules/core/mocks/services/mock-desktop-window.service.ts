import { MainPage } from "@raw-apex-games-app/app/modules/desktop/pages/main-page";
import { DesktopWindowService } from "@raw-apex-games-app/app/modules/desktop/windows/desktop-window.service";
import { BehaviorSubject, of } from "rxjs";

export class MockDesktopWindowService implements MockedClass<DesktopWindowService> {
    public isRequestingExit$: DesktopWindowService["isRequestingExit$"] = new BehaviorSubject<boolean>(false);
    public mainPage: DesktopWindowService["mainPage"] = new BehaviorSubject<MainPage>(MainPage.Dashboard);
    public isStarting$: DesktopWindowService["isStarting$"] = new BehaviorSubject<boolean>(false);
    public open(page?: MainPage): ReturnType<DesktopWindowService["open"]> {
        return of();
    }
    public close(): ReturnType<DesktopWindowService["close"]> {
        return of();
    }
    public restore(page?: MainPage): ReturnType<DesktopWindowService["restore"]> {
        return of();
    }
    public focus(page?: MainPage): ReturnType<DesktopWindowService["focus"]> {
        return of();
    }
    public toggle(): ReturnType<DesktopWindowService["toggle"]> {
        return of();
    }
    public goToPage(page: MainPage): ReturnType<DesktopWindowService["goToPage"]> {}
    public setIsStarting(value: boolean): ReturnType<DesktopWindowService["setIsStarting"]> {}
    public requestExit(): void {}
    public cancelExit(): void {}
}
