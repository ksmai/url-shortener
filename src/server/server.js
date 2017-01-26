'use strict';
const express = require('express');
const path = require('path');
const api = require('./api');
const wagner = require('wagner-core');

const app = express();
const binPath = path.join(__dirname, '../../bin');
const assetPath = path.join(__dirname, '../../asset');

require('./db')(wagner);

app.use(express.static(binPath));
app.use(express.static(assetPath));
app.get('/', function(req, res) {
  res.sendFile('index.html', {
    root: binPath
  }); 
});

app.use('/api', wagner.invoke(api));
app.use(function(err, req, res, next) {
  res.status(500).end();
});

module.exports = app;
