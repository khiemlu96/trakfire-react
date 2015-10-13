/*var TF = require('./TrakfireApp.jsx');
var NavBar = require('./NavBar.jsx');
var React = require('react');
var Router = require('react-router');
var Uri = require('jsuri');
var RouteHandler = Router.RouteHandler;

module.exports = React.createClass({
  getDefaultProps: function() {
    return {origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''};
  },

  getInitialState: function() {
    return {
      isLoggedIn: false
    };
  },

  handleMenuClick: function() {
    this.setState({showMenu: !this.state.showMenu});
  },

  readFromAPI: function(url, successFunction) {
    PostActions.getPostBatch(url, successFunction);
  },

  render: function () {
    var menu = this.state.showMenu ? 'show-menu' : 'hide-menu';

    return (
      <div id="app" className={menu}>
        <div id="tf-nav"><NavBar isLoggedIn={this.state.isLoggedIn}></NavBar></div>
        <div id="tf-content">
          <RouteHandler origin={this.props.origin} readFromAPI={this.readFromAPI}/>
        </div>
      </div>
    );
  }
});*/