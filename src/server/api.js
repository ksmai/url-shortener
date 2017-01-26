'use strict';
const express = require('express');

module.exports = function(Url) {
  const api = express.Router();
  api.get('/new/*', function(req, res) {
    Url.findOneAndUpdate({url: req.params[0]}, {url: req.params[0]},
                          {upsert: true, new: true},
                          function(err, doc) {
                            if(err) {
                              res.status(400).json({
                                error: err.toString()
                              }).end();
                            }
                            res.json({
                              url: `/short/${doc.token}`
                            }).end();
                          }
    );
  });

  api.get('/short/:token', function(req, res) {
    res.send('/short/' + req.params.token);
  });

  api.use(function(err, req, res, next) {
    res.status(500).end();
  });

  return api;
}
