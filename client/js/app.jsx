/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
require('../css/tf-styles.css');

var React = require('react');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var IndexRoute = ReactRouter.IndexRoute;;
var createBrowserHistory = require('history/lib/createBrowserHistory');
var TrakfireApp = require('./components/TrakfireApp.jsx');
var PostsPage = require('./components/PostsPage.jsx');
var ProfilePage = require('./components/ProfilePage.jsx');
var PostForm = require('./components/PostForm.jsx');
var EmailAcquirePage = require('./components/EmailAcquirePage.jsx');

React.render(
<Router history={createBrowserHistory()}>
    <Route path='/' component={TrakfireApp}>
      <IndexRoute component={PostsPage}/>
      <Route path='/profile' component={ProfilePage} />
      <Route path='/post' component={PostForm} />
    </Route>
    <Route path='/email' component={EmailAcquirePage} />
  </Router>,

  document.getElementById('trakfireapp')
);
