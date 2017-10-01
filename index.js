/**
 * Created by LuKa on 2017-09-30.
 * Starter file, configurating settings for Restify Server (src/server.js)
 */

 "use strict";

const
    dotenv = require("dotenv"),
    fs     = require("fs"),
    path   = require("path"),
    db     = require("./src/db"),
    server = require("./src/server"),
    pack   = require("./package.json");

global.log = require("pino")();

// Get running environment based on NODE_ENV variable or use development
let env = process.env.NODE_ENV || "development";

// .env will override if it exists
if (fs.existsSync(".env")) {
    const envConfig = dotenv.parse(fs.readFileSync(".env"));

    for (const k in envConfig) {
        if (process.env[k]) {
            process.env[k] = envConfig[k];
        }
    }
    dotenv.config();
    env = process.env.NODE_ENV;
}

// Load configuration according to environment
const configFile = path.join(process.cwd(), "config", `config.${env}.js`);
const config = require(configFile);

// Set version from package.json version attribute
config.client.version = pack.version;
// Add env setting
config.client.env = env;

log.info(config, "Configuration");

server.initialize(config)
    .then((srv) => {
        log.info(`${srv.name} listening at ${srv.url}`);

        return db.initialize(config);
    })
    .then((db) => {
        log.info(`Database '${db.name}' ready for user '${db.user}' at '${db.host}:${db.port}'`);
    })
    .catch((err) => {
        log.error(err);
        process.exit(1);
    });
