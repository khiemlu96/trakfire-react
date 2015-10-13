/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
require('../css/app.css');
require('../css/tf-styles.css');
require('basscss');
require('bootstrap');

var React = require('react');
var TrakfireApp = require('./components/TrakfireApp.jsx');
var LocalPostData = require('./LocalPostData');
var PostUtils = require('./utils/PostUtils');
var TrakfireWebApiUtils = require('./utils/TrakfireWebApiUtils');
var PostActions = require('./actions/PostActions');
var Router = require('react-router');
var routes = require('../config/routes.jsx');
//LocalPostData.init();
//TrakfireWebApiUtils.();

/*React.render(
  <TrakfireApp />,
  document.getElementById('trakfireapp')
);*/

Router.run(routes, Router.HistoryLocation, function(Handler) {
  React.render(<Handler/>, document.getElementById('trakfireapp'));
});
