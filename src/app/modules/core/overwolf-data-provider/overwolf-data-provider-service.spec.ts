import { TestBed } from "@angular/core/testing";
// import { MockOverwolfApi } from "@core/mocks/mock-overwolf-api";
import { TestScheduler } from "rxjs/testing";
import { OverwolfDataProviderService } from "./overwolf-data-provider.service";

describe("OverwolfDataProviderService", () => {
    let sut: OverwolfDataProviderService;
    let scheduler: TestScheduler;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                // { provide: OW_API, useValue: MockOverwolfApi },
            ],
        });
    });

    beforeEach(() => {
        sut = TestBed.inject(OverwolfDataProviderService);
    });
});
