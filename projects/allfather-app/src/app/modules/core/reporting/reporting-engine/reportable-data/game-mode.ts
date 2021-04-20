import { ExtractSubjectType } from "shared/types/rxjs-utilities";
import { MatchService } from "../../../match/match.service";
import { ReportableDataSnapshot } from "../reportable-data";

type GameModeDataOutput = ExtractSubjectType<MatchService["gameMode$"]>;
export function GameModeDataFactory(gameModeObs: MatchService["gameMode$"]): ReportableDataSnapshot<GameModeDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "gameMode",
        source$: gameModeObs,
        persist: true,
    });
}
