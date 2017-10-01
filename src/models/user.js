/**
 * Created by LuKa on 2017-09-30.
 * Define User model.
 */

"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id: Schema.ObjectId,
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    kind: { type: String, required: true, trim: true }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", UserSchema);
