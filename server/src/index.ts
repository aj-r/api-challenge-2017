import { Kayn, REGIONS } from "kayn";
import _ = require("lodash");
import database from "./database";

// tslint:disable:no-var-requires
const seedDataFiles: SeedData[] = [
    require("../seed-data/matches1.json"),
    require("../seed-data/matches2.json"),
    require("../seed-data/matches3.json"),
    require("../seed-data/matches4.json"),
    require("../seed-data/matches5.json"),
    require("../seed-data/matches6.json"),
    require("../seed-data/matches7.json"),
    require("../seed-data/matches8.json"),
    require("../seed-data/matches9.json"),
    require("../seed-data/matches10.json"),
];

const kayn = Kayn()({
    region: REGIONS.NORTH_AMERICA,
    debugOptions: {
      isEnabled: false,
      showKey: false,
    },
    cacheOptions: {
      cache: null,
      ttls: {},
    },
});

async function scrapeData() {
    const accountIds: { [id: string]: number } = {};
    const usedAccountIds: { [id: string]: number } = {};
    const matchIds: { [id: string]: number } = {};
    const usedMatchIds: { [id: string]: number } = {};

    const dbMatches = await database.matches();
    const dbPerkSets = await database.perkSets();

    for (const seedData of seedDataFiles)
        for (const match of seedData.matches)
            for (const participant of match.participantIdentities)
                accountIds[participant.player.accountId] = participant.player.accountId;

    while (!_.isEmpty(accountIds)) {
        const accountId = Object.keys(accountIds)[0];
        const matches = await kayn.Matchlist.by.accountID(accountIds[accountId]);
        usedAccountIds[accountId] = accountIds[accountId];
        delete accountIds[accountId];
        for (const matchRef of matches.matches) {
            const matchId = matchRef.gameId;
            if (!(matchId in usedMatchIds))
                matchIds[matchId] = matchId;
        }

        for (const matchIdKey of Object.keys(matchIds)) {
            const matchId = matchIds[matchIdKey];
            usedMatchIds[matchId] = matchId;
            delete matchIds[matchId];

            try {
                let matchRecord = await dbMatches.findById(matchId);
                let match: any;
                if (matchRecord) {
                    match = matchRecord.data; // TODO: test that this is a real object and not just a JSON string.
                } else {
                    // We've never seen this match before
                    match = await kayn.Match.get(matchId);
                    if (!match)
                        continue;
                    for (const participant of match.participants) {
                        const perkSet: PerkSet = {
                            perk0Id: participant.stats.perk0,
                            perk1Id: participant.stats.perk1,
                            perk2Id: participant.stats.perk2,
                            perk3Id: participant.stats.perk3,
                            perk4Id: participant.stats.perk4,
                            perk5Id: participant.stats.perk5,
                            win: participant.stats.win,
                            matchId,
                        };
                        await dbPerkSets.insertOrUpdate(perkSet);
                    }
                    matchRecord = {
                        id: matchId,
                        data: match,
                    };
                    await dbMatches.insertOrUpdate(matchRecord);
                }
                for (const participant of match.participantIdentities)
                    if (!(participant.player.accountId in usedAccountIds))
                        accountIds[participant.player.accountId] = participant.player.accountId;
            } catch (err) {
                console.log(`Failed to load match id ${matchId}: `, err);
            }
        }
    }
    console.warn("!!! Ran out of data! Need to re-seed somehow !!!");
    database.close();
}

scrapeData();
