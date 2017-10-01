/**
 * DEVELOPMENT ENVIRONMENT SETTINGS
 */

module.exports = {
    client: {
        name: "LuKaz REST API",
        description: "A demo REST API implemented using Restify"
    },
    db: {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    },
    webserver: {
        auth: {
            use: false
        },
        host: "localhost",
        https: false,
        port: process.env.port,
        servePublic: false,
        throttle: {
            use: false,
            rate: 1,     // Max 1 call/sec
            burst: 2,    // Allow 2/sec on bursts
            xff: true    // Same rules applies for forwarded domains
        },
        whitelist: {
            use: false,
            hosts: ["127.0.0.1"]
        }
    }
};