import Dexie, { PromiseExtended, Transaction } from "dexie";

export function version3(db: Dexie): void {
    db.version(3).stores(stores).upgrade(upgrade);
}

const stores = {
    matches: `++id, &matchId, startDate, endDate, myName, gameModeId, mapId, legendId, assists, damage, eliminations, knockdowns, maxPlacement, placement`,
};
const upgrade = (trans: Transaction): PromiseExtended<number> => {
    console.warn(`Local Database upgrading to version 3.`);
    return trans
        .table("matches")
        .toCollection()
        .modify((match) => {
            delete match.gameEventsHistory;
        });
};
