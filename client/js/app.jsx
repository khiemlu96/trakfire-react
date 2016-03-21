/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
require('../css/tf-styles.css');
require('../css/admin.css');

var React = require('react');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var IndexRoute = ReactRouter.IndexRoute;;
var createBrowserHistory = require('history/lib/createBrowserHistory');
var hashHistory = require('history/lib/createHashHistory');
var TrakfireApp = require('./components/TrakfireApp.jsx');
var PostsPage = require('./components/PostsPage.jsx');
var ProfilePage = require('./components/ProfilePage.jsx');
var PostForm = require('./components/PostForm.jsx');
var AboutPage = require('./components/static/AboutPage.jsx');
var PrivacyPolicy = require('./components/static/PrivacyPolicy.jsx');
var TermsOfUse = require('./components/static/TermsOfUse.jsx')
var EmailAcquirePage = require('./components/EmailAcquirePage.jsx');
var PostDetailPage = require('./components/PostDetailPage.jsx');
var SearchResultPage = require('./components/SearchResultPage.jsx');
var NotificationPage = require('./components/NotificationPage.jsx');
var AdminPage = require('./components/admin/AdminPage.jsx');
var DashBoardPage = require('./components/admin/DashBoardPage.jsx');
var AdminUserPage = require('./components/admin/AdminUserPage.jsx');
var AdminPostsPage = require('./components/admin/AdminPostsPage.jsx');
var AdminBannerImagePage = require('./components/admin/AdminBannerImagePage.jsx');

React.render(
  <Router history={hashHistory()}>
    <Route path='/' component={TrakfireApp}>
      <IndexRoute component={PostsPage}/>
      <Route path='/profile/(:id)' component={ProfilePage} />
      <Route path='/post' component={PostForm} />
      <Route path='/email' component={EmailAcquirePage} />
      <Route path='/about' component={AboutPage}/>
      <Route path='/terms' component={TermsOfUse}/>
      <Route path='/privacy' component={PrivacyPolicy}/>
      <Route path='/post/(:id)' component={PostDetailPage} />
      <Route path='/searchresult/(:searchkey)' component={SearchResultPage} />
      <Route path='/notification' component={NotificationPage} />
      <Route name="base" path='/admin' component={AdminPage}>
        <IndexRoute component={DashBoardPage} />
        <Route name="admin.dashboard" path='/admin/dashboard' component={DashBoardPage} />
        <Route name="admin.user" path='/admin/users' component={AdminUserPage} />
        <Route name="admin.post" path='/admin/posts' component={AdminPostsPage} />
        <Route name="admin.images" path='/admin/images' component={AdminBannerImagePage} />
      </Route>
    </Route>    
  </Router>,

  document.getElementById('trakfireapp')
);
