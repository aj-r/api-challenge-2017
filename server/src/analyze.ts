import fs = require("fs");
import { orderBy, values } from "lodash";
import path = require("path");
import database from "./database";

async function analyze() {
    const resultSize = 5; // Keep the top n results for each pairing
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
    for (const perkSet of perkSets) {
        for (const key of perkKeys) {
            const perkId = perkSet[key];
            const perkFrequency = perkMap[perkId] || (perkMap[perkId] = {
                id: perkId,
                data: {},
            });
            for (const key2 of perkKeys) {
                if (key2 === key)
                    continue;
                const perkId2 = perkSet[key2];
                const perkFrequencyItem = perkFrequency.data[perkId2] || (perkFrequency.data[perkId2] = {
                    count: 0,
                    champions: {},
                });
                ++perkFrequencyItem.count;
                if (perkFrequencyItem.champions[perkSet.championId])
                    ++perkFrequencyItem.champions[perkSet.championId];
                else
                    perkFrequencyItem.champions[perkSet.championId] = 1;
            }
        }
    }
    for (const perkFrequency of values(perkMap)) {
        const orderedPerkIds = orderBy(Object.keys(perkFrequency.data), perkId => perkFrequency.data[perkId as any].count, "desc");
        // Remove the perks that don't make the cut
        for (let i = resultSize; i < orderedPerkIds.length; ++i)
            delete perkFrequency.data[orderedPerkIds[i] as any];

        for (const perkPairing of values(perkFrequency.data)) {
            const orderedChampIds = orderBy(Object.keys(perkPairing.champions), champId => perkPairing.champions[champId as any], "desc");
            // Remove the champions that don't make the cut
            for (let i = resultSize; i < orderedChampIds.length; ++i)
                delete perkPairing.champions[orderedChampIds[i] as any];
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

export default analyze;
