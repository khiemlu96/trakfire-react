var React = require('react');
var Router = require('react-router');
var App = require('../js/app.jsx');
var PostPage = require('../js/components/TrakfireApp.jsx');
var AboutPage = require('../js/components/static/AboutPage.jsx');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;

module.exports = (
  <Route name="app" path="/" handler={PostPage}>
    <DefaultRoute name="posts" handler={PostPage} />
    <Route name="about" handler={AboutPage} />
  </Route>
);