/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var IndexRoute = ReactRouter.IndexRoute;;
var browserHistory = ReactRouter.browserHistory;
var hashHistory = ReactRouter.hashHistory;
var TrakfireApp = require('./components/TrakfireApp.jsx');
var PostsPage = require('./components/PostsPage.jsx');
var ProfilePage = require('./components/ProfilePage.jsx');
var PostForm = require('./components/PostForm.jsx');
var AboutPage = require('./components/static/AboutPage.jsx');
var FAQ = require('./components/static/FAQ.jsx');
var JobBoard = require('./components/static/JobBoard.jsx');
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
var AdminRequestInvitesListPage = require('./components/admin/AdminRequestInvitesListPage.jsx');
var AdminWhiteListUserPage = require('./components/admin/AdminWhiteListUserPage.jsx');

React.render(
  <Router history={browserHistory}>
    <Route path='/' component={TrakfireApp}>
      <IndexRoute component={PostsPage}/>
      <Route path='/profile/(:id)' component={ProfilePage} />
      <Route path='/post' component={PostForm} />
      <Route path='/email' component={EmailAcquirePage} />
      <Route path='/about' component={AboutPage}/>
      <Route path='/faq' component={FAQ}/>
      <Route path='/jobboard' component={JobBoard}/>
      <Route path='/terms' component={TermsOfUse}/>
      <Route path='/privacy' component={PrivacyPolicy}/>
      <Route path='/post/(:id)' component={PostDetailPage} />
      <Route path='/searchresult/(:searchkey)' component={SearchResultPage} />
      <Route path='/notifications' component={NotificationPage} />
      <Route name="base" path='/admin' component={AdminPage}>
        <IndexRoute component={DashBoardPage} />
        <Route name="admin.dashboard" path='/admin/dashboard' component={DashBoardPage} />
        <Route name="admin.user" path='/admin/users' component={AdminUserPage} />
        <Route name="admin.post" path='/admin/posts' component={AdminPostsPage} />
        <Route name="admin.images" path='/admin/images' component={AdminBannerImagePage} />
        <Route name="admin.request_invite" path='/admin/request_invite' component={AdminRequestInvitesListPage} />
        <Route name="admin.whitelist_users" path='/admin/whitelist_users' component={AdminWhiteListUserPage} />
      </Route>
    </Route>    
  </Router>,

  document.getElementById('trakfireapp')
);
