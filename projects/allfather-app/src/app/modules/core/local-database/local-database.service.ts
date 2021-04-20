import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { isEmpty } from "shared/utilities";
import { AllfatherDatabase } from "./allfather-database";
import { MatchDataStore } from "./match-data-store";

@Injectable({ providedIn: "root" })
export class LocalDatabaseService {
    private allfatherDB = new AllfatherDatabase();

    constructor() {}

    public init(): void {}

    /**
     * Retrieves a specific Match from database.
     * @returns {MatchDataStore}
     */
    public getStoredMatchByMatchId(matchId: string): Observable<MatchDataStore | undefined> {
        if (isEmpty(matchId)) throw new Error(`Cannot retrieve match data from local database; matchId is empty.`);
        const matchPromise = this.allfatherDB.transaction("readonly", this.allfatherDB.matches, () => {
            return this.allfatherDB.matches.get({ matchId });
        });

        return from(matchPromise);
    }

    /**
     * Retrieves Matches from database.
     * @returns {MatchDataStore[]}
     */
    public getStoredMatches(matchIds: string[]): Observable<MatchDataStore[]> {
        if (isEmpty(matchIds)) throw new Error(`Cannot retrieve match data from local database; matchId is empty.`);
        const matchesPromise = this.allfatherDB.transaction("readonly", this.allfatherDB.matches, () => {
            return this.allfatherDB.matches.where("matchId").anyOf(matchIds).toArray();
        });

        return from(matchesPromise);
    }

    /**
     *
     * @param matchData
     * @returns {number} Index where data has been saved.
     */
    public storeMatch(matchData: MatchDataStore): Observable<number> {
        const savePromise = this.allfatherDB.transaction("readwrite", this.allfatherDB.matches, () => {
            return this.allfatherDB.matches.put(matchData);
        });

        return from(savePromise);
    }
}
