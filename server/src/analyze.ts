import fs = require("fs");
import { flatten, orderBy, values } from "lodash";
import path = require("path");
import database from "./database";

async function analyze() {
    const runePairingSize = 10000; // Keep the top n results for each pairing
    const champPairingSize = 10000; // Keep the top n results for each pairing
    const dbPerkSets = await database.perkSets();
    const dbPerkFrequencies = await database.perkFrequencies();

    const perkSets = await dbPerkSets.findAll({
        where: { win: true },
    });
    const perkMap: PerkMap = {};
    const perkKeys = [
        "perk0Id" as "perk0Id",
        "perk1Id" as "perk1Id",
        "perk2Id" as "perk2Id",
        "perk3Id" as "perk3Id",
        "perk4Id" as "perk4Id",
        "perk5Id" as "perk5Id",
    ];
    // tslint:disable-next-line:no-var-requires
    const runeTrees: RuneTree[] = require("../data/runeTrees.json");
    const runeGroups: Rune[][] = runeTrees.map(rt => flatten(rt.runes));

    const runePopularity: { [runeId: number]: number } = {};
    const championPopularity: { [champId: number]: number } = {};
    for (const perkSet of perkSets) {

        if (championPopularity[perkSet.championId])
            ++championPopularity[perkSet.championId];
        else
            championPopularity[perkSet.championId] = 1;

        for (const key of perkKeys) {
            let perkId = perkSet[key];
            if (typeof perkId === "string")
                perkId = parseInt(perkId, 10);
            const perkFrequency = perkMap[perkId] || (perkMap[perkId] = {
                id: perkId,
                data: {},
            });
            const runeGroup = runeGroups.find(rg => rg.some(r => r.id === perkId));
            if (!runeGroup) {
                console.warn(`Rune ${key} was not found in any group! Something went wrong.`);
                continue;
            }
            if (runePopularity[perkId])
                ++runePopularity[perkId];
            else
                runePopularity[perkId] = 1;

            for (const key2 of perkKeys) {
                if (key2 === key)
                    continue;
                let perkId2 = perkSet[key2];
                if (typeof perkId2 === "string")
                    perkId2 = parseInt(perkId2, 10);
                if (runeGroup.some(rg => rg.id === perkId2))
                    continue;
                const perkFrequencyItem = perkFrequency.data[perkId2] || (perkFrequency.data[perkId2] = {
                    id: perkId2,
                    count: 0,
                    champions: {},
                });
                const championItem = perkFrequencyItem.champions[perkSet.championId] || (perkFrequencyItem.champions[perkSet.championId] = {
                    count: 0,
                });
                ++perkFrequencyItem.count;
                ++championItem.count;
            }
        }
    }
    const orderedPerkMap: OrderedPerkMap = {};
    for (const perkFrequency of values(perkMap)) {
        let orderedPerkIds = orderBy(Object.keys(perkFrequency.data).map(s => parseInt(s, 10)),
            perkId => getScore(perkFrequency.data[perkId], runePopularity[perkId]), "desc");
        // Remove the perks that don't make the cut
        for (let i = runePairingSize; i < orderedPerkIds.length; ++i)
            delete perkFrequency.data[orderedPerkIds[i]];
        orderedPerkIds = orderedPerkIds.slice(0, runePairingSize);

        orderedPerkMap[perkFrequency.id] = {
            perkId: perkFrequency.id,
            pairings: orderedPerkIds.map((perkId): OrderedPairingFrequency => ({
                perkId,
                count: perkFrequency.data[perkId].count,
                champions: [],
            })),
        };
        for (const perkPairing of values(perkFrequency.data)) {
            let orderedChampIds = orderBy(Object.keys(perkPairing.champions).map(s => parseInt(s, 10)),
                champId => getScore(perkPairing.champions[champId], championPopularity[champId]), "desc");
            // Remove the champions that don't make the cut
            for (let i = champPairingSize; i < orderedChampIds.length; ++i)
                delete perkPairing.champions[orderedChampIds[i]];
            orderedChampIds = orderedChampIds.slice(0, champPairingSize);

            const orderedPerkPairing = orderedPerkMap[perkFrequency.id].pairings.find(p => p.perkId === perkPairing.id)!;
            orderedPerkPairing.champions = orderedChampIds.map((championId): OrderedChampionFrequency => ({
                championId,
                count: perkFrequency.data[perkPairing.id].champions[championId].count,
            }));
        }
    }
    const filePath = path.join(__dirname, "../../www/data/perkMap.js");
    const dir = path.dirname(filePath);
    console.info(`Saving results to the database and to ${filePath}`);
    fs.mkdir(dir, err => {
        if (err && err.code !== "EEXIST") {
            console.error(`Failed to create directory ${dir}: ${err.message}`);
            return;
        }
        fs.writeFile(filePath, `data = ${JSON.stringify(orderedPerkMap)};`, err2 => {
            if (err2)
                console.error(`Failed to save to ${filePath}: ${err2.message}`);
            else
                console.info(`Saved successfully to ${filePath}`);
        });
    });
    await dbPerkFrequencies.destroy({ where: {} }); // Delete all items
    await dbPerkFrequencies.bulkCreate(values(perkMap));
    console.info("Saved successfully to database.");
    await database.close();
}

function getScore(pairing: PairingFrequency | ChampionFrequency, popularity: number) {
    return pairing.count / popularity;
}

export default analyze;
