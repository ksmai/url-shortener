'use strict';
const assert = require('chai').assert;
const mongoose = require('mongoose');
const urlSchema = require('./url-schema.js').schema;

describe('url schema', function() {
  var Url;

  before(function(done) {
    mongoose.connect('mongodb://localhost:27017/test', function(err) {
      if(!err) {
        Url = mongoose.model('Url', urlSchema, 'urls');
        done();
      }
    });
  });

  beforeEach(function(done) {
    Url.remove({}, function(err) {
      if(!err) done();
    });
  });

  after(function(done) {
    Url.remove({}, function(err) {
      if(!err) {
        mongoose.disconnect(function(err) {
          if(!err) done();
        });
      }
    });
  });

  it('rejects empty/invalid urls', function(done) {
    new Url().save(function(err) {
      assert.isOk(err);
      new Url({url: 'http://!@$'}).save(function(err) {
        assert.isOk(err);
        done();
      });
    });
  });

  it('returns unique token after insertion', function(done) {
    new Url({url: 'google.com'}).save(function(err) {
      assert.ifError(err);
      Url.findOne({url: 'google.com'}).exec(function(err, data) {
        assert.isOk(data.token);
        done();
      });
    });
  });

});
