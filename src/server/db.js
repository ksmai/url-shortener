'use strict';
const config = require('../../config.json');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const schemas = require('./schemas');
const dbUri = process.env.DATABASE_URL || config.DATABASE_URL ||
              'mongodb://localhost:27017/test';

module.exports = function(wagner) {
  const conn = mongoose.connect(dbUri);

  for(let schema of schemas) {
    wagner.factory(schema.name, function() {
      return mongoose.model(
        schema.name, schema.schema, schema.collection
      );
    });
  }

  return conn;
};
