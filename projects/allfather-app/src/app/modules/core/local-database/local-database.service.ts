import { environment } from "@allfather-app/environments/environment";
import { Injectable } from "@angular/core";
import Dexie from "dexie";
import { MatchDataStore } from "./match-data-store";
import { populateData } from "./versions/populate-data";
import { version1 } from "./versions/version1";
import { version2 } from "./versions/version2";

/**
 * @class LocalDatabaseService
 * @classdesc Container for the local database; used for long-term data storage.
 * @summary Cannot load this as a Singleton service, due to Dexie collisions.
 */
@Injectable({ providedIn: "root" })
export class LocalDatabaseService extends Dexie {
    public matches!: Dexie.Table<MatchDataStore, number>;

    constructor() {
        super(environment.localDatabase.name);
        this.handleVersions();
        this.handleDataPopulation();

        this.table("matches");
    }

    public init(): void {}

    private handleVersions() {
        version1(this);
        version2(this);
    }

    /** Only populates data on first run. */
    private handleDataPopulation() {
        this.on("populate", () => {
            populateData(this);
        });
    }
}
