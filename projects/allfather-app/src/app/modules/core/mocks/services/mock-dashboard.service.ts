import { DashboardService } from "@allfather-app/app/modules/dashboard/dashboard.service";
import { of } from "rxjs";
import { Stopwatch } from "shared/utilities";

export class MockDashboardService implements MockedClass<DashboardService> {
    public stopWatch = new Stopwatch(); // TODO: remove

    public init(): void {
        throw new Error("Method not implemented.");
    }

    public getMatchByMatchId(matchId: string): ReturnType<DashboardService["getMatchByMatchId"]> {
        return of();
    }

    public getAllMatches(): ReturnType<DashboardService["getAllMatches"]> {
        return of();
    }
}
