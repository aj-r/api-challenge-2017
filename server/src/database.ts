import crypto = require("crypto");
import fs = require("fs");
import _ = require("lodash");
import { Client, ClientConfig } from "pg";
import Sequelize = require("sequelize");

class Database {
    private initPromise: Promise<Sequelize.Sequelize>;
    constructor(config?: ClientConfig) {
        this.initPromise = this.init(config);
    }

    private init = async (config?: ClientConfig): Promise<Sequelize.Sequelize> => {
        if (!config)
            config = {};
        if (!config.user || !config.password) {
            const optionString = fs.readFileSync("pg-options.json", "utf8");
            const options: PgOptions = JSON.parse(optionString);

            if (!config.user)
                config.user = options.username;
            if (!config.password) {
                const key = fs.readFileSync("pg-options.key");
                const [ivString, securePassword] = options.password.split(";");
                const iv = Buffer.from(ivString, "base64");
                const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
                config.password = decipher.update(securePassword, "base64", "utf8")
                    + decipher.final("utf8");
            }
        }
        if (!config.database)
            config.database = "api2017";
        const sequelize = new Sequelize(config.database, config.user, config.password, {
            dialect: "postgres",
            host: "localhost",
            logging: false,
            operatorsAliases: Sequelize.Op as any,
        });
        await this.createDatabase(config);
        try {
            await sequelize.authenticate();
            console.info("connected to database");
        } catch (err) {
            console.error("connection failed! ", err);
            throw err;
        }
        return sequelize;
    }

    public close = async () => {
        const sequelize = await this.initPromise;
        sequelize.close();
    }

    private perkSetsPromise: Promise<Sequelize.Model<PerkSet, {}>>;
    public perkSets = () => {
        return this.perkSetsPromise || (this.perkSetsPromise = this.initPromise.then(sequelize =>
            sequelize.define<PerkSet, {}>("perkset", {
                id: {
                    type: Sequelize.BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                },
                perk0Id: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                },
                perk1Id: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                },
                perk2Id: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                },
                perk3Id: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                },
                perk4Id: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                },
                perk5Id: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                },
                championId: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                },
                matchId: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                },
                win: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                },
            }))
            .then(model => model.sync()));
    }

    private perkFrequenciesPromise: Promise<Sequelize.Model<PerkFrequency, {}>>;
    public perkFrequencies = () => {
        return this.perkFrequenciesPromise || (this.perkFrequenciesPromise = this.initPromise.then(sequelize =>
            sequelize.define<PerkFrequency, {}>("perkfrequency", {
                id: {
                    type: Sequelize.BIGINT,
                    autoIncrement: false,
                    primaryKey: true,
                },
                data: {
                    type: Sequelize.JSONB,
                    allowNull: false,
                },
            }))
            .then(model => model.sync()));
    }

    private matchesPromise: Promise<Sequelize.Model<MatchRecord, {}>>;
    public matches = () => {
        return this.matchesPromise || (this.matchesPromise = this.initPromise.then(sequelize =>
            sequelize.define<MatchRecord, {}>("match", {
                id: {
                    type: Sequelize.BIGINT,
                    primaryKey: true,
                },
                data: {
                    type: Sequelize.JSONB,
                    allowNull: false,
                },
            }))
            .then(model => model.sync()));
    }

    public getAllPerkIds = async (): Promise<number[]> => {
        const sequelize = await this.initPromise;
        const query =
            `select distinct "perkId" from (
                select "perk0Id" as "perkId" from perksets
                union
                select "perk1Id" as "perkId" from perksets
                union
                select "perk2Id" as "perkId" from perksets
                union
                select "perk3Id" as "perkId" from perksets
            ) as "perkIds"`;
        return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    }

    private createDatabase = async (config: ClientConfig): Promise<void> => {
        if (!config.database)
            return;
        const genericConfig = _.cloneDeep(config);
        // Connect to the postgres database because we know for sure that it will exist.
        genericConfig.database = "postgres";
        const genericClient = new Client(genericConfig);
        try {
            await genericClient.connect();
            await genericClient.query("CREATE DATABASE " + config.database);
        } catch (err) {
            // Database already exists
        }
        genericClient.end();
    }

    /*public connect = (): Promise<void> => {
        return this.client.connect();
    }*/
}

export const database = new Database();
export default database;
