'use strict';
const express = require('express');

module.exports = function(Url) {
  const api = express.Router();
  api.get('/new/*', function(req, res) {
    Url.findOneAndUpdate({url: req.params[0]}, {$set: {url: req.params[0]}},
                          {upsert: true, new: true, runValidators: true},
                          function(err, doc) {
                            if(err) {
                              res.status(400).json({
                                error: `Fail to shorten ${req.params[0]}`
                              }).end();
                            }
                            else {
                              res.json({
                                url: `/short/${doc.token}`
                              }).end();
                            }
                          }
    );
  });

  api.get('/short/:token', function(req, res) {
    var ObjectId = require('mongoose').Types.ObjectId;
    Url.findOne({_id: new ObjectId(req.params.token)}, function(err, doc) {
      if(err || !doc) {
        return res.status(404).json({error: 'Not found!'}).end();
      }
      let url = doc.url;
      url = /^https?:\/\//.test(url) ? url : `http://${url}`;
      res.redirect(url);
    });
  });

  api.use(function(err, req, res, next) {
    res.status(500).json({
      error: 'Error!'
    }).end();
  });

  return api;
}
