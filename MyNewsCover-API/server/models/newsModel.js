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
const news = new Schema ({
    title: {type: String},
    short_description: {type: String},
    permanlink: {type: String},
    date: {type: String},
    news_source_id : {type: String},
    user_id: {type: String},
    category_id: {type: String},
    tags: {type: []}
});

/**
 * Model
 */
module.exports = mongoose.model("news", news);
