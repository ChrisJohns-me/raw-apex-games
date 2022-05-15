import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfigurationService } from "../../core/configuration.service";
import { MockUIContainerComponent } from "../../core/mocks/components/mock-ui-container.component";
import { MockConfigurationService } from "../../core/mocks/services/mock-configuration.service";
import { MatchSummaryWindowComponent } from "./match-summary-window.component";

describe("MatchSummaryWindowComponent", () => {
    let sut: MatchSummaryWindowComponent;
    let fixture: ComponentFixture<MatchSummaryWindowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MatchSummaryWindowComponent, MockUIContainerComponent],
            providers: [{ provide: ConfigurationService, useClass: MockConfigurationService }],
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(MatchSummaryWindowComponent);
        sut = fixture.componentInstance;
        fixture.detectChanges(); // ngOnInit
    });

    afterEach(() => {
        fixture.destroy();
    });

    it("should be created", () => {
        expect(sut).toBeDefined();
    });
});
