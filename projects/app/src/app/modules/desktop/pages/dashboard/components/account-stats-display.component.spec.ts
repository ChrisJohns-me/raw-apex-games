import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GameProcessService } from "../../../../core/game-process.service";
import { MatchService } from "../../../../core/match/match.service";
import { MockGameProcessService } from "../../../../core/mocks/services/mock-game-process.service";
import { MockMatchService } from "../../../../core/mocks/services/mock-match.service";
import { MockPlayerService } from "../../../../core/mocks/services/mock-player.service";
import { PlayerService } from "../../../../core/player.service";
import { AccountStatsDisplayComponent } from "./account-stats-display.component";

describe("AccountStatsDisplayComponent", () => {
    let sut: AccountStatsDisplayComponent;
    let fixture: ComponentFixture<AccountStatsDisplayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AccountStatsDisplayComponent],
            providers: [
                { provide: ChangeDetectorRef, useClass: ChangeDetectorRef },
                { provide: GameProcessService, useClass: MockGameProcessService },
                { provide: MatchService, useClass: MockMatchService },
                { provide: PlayerService, useClass: MockPlayerService },
            ],
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(AccountStatsDisplayComponent);
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
