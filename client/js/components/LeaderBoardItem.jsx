//leader board item 
/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var UserActions = require('../actions/UserActions');

var Link = require('react-router').Link;

var classNames = require('classnames');
var UserFlyOver = require('./UserFlyOver.jsx');

var LeaderBoardItem = React.createClass({

  propTypes: {
  	user : ReactPropTypes.object
  },

  componentDidMount: function() {},

  componentWillMount: function() {}, 


  /**
   * @return {object}
   */
  render: function() {
  	var user = this.props.user;
  	console.log(user);
    return (
	  <li className="list-group-item tf-user">
	    <div className="media">
	      <a className="media-left" href="#">
	        <img className="media-object img-circle" src={user.img}></img>
	      </a>
	      <div className="media-body">
	        <button className="btn btn-primary-outline btn-sm pull-right">
	         Follow
	        </button>
	        <strong>{ user.name }</strong>
	        <br></br>
	        <small>{ user.score ? user.score : 0 }</small>
	      </div>
	    </div>
	  </li>
    );
  }

});

module.exports = LeaderBoardItem;


