/**
 * Copyright 2014 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express'),
  app = express(),
  bluemix = require('./config/bluemix'),
  TradeoffAnalytics = require('./tradeoff-analytics'),
  extend = require('util')._extend;

// Bootstrap application settings
require('./config/express')(app);

// if bluemix credentials exists, then override local
var credentials;
//Grab credentials from bluemix environment
if (process.env.VCAP_SERVICES) {
  credentials = extend({
    url: '<url>',
    username: '<username>',
    password: '<password>'
  }, bluemix.getServiceCreds('tradeoff_analytics')); // VCAP_SERVICES
} else {
  //Grab local credentials
  credentials = require('./config/tradeoff-analytics');
}

// Create the service wrapper
var tradeoffAnalytics = new TradeoffAnalytics(credentials);

// render index page
app.get('/', function(req, res) {
  res.render('index');
});

app.post('/', function(req, res) {
  tradeoffAnalytics.dilemmas(req.body, function(err, dilemmas) {
    if (err)
      return res.status(err.code || 500).json(err.error || 'Error processin the request');
    else
      return res.json(dilemmas);
  });
});

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);
