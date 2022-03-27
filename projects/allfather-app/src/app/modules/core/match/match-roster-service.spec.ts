import { OverwolfGameDataService } from "@allfather-app/app/common/services/overwolf";
import { MatchService } from "@allfather-app/app/modules/core/match/match.service";
import { TestBed } from "@angular/core/testing";
import { TestScheduler } from "rxjs/testing";
import { ConfigurationService } from "../configuration.service";
import { MockConfigurationService } from "../mocks/services/mock-configuration.service";
import { MockMatchLegendSelectService } from "../mocks/services/mock-match-legend-select.service";
import { MockMatchService } from "../mocks/services/mock-match.service";
import { MockOverwolfGameDataService } from "../mocks/services/mock-overwolf-game-data.service";
import { MockPlayerService } from "../mocks/services/mock-player.service";
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
