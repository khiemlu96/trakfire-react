/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var PostActions = require('../actions/PostActions');
var ReactPropTypes = React.PropTypes;

var NavBar = React.createClass({

  propTypes: {
    isLoggedIn: ReactPropTypes.bool,
    origin: ReactPropTypes.string,
    openModal: ReactPropTypes.func,
  },

  handleSignOut: function() {
    sessionStorage.setItem('jwt','');
    location = '/';
  },

  showModal: function() {
    this.props.showModal(true);
  },
  /**
   * @return {object}
   */
  render: function() {
    if(this.props.isLoggedIn) {
      var signinLink = <a href="#!" onClick={this.handleSignOut} className="btn py2 m0"> Sign Out </a>
      var postLink = <button type="button" className="btn py2 m0" onClick={this.showModal}>Post</button>
    } else {
      var signinLink = <a href={ 'http://localhost:3000/request_token'} className="btn py2 m0"> Sign In </a>
      var postLink = '';
    }
    return (
      <div className="clearfix mb2 white bg-red">
        <div className="left">
          <a href="#!" class="btn py2 m0">Trakfire</a>
        </div>
        <div className="right">
          {postLink}
          {signinLink}
        </div>
        <div className="clearfix sm-hide"></div>
        <div className="overflow-hidden px2 py1">
          <input type="text" className="right fit field white bg-darken-1" placeholder="Search"/>
        </div>
      </div>
      );
  }


});

module.exports = NavBar;