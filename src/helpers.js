/**
 * Created by LuKa on 2017-09-30.
 * Helper functions.
 */

 "use strict";

const reply = (res, next, code, message, data) => {
    let response = null;

    if (data.constructor === Array) {
        response = {
            count: data.length,
            results: data
        };
    } else {
        response = data;
    }

    res.setHeader("content-type", "application/json");
    res.send(code, response);

    return next();
};

exports.replySuccess = (res, next, code, data) => {
    reply(res, next, code, "OK", data);
};

exports.failure = (res, next, code, err) => {
    let data = "";
    if (err instanceof Error) {
        data = err.message;
    }

    reply(res, next, code, "failure", data);
};

exports.error = (next, err) => {
    return next(err);
};
