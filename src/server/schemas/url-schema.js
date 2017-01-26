'use strict';
const mongoose = require('mongoose');
const urlSchema = {
  url: {
    type: String,
    match: /^(https?:\/\/)?[a-zA-Z0-9?=.\/\-&()~:_#|'";,]+$/,
    required: true
  }
};

const schema = new mongoose.Schema(urlSchema);
schema.virtual('token').get(function() {
  return this._id.toString().slice(0, 8);
});
schema.set('toObject', {virtuals: true});
schema.set('toJSON', {virtuals: true});
module.exports = {
  name: 'Url',
  schema: schema,
  collection: 'urls',
  options: urlSchema
};
