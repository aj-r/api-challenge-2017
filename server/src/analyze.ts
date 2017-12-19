import { Kayn, REGIONS } from "kayn";
import _ = require("lodash");
import database from "./database";

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

async function analyze() {
    // const dbMatches = await database.matches();
    const dbPerkSets = await database.perkSets();
    //const perkIds = await database.getAllPerkIds();
    //for (const perkId of perkIds) {
    //}
    const perkSets = await dbPerkSets.findAll();
    const perkMap: { [perkId: number]: { [perkId: number]: number } } = {};
    await database.close();
}

export default analyze;
