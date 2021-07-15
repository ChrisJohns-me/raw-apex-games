import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MockMatchService } from "@allfather-app/app/modules/core/mocks/mock-match.service";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockGameProcessService } from "@shared-app/mocks/services/mock-game-process.service";
import { MockPlayerStatsService } from "@shared-app/mocks/services/mock-player-stats.service";
import { MockPlayerService } from "@shared-app/mocks/services/mock-player.service";
import { GameProcessService } from "@shared-app/services/game-process.service";
import { PlayerAccountStatsService } from "@shared-app/services/player-account-stats/player-account-stats.service";
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
                { provide: PlayerAccountStatsService, useClass: MockPlayerStatsService },
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
