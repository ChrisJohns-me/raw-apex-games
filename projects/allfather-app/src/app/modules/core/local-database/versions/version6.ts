import Dexie from "dexie";

export function version6(db: Dexie): void {
    db.version(6).stores(stores);
}

const stores = {
    matches: `++id, &matchId, startDate, endDate, myName, gameModeId, mapId, legendId, assists, damage, eliminations, knockdowns, maxPlacement, placement, deaths, deathLocationHistory, eliminationLocationHistory, eliminationWeaponIds`,
    settings: `&key`,
};
