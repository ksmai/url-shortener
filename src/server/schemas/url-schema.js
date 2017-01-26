'use strict';
const mongoose = require('mongoose');

const urlRegExp = /(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,63}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?/;

const urlSchema = {
  url: {
    type: String,
    match: urlRegExp,
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
