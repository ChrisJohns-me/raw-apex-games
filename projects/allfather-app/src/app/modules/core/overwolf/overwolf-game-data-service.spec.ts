import { TestBed } from "@angular/core/testing";
import { TestScheduler } from "rxjs/testing";
import { OverwolfGameDataService } from "./overwolf-game-data.service";

describe("OverwolfGameDataService", () => {
    let sut: OverwolfGameDataService;
    let scheduler: TestScheduler;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                // { provide: OW_API, useValue: MockOverwolfApi },
            ],
        });
    });

    beforeEach(() => {
        sut = TestBed.inject(OverwolfGameDataService);
    });
});
