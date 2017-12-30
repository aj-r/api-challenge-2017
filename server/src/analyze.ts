import fs = require("fs");
import { flatten, orderBy, values } from "lodash";
import path = require("path");
import database from "./database";

async function analyze() {
    const runePairingSize = 5; // Keep the top n results for each pairing
    const champPairingSize = 5; // Keep the top n results for each pairing
    const dbPerkSets = await database.perkSets();
    const dbPerkFrequencies = await database.perkFrequencies();

    const perkSets = await dbPerkSets.findAll();
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
    //const runeTrees: RuneTree[] = require("../data/runeTrees.json");
    //const runeGroups: Rune[][] = runeTrees.map(rt => flatten(rt.runes));

    for (const perkSet of perkSets) {
        for (const key of perkKeys) {
            const perkId = perkSet[key];
            const perkFrequency = perkMap[perkId] || (perkMap[perkId] = {
                id: perkId,
                data: {},
            });
            // tslint:disable-next-line:triple-equals
            /*const runeGroup = runeGroups.find(rg => rg.some(r => r.id == perkId));
            if (!runeGroup) {
                console.warn(`Rune ${key} was not found in any group! Something went wrong.`);
                continue;
            }*/
            for (const key2 of perkKeys) {
                if (key2 === key)
                    continue;
                //if (runeGroup.some(rg => rg.id === key))
                //    continue;
                const perkId2 = perkSet[key2];
                const perkFrequencyItem = perkFrequency.data[perkId2] || (perkFrequency.data[perkId2] = {
                    count: 0,
                    wins: 0,
                    champions: {},
                });
                const championItem = perkFrequencyItem.champions[perkSet.championId] || (perkFrequencyItem.champions[perkSet.championId] = {
                    count: 0,
                    wins: 0,
                });
                ++perkFrequencyItem.count;
                ++championItem.count;
                if (perkSet.win) {
                    ++perkFrequencyItem.wins;
                    ++championItem.wins;
                }
            }
        }
    }
    /*for (const perkFrequency of values(perkMap)) {
        const orderedPerkIds = orderBy(Object.keys(perkFrequency.data), perkId => getWinRate(perkFrequency.data[perkId as any]), "desc");
        // Remove the perks that don't make the cut
        for (let i = runePairingSize; i < orderedPerkIds.length; ++i)
            delete perkFrequency.data[orderedPerkIds[i] as any];

        for (const perkPairing of values(perkFrequency.data)) {
            const orderedChampIds = orderBy(Object.keys(perkPairing.champions), champId => getWinRate(perkPairing.champions[champId as any]), "desc");
            // Remove the champions that don't make the cut
            for (let i = champPairingSize; i < orderedChampIds.length; ++i)
                delete perkPairing.champions[orderedChampIds[i] as any];
        }
    }*/
    const filePath = path.join(__dirname, "../../www/data/perkMap.js");
    const dir = path.dirname(filePath);
    console.info(`Saving results to the database and to ${filePath}`);
    fs.mkdir(dir, err => {
        if (err && err.code !== "EEXIST") {
            console.error(`Failed to create directory ${dir}: ${err.message}`);
            return;
        }
        fs.writeFile(filePath, `data = ${JSON.stringify(perkMap)};`, err2 => {
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

function getWinRate(pairing: PairingFrequency | ChampionFrequency) {
    if (pairing.count < 10) {
        // Too little data to get an accurate win rate. Ignore this pairing
        return 0;
    }
    return pairing.wins / pairing.count;
}

export default analyze;
