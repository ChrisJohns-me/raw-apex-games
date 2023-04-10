import Dexie, { PromiseExtended, Transaction } from "dexie";

export function version2(db: Dexie): void {
    db.version(2).stores(stores).upgrade(upgrade);
}

const stores = {
    matches: `++id, &matchId, startDate, endDate, myName, gameModeId, mapId, legendId, assists, damage, eliminations, knockdowns, maxPlacement, placement`,
};
const upgrade = (trans: Transaction): PromiseExtended<number> => {
    console.warn(`Local Database upgrading to version 2.`);
    return trans
        .table("matches")
        .toCollection()
        .modify((match) => {
            match.assists = match.matchSummary.assists;
            match.damage = match.matchSummary.damage;
            match.eliminations = match.matchSummary.eliminations;
            match.knockdowns = match.matchSummary.knockdowns;
            match.maxPlacement = match.matchSummary.maxPlacement;
            match.placement = match.matchSummary.placement;

            delete match.matchSummary;
        });
};
