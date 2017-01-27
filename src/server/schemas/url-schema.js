'use strict';
const mongoose = require('mongoose');

const urlSchema = {
  url: {
    type: String,
    match: require('../../util/url-reg-exp'),
    required: true,
    unique: true
  }
};

const schema = new mongoose.Schema(urlSchema);
schema.virtual('token').get(function() {
  return this._id;
});
schema.set('toObject', {virtuals: true});
schema.set('toJSON', {virtuals: true});
module.exports = {
  name: 'Url',
  schema: schema,
  collection: 'urls',
  options: urlSchema
};
