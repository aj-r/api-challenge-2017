import crypto = require("crypto");
import fs = require("fs");
import yargs = require("yargs");

const argv = yargs
    .options({
        username: {
            alias: "u",
            demandOption: true,
            type: "string",
        },
        password: {
            alias: "p",
            demandOption: true,
            type: "string",
        },
    })
    .argv;
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
const ivString = iv.toString("base64");
const securePassword = cipher.update(argv.password, "utf8", "base64")
    + cipher.final("base64");
const json = JSON.stringify({
    username: argv.username,
    password: ivString + ";" + securePassword,
});
fs.writeFileSync("pg-options.json", json, "utf8");
fs.writeFileSync("pg-options.key", key);
console.info("Parameters written to pg-options.json. IMPORTANT: DO NOT distribute pg-options.key to any other computer as it contains sensitive information.");
