/**
 * Created by LuKa on 2017-09-30.
 * Main Server file.
 * Create server, configure connection and middleware
 */

"use strict";

const
    errors    = require("restify-errors"),
    fs        = require("fs"),
    restify   = require("restify"),
    validator = require("restify-joi-middleware");

const routes  = require("./routes");

exports.initialize = (config) => {
    return new Promise((resolve, reject) => {
        if (!config.webserver) {
            return reject("No webserver configured");
        }

        let server_options = null;

        // Check HTTPS options
        if (config.webserver.https) {
            server_options = {
                key: fs.readFileSync("ssl/ssl.key"),
                certificate: fs.readFileSync("ssl/ssl.crt")
            };
        }

        const server = restify.createServer(server_options);
        log.info("Initializing server");

        // Configure plugin middleware
        server.use(restify.plugins.acceptParser(server.acceptable));
        server.use(restify.plugins.queryParser({ mapParams: true }));
        server.use(restify.plugins.bodyParser({ mapParams: true }));
        server.use(restify.plugins.authorizationParser());
        server.use(restify.plugins.fullResponse());
        server.use(validator({
            convert: true,
            allowUnknown: true,
            abortEarly: true
        }));

        if (config.webserver.whitelist.use) {
            // Whitelisting middleware
            server.use((req, res, next) => {
                const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

                if (config.webserver.whitelist.hosts.indexOf(ip) > -1) {
                    return next();
                }

                return next(new errors.ForbiddenError(`${ip} is not allowed`));
            });
        }

        if (config.webserver.auth.use) {
            // Simple Basic Auth Middleware
            server.use((req, res, next) => {
                const users = {
                    "test": "test"
                };

                const auth = typeof req.authorization.basic !== "undefined";
                const username = auth ? users[req.authorization.basic.username] : false;
                const pwdMatch = auth ? req.authorization.basic.password === users[username] : false;

                const hasAccess = auth && username && pwdMatch;

                if (hasAccess) {
                    return next();
                }

                return next(new errors.UnauthorizedError("You must provide a valid username and password"));
            });
        }

        if (config.webserver.throttle.use) {
            // API throttling middleware
            server.use(restify.plugins.throttle({
                rate: restify.plugins.throttle.rate,
                burst: restify.plugins.throttle.burst,
                xff: restify.plugins.throttle.xff
            }));
        }

        server.on("NotFound", (req, res, err, cb) => {
            // do not call res.send! you are now in an error context and are outside
            // of the normal next chain. you can log or do metrics here, and invoke
            // the callback when you're done. restify will automtically render the
            // NotFoundError as a JSON response.
            return cb();
        });

        server.on("restifyError", (req, res, err, cb) => {
            // this listener will fire after both events above!
            // `err` here is the same as the error that was passed to the above
            // error handlers.
            return cb();
        });

        // Error handler to catch all errors and forward to the logger set above.
        // server.on("uncaughtException", (req, res, route, err) => {
        //     log.error(err.stack);
        //     res.send(err);
        // });

        // Register routes
        routes.register(server, config);

        log.info(`Creating server for '${config.client.env}' environment`);
        log.debug(config, "Config");
        server.listen(config.webserver.port, config.webserver.host, (err) => {
            if (err) {
                reject(err);
            }
            resolve(server);
        });
    });
};
