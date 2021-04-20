import { MockOverwolfGameDataService } from "@allfather-app/app/modules/core/mocks/services/mock-overwolf-game-data.service";
import { OverwolfGameDataService } from "@allfather-app/app/modules/core/overwolf";
import { TestBed } from "@angular/core/testing";
import { TestScheduler } from "rxjs/testing";
import { MatchService } from "./match.service";

describe("MatchService", () => {
    let sut: MatchService;
    let scheduler: TestScheduler;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [MatchService, { provide: OverwolfGameDataService, useClass: MockOverwolfGameDataService }],
        });
    });

    beforeEach(() => {
        sut = TestBed.inject(MatchService);
    });
});
