import { PlayerService } from "@allfather-app/app/modules/core/player.service";
import { BehaviorSubject } from "rxjs";
import { ExtractSubjectType } from "shared/types/rxjs-utilities";

export class MockPlayerService implements MockedClass<PlayerService> {
    public myName$: PlayerService["myName$"] = new BehaviorSubject<ExtractSubjectType<PlayerService["myName$"]>>(undefined);

    public init(): void {
        throw new Error("Method not implemented.");
    }
}
