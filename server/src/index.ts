import { Kayn, REGIONS } from "kayn";
import _ = require("lodash");
import database from "./database";
import QUEUE from "./queue";

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
      isEnabled: true,
      showKey: false,
    },
    cacheOptions: {
      cache: null,
      ttls: {},
    },
});

async function scrapeData() {
    const validQueues = [
        QUEUE.TB_BLIND_SUMMONERS_RIFT_5x5,
        QUEUE.TEAM_BUILDER_DRAFT_UNRANKED_5x5,
        QUEUE.TEAM_BUILDER_RANKED_SOLO,
        QUEUE.RANKED_FLEX_SR,
    ];
    const date = new Date();
    const endTime = date.valueOf();
    date.setDate(date.getDate() - 7); // Maximum time range allowed is one week
    const beginTime = date.valueOf();

    const accountIds: { [id: string]: number } = {};
    const usedAccountIds: { [id: string]: number } = {};
    const matchIds: { [id: string]: number } = {};
    const usedMatchIds: { [id: string]: number } = {};

    const dbMatches = await database.matches();
    const dbPerkSets = await database.perkSets();

    // The seed data is too old to have perk data, so just grab the account IDs and be done with them.
    for (const seedData of seedDataFiles)
        for (const match of seedData.matches)
            for (const participant of match.participantIdentities)
                accountIds[participant.player.accountId] = participant.player.accountId;

    // Loop through all of the accounts we know about and get their recent matches. Hopefully this loops indefinitely.
    while (!_.isEmpty(accountIds)) {
        const accountId = Object.keys(accountIds)[0];
        let matches: any;
        try {
            matches = await kayn.Matchlist.by.accountID(accountIds[accountId]).query({ beginTime, endTime });
        } catch (err) {
            console.error(`Failed to get recent matches for account ID ${accountId}`, err);
        }
        usedAccountIds[accountId] = accountIds[accountId];
        delete accountIds[accountId];
        if (!matches)
            continue;
        for (const matchRef of matches.matches) {
            if (!_.includes(validQueues, matchRef.queue))
                continue;
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
                    match = matchRecord.data;
                } else {
                    // We've never seen this match before
                    match = await kayn.Match.get(matchId);
                    if (!match)
                        continue;

                    matchRecord = {
                        id: matchId,
                        data: match,
                    };
                    if (_.isEmpty(match.participants))
                        continue;
                    const firstParticipant = match.participants[0];
                    if (!firstParticipant.stats || !firstParticipant.stats.perk0)
                        continue; // Old game from before perks were introduced

                    try {
                        await dbMatches.insertOrUpdate(matchRecord);
                    } catch (err) {
                        console.error(`Failed to insert match id ${matchId}: `, err);
                    }
                    for (const participant of match.participants) {
                        const perkSet: PerkSet = {
                            perk0Id: participant.stats.perk0,
                            perk1Id: participant.stats.perk1,
                            perk2Id: participant.stats.perk2,
                            perk3Id: participant.stats.perk3,
                            perk4Id: participant.stats.perk4,
                            perk5Id: participant.stats.perk5,
                            championId: participant.championId,
                            win: participant.stats.win,
                            matchId,
                        };
                        try {
                            await dbPerkSets.insertOrUpdate(perkSet);
                        } catch (err) {
                            console.error("Failed to insert perk set: ", err);
                        }
                    }
                }
                for (const participant of match.participantIdentities)
                    if (!(participant.player.accountId in usedAccountIds))
                        accountIds[participant.player.accountId] = participant.player.accountId;
            } catch (err) {
                console.error(`Failed to load match id ${matchId}: `, err);
            }
        }
    }
    console.warn("!!! Ran out of data! Need to re-seed somehow !!!");
    database.close();
}

scrapeData();
