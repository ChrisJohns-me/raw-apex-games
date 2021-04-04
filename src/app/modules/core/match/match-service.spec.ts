import { TestBed } from "@angular/core/testing";
import { MockOverwolfDataProviderService } from "@core/mocks/services/mock-overwolf-data-provider.service";
import { OverwolfDataProviderService } from "@core/overwolf-data-provider";
import { TestScheduler } from "rxjs/testing";
import { MatchService } from "./match.service";

describe("MatchService", () => {
    let sut: MatchService;
    let scheduler: TestScheduler;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [MatchService, { provide: OverwolfDataProviderService, useClass: MockOverwolfDataProviderService }],
        });
    });

    beforeEach(() => {
        sut = TestBed.inject(MatchService);
    });
});
