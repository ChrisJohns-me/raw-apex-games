import { environment } from "@allfather-app/environments/environment";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { mdiAttachment } from "@mdi/js";
import format from "date-fns/format";
import "dexie-export-import";
import { importInto, ImportOptions } from "dexie-export-import";
import { from, Subject } from "rxjs";
import { finalize, switchMap, takeUntil } from "rxjs/operators";
import { FileService } from "../../core/file.service";
import { LocalDatabaseService } from "../../core/local-database/local-database.service";
import { OverwolfExtensionsService } from "../../core/overwolf/overwolf-extensions.service";

//
// Import from Blob or File to Dexie instance:
//
// const db = await Dexie.import(blob, [options]);

//
// Export to Blob
//
// const blob = await db.export([options]);

//
// Import from Blob or File to existing Dexie instance
//
// await db.import(blob, [options]);

// TODO MOVE export into LocalDatabaseService
@Component({
    selector: "app-settings-page",
    templateUrl: "./settings-page.component.html",
    styleUrls: ["./settings-page.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
    public mdiAttachment = mdiAttachment;
    public inGameHUDForm = this.formBuilder.group({
        enableInGameHUD: [true],
        enableMatchTimer: [true],
        enableUltimateTimer: [true],
        enableInflictionInsight: [true],
    });
    public legendSelectForm = this.formBuilder.group({
        enableLegendSelectScreen: [true],
        enableLegendSelectStats: [true],
        enableLegendSelectSuggestions: [true],
    });

    public isExportingLocalDatabase = false;
    public isImportingLocalDatabase = false;

    private dbExportFilename = `${environment.DEV ? "DEV_" : ""}allfather_db_${format(new Date(), "yyyy_dd_mm")}.json`;
    private dbExportDirectory = "db_export";
    private isDestroyed$ = new Subject<void>();

    constructor(
        private readonly fileService: FileService,
        private readonly formBuilder: FormBuilder,
        private readonly localDatabase: LocalDatabaseService,
        private readonly overwolfExtensions: OverwolfExtensionsService
    ) {}

    public exportLocalDatabase(): void {
        this.isExportingLocalDatabase = true;
        this.fileService
            .ensureDirectory$(this.dbExportDirectory)
            .pipe(
                takeUntil(this.isDestroyed$),
                switchMap(() => this.localDatabase.exportDatabaseBlob$()),
                switchMap((blobContent) => from(blobContent.text())),
                switchMap((jsonContent) => this.fileService.saveFile$(`${this.dbExportDirectory}/${this.dbExportFilename}`, jsonContent)),
                finalize(() => (this.isExportingLocalDatabase = false))
            )
            .subscribe(() => {
                console.debug(`>>> Finished Export.`);
            });
    }

    public importLocalDatabase(event: Event): void {
        const options: ImportOptions = {
            acceptNameDiff: true,
            acceptChangedPrimaryKey: true,
            overwriteValues: true,
            // this may be an entry for future bugs on corrupted data.
            // But for now is necessary to avoid "Database is closing" error.
            noTransaction: true,
            chunkSizeBytes: 5 * 1000 * 1000,
        };
        this.isImportingLocalDatabase = true;
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;

        importInto(this.localDatabase, file, options)
            .then(console.log)
            .catch(console.error)
            .finally(() => {
                console.debug(`>>> Finished Import.`);
                this.isImportingLocalDatabase = false;
            });
    }
}
