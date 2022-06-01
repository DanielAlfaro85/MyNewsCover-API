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
 const tags = new Schema ({
     name: {type: String},
     user_id: {type: String}
 });
 
 /**
  * Model
  */
 module.exports = mongoose.model("tags", tags);
 