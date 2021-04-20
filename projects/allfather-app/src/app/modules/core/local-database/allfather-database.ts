import { environment } from "@allfather-app/environments/environment";
import Dexie from "dexie";
import { MatchDataStore } from "./match-data-store";

export class AllfatherDatabase extends Dexie {
    public matches: Dexie.Table<MatchDataStore, number>; //number = type of the primkey

    constructor() {
        super(environment.localDatabase.name);
        this.version(1).stores({
            matches: `++id, &matchId, startDate, endDate, myName, gameModeId, mapId`,
        });
        this.matches = this.table("matches");
    }
}
