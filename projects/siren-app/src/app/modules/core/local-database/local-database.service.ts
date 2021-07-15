import { Injectable } from "@angular/core";
import { SingletonServiceProviderFactory } from "@shared-app/singleton-service.provider.factory";
import { APP_NAME } from "@siren-app/app/common/app";
import Dexie from "dexie";
import { exportDB } from "dexie-export-import";
/** @see https://dexie.org/docs/Observable/Dexie.Observable */
import "dexie-observable";
import { IDatabaseChange } from "dexie-observable/api";
import { defer, from, Observable, Subject } from "rxjs";
import { ReportedPlayerDataStore } from "./reported-player-data-store";
import { SettingsDataStore } from "./settings-data-store";
import { version1 } from "./versions/version1";

const DATABASE_NAME = "SirenApp";

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

    public reportedPlayers!: Dexie.Table<ReportedPlayerDataStore, string>; // string = index
    public settings!: Dexie.Table<SettingsDataStore, string>; // string = index

    constructor() {
        super(DATABASE_NAME);
        console.log(`[${this.constructor.name}] (${APP_NAME}) Setting up local database: "${DATABASE_NAME}"`);
        this.handleVersions();
        this.handleDataPopulation();

        this.table("reportedPlayers");
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
        this.on("populate", () => {});
    }

    private setupOnChanges(): void {
        this.on("changes", (changes) => {
            this.onChanges$.next(changes);
        });
    }
}
