import { PlayerService } from "@core/player.service";
import { BehaviorSubject } from "rxjs";

export class MockPlayerService implements MockedClass<PlayerService> {
    public myName$: PlayerService["myName$"] = new BehaviorSubject<PlayerService["myName$"]["value"]>(undefined);

    public start(): void {
        throw new Error("Method not implemented.");
    }
}
