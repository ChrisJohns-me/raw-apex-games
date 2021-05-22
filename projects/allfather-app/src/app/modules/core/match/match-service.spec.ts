import { MockOverwolfGameDataService } from "@allfather-app/app/modules/core/mocks/services/mock-overwolf-game-data.service";
import { OverwolfGameDataService } from "@allfather-app/app/modules/core/overwolf";
import { TestBed } from "@angular/core/testing";
import { TestScheduler } from "rxjs/testing";
import { LocalDatabaseService } from "../local-database/local-database.service";
import { MockLocalDatabaseService } from "../mocks/services/mock-local-database.service";
import { MatchService } from "./match.service";

describe("MatchService", () => {
    let sut: MatchService;
    let scheduler: TestScheduler;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                { provide: OverwolfGameDataService, useClass: MockOverwolfGameDataService },
                { provide: LocalDatabaseService, useClass: MockLocalDatabaseService },
            ],
        });
    });

    beforeEach(() => {
        sut = TestBed.inject(MatchService);
    });
});
