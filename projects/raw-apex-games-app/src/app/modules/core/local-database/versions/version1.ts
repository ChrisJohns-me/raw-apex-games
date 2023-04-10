import Dexie from "dexie";

export function version1(db: Dexie): void {
    db.version(1).stores(stores);
}

const stores = { matches: `++id, &matchId, startDate, endDate, myName, gameModeId, mapId` };
