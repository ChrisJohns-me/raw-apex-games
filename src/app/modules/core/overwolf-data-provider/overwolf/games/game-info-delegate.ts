import { OWRunningGameInfo } from "@core/overwolf-data-provider/overwolf-types";
import { BehaviorSubject } from "rxjs";
import { OWCONFIG } from "../overwolf-config";

export class GameInfoDelegate {
    public readonly gameInfo$ = new BehaviorSubject<Optional<OWRunningGameInfo>>(undefined);

    /**
     * Game process information updates
     * @param gameInfoUpdate
     */
    public onGameInfo(gameInfo?: OWRunningGameInfo): void {
        if (!gameInfo || gameInfo.classId !== OWCONFIG.APEXLEGENDSCLASSID) return;
        this.gameInfo$.next(gameInfo);
    }
}
