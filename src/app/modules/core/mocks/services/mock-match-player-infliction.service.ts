import { MatchPlayerInflictionService } from "@core/match/match-player-infliction.service";
import { Subject } from "rxjs";

export class MockMatchPlayerInflictionService implements MockedClass<MatchPlayerInflictionService> {
    public myKillfeedEvent$: MatchPlayerInflictionService["myKillfeedEvent$"] = new Subject();
    public myDamageEvent$: MatchPlayerInflictionService["myDamageEvent$"] = new Subject();

    public start(): void {
        throw new Error("Method not implemented.");
    }
}
