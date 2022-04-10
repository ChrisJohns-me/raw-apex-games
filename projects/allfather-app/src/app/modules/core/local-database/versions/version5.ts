import Dexie from "dexie";

export function version5(db: Dexie): void {
    db.version(5).stores(stores);
}

const stores = {
    matches: `++id, &matchId, startDate, endDate, myName, gameModeId, mapId, legendId, assists, damage, eliminations, knockdowns, maxPlacement, placement, deaths, deathLocationHistory, eliminationLocationHistory`,
    settings: `&key`,
};
