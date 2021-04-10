import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MockMatchService } from "@allfather-app/app/modules/core/mocks/services/mock-match.service";
import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { GameEventsLogComponent } from "./game-events-log.component";

describe("GameEventsLogComponent", () => {
    let component: GameEventsLogComponent;
    let fixture: ComponentFixture<GameEventsLogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameEventsLogComponent],
            providers: [
                { provide: ChangeDetectorRef, useValue: {} },
                { provide: MatchService, useClass: MockMatchService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameEventsLogComponent);
        component = fixture.componentInstance;
        component.infoUpdates$ = of();
        component.newGameEvent$ = of();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
