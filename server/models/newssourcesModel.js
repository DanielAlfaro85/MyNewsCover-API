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
const newsSource = new Schema ({
    url: {type: String},
    nameSource: {type: String},
    categoryID: {type: String},
    userID: {type: String}
});

/**
 * Model
 */
module.exports = mongoose.model("newsSources", newsSource);
