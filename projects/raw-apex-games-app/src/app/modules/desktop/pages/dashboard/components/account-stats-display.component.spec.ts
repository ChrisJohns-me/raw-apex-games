import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GameProcessService } from "@raw-apex-games-app/app/modules/core/game-process.service";
import { MatchService } from "@raw-apex-games-app/app/modules/core/match/match.service";
import { MockGameProcessService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-game-process.service";
import { MockMatchService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-match.service";
import { MockMyPlayerAccountStatsService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-my-player-account-stats.service";
import { MockPlayerStatsService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-player-stats.service";
import { MockPlayerService } from "@raw-apex-games-app/app/modules/core/mocks/services/mock-player.service";
import { MyPlayerAccountStatsService } from "@raw-apex-games-app/app/modules/core/player-account-stats/my-player-account-stats.service";
import { PlayerAccountStatsService } from "@raw-apex-games-app/app/modules/core/player-account-stats/player-account-stats.service";
import { PlayerService } from "@raw-apex-games-app/app/modules/core/player.service";
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
                { provide: MyPlayerAccountStatsService, useClass: MockMyPlayerAccountStatsService },
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
