import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Title } from "@angular/platform-browser";
import { MockBackgroundService } from "../core/mocks/services/mock-background.service";
import { MockMainWindowService } from "../core/mocks/services/mock-main-window.service";
import { MainWindowService } from "../main/windows/main-window.service";
import { BackgroundComponent } from "./background.component";
import { BackgroundService } from "./background.service";
import { HUDWindowControllerService } from "./hud-window-controller.service";
import { SystemTrayService } from "./system-tray.service";

class MockHUDWindowControllerService {
    public startWatchEvents(): void {}
}
class MockSystemTrayService {
    public initTray(): void {}
}
class MockTitle {
    public setTitle(): void {}
}

describe("BackgroundComponent", () => {
    let component: BackgroundComponent;
    let fixture: ComponentFixture<BackgroundComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BackgroundComponent],
            providers: [
                { provide: HUDWindowControllerService, useClass: MockHUDWindowControllerService },
                { provide: MainWindowService, useClass: MockMainWindowService },
                { provide: SystemTrayService, useClass: MockSystemTrayService },
                { provide: Title, useClass: MockTitle },
                { provide: BackgroundService, useClass: MockBackgroundService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BackgroundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should hold an instance of the backgroundService", () => {
        expect(component.backgroundService).toBeDefined();
    });
});
