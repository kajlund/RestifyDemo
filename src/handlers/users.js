/**
 * Created by LuKa on 2017-09-30.
 * User route handlers
 */

 "use strict";

const
    errors  = require("restify-errors"),
    helpers = require("../helpers");

const User = require("../models/user");

exports.findAll = (req, res, next) => {
    User.find()
        .exec()
        .then((users) => {
            helpers.replySuccess(res, next, 200, users);
        }).catch((err) => {
            return next(new errors.BadRequestError(JSON.stringify(err)));
        });
};

exports.findById = (req, res, next) => {
    const id = req.params.id;

    User.findById(id, (err, user) => {
        if (err) {
            return next(new errors.BadRequestError(JSON.stringify(err)));
        }

        if (!user) {
            return next(new errors.NotFoundError(`User with id ${id} was not found`));
        }

        helpers.replySuccess(res, next, 200, user);
    });
};

exports.add = (req, res, next) => {
    const user = new User(req.params);
    user.save((err, data) => {
        if (err) {
            return next(new errors.BadRequestError(JSON.stringify(err)));
        }
        helpers.replySuccess(res, next, 201, data);
    });
};

exports.update = (req, res, next) => {
    const id = req.params.id;

    delete req.params.id;
    User.findByIdAndUpdate(id, req.params,
        { new: true, upsert: false, runValidators: true }, (err, user) => {

        if (err) {
            return next(new errors.BadRequestError(JSON.stringify(err)));
        }

        if (!user) {
            return next(new errors.NotFoundError(`User with id ${id} was not found`));
        }

        helpers.replySuccess(res, next, 200, user);
    });
};

exports.destroy = (req, res, next) => {
    const id = req.params.id;

    User.findByIdAndRemove(id, (err) => {
        if (err) {
            return next(new errors.BadRequestError(`Failed to remove User with id "${id}"`));
        }

        helpers.replySuccess(res, next, 204, []);
    });
};
