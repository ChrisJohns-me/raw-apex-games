import { MatchService } from "#app/modules/core/match/match.service.js";
import { ExtractSubjectType } from "#shared/types/rxjs-utilities.js";
import { ReportableDataSnapshot } from "../reportable-data.js";

type GameModeDataOutput = ExtractSubjectType<MatchService["gameMode$"]>;
export function GameModeDataFactory(gameModeObs: MatchService["gameMode$"]): ReportableDataSnapshot<GameModeDataOutput> {
    return new ReportableDataSnapshot({
        dataId: "gameMode",
        source$: gameModeObs,
        persist: true,
    });
}
