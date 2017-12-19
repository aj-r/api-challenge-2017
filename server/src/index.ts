import yargs = require("yargs");
import analyze from "./analyze";
import gather from "./gather";

// tslint:disable-next-line:no-unused-expression
yargs
    .command("gather", "Gather perk data from League games", {}, gather)
    .command("analyze", "Analyze data to find pairings", {}, analyze)
    .argv;
