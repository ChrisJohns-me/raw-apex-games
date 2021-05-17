import { Injectable } from "@angular/core";
import Dexie from "dexie";
import { exportDB } from "dexie-export-import";
import { from, Observable } from "rxjs";
import { MatchDataStore } from "./match-data-store";
import { SettingsDataStore } from "./settings-data-store";
import { populateData } from "./versions/populate-data";
import { version1 } from "./versions/version1";
import { version2 } from "./versions/version2";
import { version3 } from "./versions/version3";
import { version4 } from "./versions/version4";

const DATABASE_NAME = "AllfatherApp";

/**
 * @class LocalDatabaseService
 * @classdesc Container for the local database; used for long-term data storage.
 * @summary Cannot load this as a Singleton service, due to Dexie collisions.
 */
@Injectable({ providedIn: "root" })
export class LocalDatabaseService extends Dexie {
    public matches!: Dexie.Table<MatchDataStore, number>; // number = index
    public settings!: Dexie.Table<SettingsDataStore<boolean | number | string>, string>; // string = index

    constructor() {
        super(DATABASE_NAME);
        this.handleVersions();
        this.handleDataPopulation();

        this.table("matches");
        this.table("settings").mapToClass(SettingsDataStore);
    }

    public exportDatabaseBlob$(): Observable<Blob> {
        return from(exportDB(this, { prettyJson: true }));
    }

    private handleVersions() {
        version1(this);
        version2(this);
        version3(this);
        version4(this);
    }

    /** Only populates data on first run. */
    private handleDataPopulation() {
        this.on("populate", () => {
            populateData(this);
        });
    }
}
