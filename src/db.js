/**
 * Created by LuKa on 2017-09-30.
 * Mongoose Database Connection.
 */

 "use strict";

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

exports.initialize = (config) => {
    return new Promise((resolve, reject) => {
        // Setup DB
        const db = mongoose.connection;

        db.on("error", (err) => {
            log.error(err, "MongoDB Error");
        });

        db.once("open", (err) => {
            // Error is logged if there are any.
            if (err) {
                log.error(err, "Mongoose default connection error");
                reject(err);
            }
            resolve(db);
        });

        mongoose.connect(`mongodb://${config.db.username}:${config.db.password}@${config.db.host}/${config.db.name}`, { useMongoClient: true });
    });
};
