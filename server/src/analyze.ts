import { values } from "lodash";
import database from "./database";

async function analyze() {
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
    await dbPerkFrequencies.destroy({ where: {} }); // Delete all items
    await dbPerkFrequencies.bulkCreate(values(perkMap));
    await database.close();
}

export default analyze;
