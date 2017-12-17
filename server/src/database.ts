import crypto = require("crypto");
import fs = require("fs");
import { Client } from "pg";

class Database {
    private client: Client;
    constructor() {
        const optionString = fs.readFileSync("pg-options.json", "utf8");
        const options: PgOptions = JSON.parse(optionString);

        const key = fs.readFileSync("pg-options.key");
        const [ivString, securePassword] = options.password.split(";");
        const iv = Buffer.from(ivString, "base64");
        const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
        const password = decipher.update(securePassword, "base64", "utf8")
            + decipher.final("utf8");

        this.client = new Client({
            user: options.username,
            password,
        });
    }

    public connect = (): Promise<void> => {
        return this.client.connect();
    }
}

export const database = new Database();
export default database;
