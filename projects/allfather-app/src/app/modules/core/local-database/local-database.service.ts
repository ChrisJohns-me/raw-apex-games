import { APP_NAME } from "@allfather-app/app/common/app";
import { SingletonServiceProviderFactory } from "@allfather-app/app/singleton-service.provider.factory";
import { Injectable } from "@angular/core";
import Dexie from "dexie";
import { exportDB } from "dexie-export-import";
/** @see https://dexie.org/docs/Observable/Dexie.Observable */
import "dexie-observable";
import { IDatabaseChange } from "dexie-observable/api";
import { defer, from, Observable, Subject } from "rxjs";
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
 */
@Injectable({
    providedIn: "root",
    deps: [],
    useFactory: (...deps: any[]) => SingletonServiceProviderFactory("LocalDatabaseService", LocalDatabaseService, deps),
})
export class LocalDatabaseService extends Dexie {
    public onChanges$ = new Subject<IDatabaseChange[]>();

    public matches!: Dexie.Table<MatchDataStore, number>; // number = index
    public settings!: Dexie.Table<SettingsDataStore, string>; // string = index

    constructor() {
        super(DATABASE_NAME);
        console.log(`[${this.constructor.name}] (${APP_NAME}) Setting up local database: "${DATABASE_NAME}"`);
        this.handleVersions();
        this.handleDataPopulation();

        this.table("matches");
        this.table("settings").mapToClass(SettingsDataStore);

        this.setupOnChanges();
    }

    public exportDatabaseBlob$(): Observable<Blob> {
        return defer(() => from(exportDB(this, { prettyJson: true })));
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

    private setupOnChanges(): void {
        this.on("changes", (changes) => {
            this.onChanges$.next(changes);
        });
    }
}
