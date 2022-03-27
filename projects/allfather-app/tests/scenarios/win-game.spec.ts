import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MockUIContainerComponent } from "@allfather-app/app/modules/core/mocks/components/mock-ui-container.component";
import { MockMatchService } from "@allfather-app/app/modules/core/mocks/services/mock-match.service";
import { MatchTimerWindowComponent } from "@allfather-app/app/modules/HUD/match-timer/windows/match-timer-window.component";
import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TestScheduler } from "rxjs/testing";

describe("Win Game Scenario", () => {
    let sut: MatchTimerWindowComponent;
    let fixture: ComponentFixture<MatchTimerWindowComponent>;
    let scheduler: TestScheduler;
    let matchService: MatchService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MatchTimerWindowComponent, MockUIContainerComponent],
            providers: [
                { provide: ChangeDetectorRef, useValue: {} },
                { provide: MatchService, useClass: MockMatchService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });
        scheduler.maxFrames = 5000;
        fixture = TestBed.createComponent(MatchTimerWindowComponent);
        sut = fixture.componentInstance;
        matchService = TestBed.inject(MatchService);
        fixture.detectChanges(); // ngOnInit
    });
});
