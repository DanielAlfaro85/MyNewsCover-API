/**
 * Database connection
 */
const mongoose = require("mongoose");

/**
 * Schema creation
 */
const Schema = mongoose.Schema;

/**
 * Schema´s data
 */
const categories = new Schema ({
    nameCategory: {type: String}
});

/**
 * Model
 */
module.exports = mongoose.model("categories", categories);
