/**
 * Created by LuKa on 2017-09-30.
 * Route Definitions.
 */

"use strict";

const
    Joi     = require("joi"),
    restify = require("restify"),
    helpers = require("../helpers"),
    users   = require("../handlers/users");

exports.register = (server, config) => {
    // Configure routes
    server.get({
        url: "/api"
    }, (req, res, next) => {
        helpers.replySuccess(res, next, 200, config.client);
    });

    server.get({
        url: "/api/users"
    }, users.findAll);

    server.get({
        url: "/api/users/:id",
        validation: {
            params: Joi.object().keys({
                id: Joi.string().required()
            }).required(),
        }
    }, users.findById);

    server.post({
        url: "/api/users",
        validation: {
            body: Joi.object().keys({
                firstName: Joi.string().required(),
                lastName:  Joi.string().required(),
                email:     Joi.string().email().required(),
                kind:      Joi.string().required().allow(["programmer", "manager"])
            }).required()
        }
    }, users.add);


    server.put({
        url: "/api/users/:id",
        validation: {
            params: Joi.object().keys({
                id: Joi.string().required()
            }).required(),
            body: Joi.object().keys({
                firstName: Joi.string().required(),
                lastName:  Joi.string().required(),
                email:     Joi.string().email().required(),
                kind:      Joi.string().required().allow(["programmer", "manager"])
            }).required()
        }
    }, users.update);

    server.del({
        url: "/api/users/:id",
        validation: {
            params: Joi.object().keys({
                id: Joi.string().required()
            }).required()
        }
    }, users.destroy);

    if (config.webserver.servePublic) {
        server.get(/\/\/?.*/, restify.plugins.serveStatic({
            appendRequestPath: false,
            directory: "./public",
            default: "index.html"
        }));
    }
};