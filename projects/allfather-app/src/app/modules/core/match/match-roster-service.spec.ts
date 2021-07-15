import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { MockConfigurationService } from "@allfather-app/app/modules/core/mocks/mock-configuration.service";
import { TestBed } from "@angular/core/testing";
import { MockOverwolfGameDataService } from "@shared-app/mocks/services/mock-overwolf-game-data.service";
import { MockPlayerService } from "@shared-app/mocks/services/mock-player.service";
import { OverwolfGameDataService } from "@shared-app/services/overwolf";
import { TestScheduler } from "rxjs/testing";
import { ConfigurationService } from "../configuration.service";
import { MockMatchLegendSelectService } from "../mocks/mock-match-legend-select.service";
import { MockMatchService } from "../mocks/mock-match.service";
import { PlayerService } from "../player.service";
import { MatchLegendSelectService } from "./match-legend-select.service";
import { MatchRosterService } from "./match-roster.service";

describe("MatchRosterService", () => {
    let sut: MatchRosterService;
    let scheduler: TestScheduler;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                { provide: ConfigurationService, useClass: MockConfigurationService },
                { provide: MatchService, useClass: MockMatchService },
                { provide: MatchLegendSelectService, useClass: MockMatchLegendSelectService },
                { provide: OverwolfGameDataService, useClass: MockOverwolfGameDataService },
                { provide: PlayerService, useClass: MockPlayerService },
            ],
        });
    });

    beforeEach(() => {
        sut = TestBed.inject(MatchRosterService);
    });
});
