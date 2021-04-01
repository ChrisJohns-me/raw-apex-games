import { MatchInflictionEvent } from "@shared/models/match/match-infliction-event";
import { Subject } from "rxjs";

export class MockMatchPlayerInflictionService {
    public myKillfeedEvent$ = new Subject<MatchInflictionEvent>();
    public myDamageEvent$ = new Subject<MatchInflictionEvent>();
}
