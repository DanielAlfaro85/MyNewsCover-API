/**
 * Database connection
 */
const mongoose = require('mongoose');

/**
 * Schema creation
 */
const Schema = mongoose.Schema;

/**
 * Schema´s data
 */
const user = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },
  country: { type: String },
  city: { type: String },
  postalCode: { type: String },
  phoneNumber: { type: String },
  role: { type: String },
  enable: { type: Boolean }
});

/**
 * Model
 */
module.exports = mongoose.model('user', user);