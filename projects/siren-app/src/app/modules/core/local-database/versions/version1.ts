import Dexie from "dexie";

export function version1(db: Dexie): void {
    db.version(1).stores(stores);
}

const stores = {
    reportedPlayers: `&id, &inGameUsername, &firstReportedDate, &lastReportedDate, rosterHashes, reportedReasons`,
    settings: `&key`,
};
