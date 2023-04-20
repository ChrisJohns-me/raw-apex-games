import { Injectable } from "@angular/core";
import { SingletonServiceProviderFactory } from "@app/singleton-service.provider.factory.js";
import { exportDB } from "dexie-export-import";
import { APP_NAME } from "../../../models/app.js";
/** @see https://dexie.org/docs/Observable/Dexie.Observable */
import { SettingsDataStore } from "@app/modules/core/local-database/settings-data-store.js";
import { Dexie } from "dexie";
import "dexie-observable";
import { IDatabaseChange } from "dexie-observable/api.js";
import { defer, from, Observable, Subject } from "rxjs";
import { MatchDataStore } from "./match-data-store.js";
import { populateData } from "./versions/populate-data.js";
import { version1 } from "./versions/version1.js";

const DATABASE_NAME = "RawApexGamesApp";

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
