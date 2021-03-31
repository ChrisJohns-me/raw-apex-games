import { MatchInflictionEvent } from "@common/match/match-infliction-event";
import { Subject } from "rxjs";

export class MockMatchPlayerInflictionService {
    public readonly myKillfeedEvent$ = new Subject<MatchInflictionEvent>();
    public readonly myDamageEvent$ = new Subject<MatchInflictionEvent>();
}
