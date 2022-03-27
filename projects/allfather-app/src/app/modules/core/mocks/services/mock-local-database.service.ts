import { IDatabaseChange } from "dexie-observable/api";
import { of, Subject } from "rxjs";
import { LocalDatabaseService } from "../../local-database/local-database.service";

// Cannot use MockClass type with Dexie
export class MockLocalDatabaseService {
    public onChanges$: LocalDatabaseService["onChanges$"] = new Subject<IDatabaseChange[]>();

    public matches!: LocalDatabaseService["matches"];
    public settings!: LocalDatabaseService["settings"];

    public exportDatabaseBlob$(): ReturnType<LocalDatabaseService["exportDatabaseBlob$"]> {
        return of();
    }

    public performRepair(): void {}
}
