import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BackgroundService } from "../../background/background.service";
import { ConfigurationService } from "../../core/configuration.service";
import { MockUIContainerComponent } from "../../core/mocks/components/mock-ui-container.component";
import { MockBackgroundService } from "../../core/mocks/services/mock-background.service";
import { MockConfigurationService } from "../../core/mocks/services/mock-configuration.service";
import { MockMainWindowService } from "../../core/mocks/services/mock-main-window.service";
import { MainWindowComponent } from "./main-window.component";
import { MainWindowService } from "./main-window.service";

describe("MainWindowComponent", () => {
    let component: MainWindowComponent;
    let fixture: ComponentFixture<MainWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MainWindowComponent, MockUIContainerComponent],
            providers: [
                { provide: BackgroundService, useClass: MockBackgroundService },
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: MainWindowService, useClass: MockMainWindowService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MainWindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
