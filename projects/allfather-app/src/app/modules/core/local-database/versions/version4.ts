import Dexie from "dexie";

export function version4(db: Dexie): void {
    db.version(4).stores(stores);
}

const stores = {
    matches: `++id, &matchId, startDate, endDate, myName, gameModeId, mapId, legendId, assists, damage, eliminations, knockdowns, maxPlacement, placement`,
    settings: `&key, type, value`,
};
