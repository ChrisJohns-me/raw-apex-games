import { Table } from "dexie";
import { LocalDatabaseService } from "../local-database.service";
import { MatchDataStore } from "../match-data-store";

export class RepairMatchesDataStore {
    private get matches(): Table<MatchDataStore, number> {
        return this.dbRef.matches;
    }
    constructor(private readonly dbRef: LocalDatabaseService) {
        this.repairMatchIds();
        this.repairStartDates();
        this.repairEndDates();
        this.repairMyNames();
        this.repairGameModeIds();
        this.repairMapIds();
        this.repairLegendIds();
        this.repairAssists();
        this.repairDamages();
        this.repairEliminations();
        this.repairKnockdowns();
        this.repairMaxPlacements();
        this.repairPlacements();
        this.repairDamageEventsHistories();
        this.repairKillfeedHistories();
        this.repairLocationHistories();
        this.repairMatchRosters();
        this.repairTeamRosters();
        this.repairUltimateUsageDates();
        this.repairWeaponIdsHistories();
    }

    ///

    private repairMatchIds(): void {}

    private repairStartDates(): void {}

    private repairEndDates(): void {}

    private repairMyNames(): void {}

    private repairGameModeIds(): void {}

    private repairMapIds(): void {}

    private repairLegendIds(): void {}

    private repairAssists(): void {}

    private repairDamages(): void {}

    private repairEliminations(): void {}

    private repairKnockdowns(): void {}

    private repairMaxPlacements(): void {}

    private repairPlacements(): void {}

    private repairDamageEventsHistories(): void {}

    private repairKillfeedHistories(): void {}

    private repairLocationHistories(): void {}

    private repairMatchRosters(): void {}

    private repairTeamRosters(): void {}

    private repairUltimateUsageDates(): void {}

    private repairWeaponIdsHistories(): void {}
}
