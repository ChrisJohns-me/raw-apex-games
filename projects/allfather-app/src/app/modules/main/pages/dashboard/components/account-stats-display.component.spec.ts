import { GameProcessService } from "@allfather-app/app/modules/core/game-process.service";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MockGameProcessService } from "@allfather-app/app/modules/core/mocks/services/mock-game-process.service";
import { MockMatchService } from "@allfather-app/app/modules/core/mocks/services/mock-match.service";
import { MockPlayerStatsService } from "@allfather-app/app/modules/core/mocks/services/mock-player-stats.service";
import { MockPlayerService } from "@allfather-app/app/modules/core/mocks/services/mock-player.service";
import { PlayerAccountStatsService } from "@allfather-app/app/modules/core/player-account-stats/player-account-stats.service";
import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
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
