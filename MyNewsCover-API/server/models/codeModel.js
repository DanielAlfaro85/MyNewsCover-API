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
 const code = new Schema ({
     code: {type: String},
     user_id: {type: String}
 });
 
 /**
  * Model
  */
 module.exports = mongoose.model("code", code);