'use strict';
const express = require('express');
const wagner = require('wagner-core');
const superagent = require('superagent');
const assert = require('chai').assert;

const conn = require('./db')(wagner);
const PORT = 3000;
const BASE = `http://localhost:${PORT}`;

describe('API', function() {
  var app, server;
  before(function() {
    app = express();
    app.use(wagner.invoke(require('./api')));
    server = app.listen(PORT);
  });

  after(function(done) {
    conn.disconnect(function() {
      server.close(function() {
        done();
      });
    });
  });

  beforeEach(function(done) {
    wagner.invoke(function(Url) {
      Url.remove({}, function(err) {
        assert.ifError(err);
        done();
      });
    });
  });

  it('can register a new url', function(done) {
    var urls = [
      'https://www.google.com/',
      'github.com',
      'https://www.npmjs.com/package/superagent'
    ];
    var cnt = 0;
    for(let url of urls) {
      superagent.get(`${BASE}/new/${url}`)
                .end(function(err, res) {
                  assert.ifError(err);
                  assert.equal(res.status, 200);
                  assert.property(JSON.parse(res.text), 'url');
                  if(++cnt === urls.length) done();
                });
    }
  });

  it('can reject invalid url', function(done) {
    var urls = [
      'hello',
      ':::::::::',
      'https://www.google.com/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    ];
    var cnt = 0;
    for(let url of urls) {
      superagent.get(`${BASE}/new/${url}`)
                .end(function(err, res) {
                  assert.isOk(err);
                  assert.equal(res.status, 400);
                  assert.property(JSON.parse(res.text), 'error');
                  if(++cnt === urls.length) done();
                });
    }
  });

  it('can look up shortened URLs', function(done) {
    var urls = [
      'https://www.google.com/',
      'github.com/ksmai',
      'http://mongoosejs.com/docs/validation.html',
      'http://stackoverflow.com/questions/31101984/mongoose-findoneandupdate-and-runvalidators-not-working'
    ];
    var cnt = 0;
    for(let url of urls) {
      superagent
        .get(`${BASE}/new/${url}`)
        .end(function(err, res) {
            assert.ifError(err);
            assert.equal(res.status, 200);
            assert.property(JSON.parse(res.text), 'url');
            superagent
              .get(`${BASE}${JSON.parse(res.text).url}`, function(err, res) 
              {
                assert.ifError(err);
                assert.equal(res.status, 200);
                assert.property(res, 'redirects');
                var redirects = res.redirects;
                assert.ok( Array.isArray(redirects) );
                assert.ok( redirects.length );
                assert.notEqual( redirects[0].indexOf(url) , -1 );
                if(++cnt === urls.length) done();
              });
        });
    }
  });
    
  it('returns 404/500 for unknown/invalid short URLs', function(done) {
    var tokens = [
      'helloWorld',
      'awevav34v34vev4375868588',
      '588ace7b4c9850473518802d',
      '588ae6934c9850473518824c'
    ];
    var cnt = 0;
    for(let token of tokens) {
      superagent.get(`${BASE}/short/${token}`)
      .end(function(err, res) {
        assert.ok(err);
        assert.include([404, 500], res.status);
        assert.property(JSON.parse(res.text), 'error');
        if(++cnt === tokens.length) done();
      });
    }
  });
});

