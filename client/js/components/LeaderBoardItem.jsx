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
var UserActions = require('../actions/UserActions.js');
var UserStore = require('../stores/UserStore.js');

var Link = require('react-router').Link;

var classNames = require('classnames');
var UserFlyOver = require('./UserFlyOver.jsx');


var LeaderBoardItem = React.createClass({

  propTypes: {
  	user: ReactPropTypes.object,
  	origin: ReactPropTypes.string,
  	currentUser: ReactPropTypes.object
  },

  getInitialState: function(){
  	return{
  		isFollowing: false
  	};
  },

  componentDidMount: function() {},

  componentWillMount: function() {}, 
  
  followUser: function() {
  	var follow_id = this.props.user.id;
  	UserActions.followUser(this.props.origin+ '/follower', follow_id);
  },
  
  unFollowUser: function() {
  	var follow_id = this.props.user.id;
  	UserActions.unFollowUser(this.props.origin+ '/follower', follow_id);
  },
  
  followClick: function(){
  	if(!this.state.isFollowing){
  		this.followUser();
        this.state.isFollowing = true;
  	}
  	else{
  		this.unFollowUser();
  		this.state.isFollowing = false;
  	}
  },
  /**
   * @return {object}
   */
  render: function() {
  	var user = this.props.user;
  	var currentUser = this.props.currentUser;
  	console.log(user);

  	if(currentUser !== null && user !== null) {
        for(var key in currentUser.followings) {
            if(currentUser.followings[key].id === user.id) {
                this.state.isFollowing = true;
            }
        }
    }
    var profileLink = '/profile/' + user.id;
    return (
	  <li className="list-group-item tf-user">
	    <div className="media">
	      <a className="media-left" href="#">
	        <img className="media-object img-circle" src={user.img}></img>
	      </a>
	      <div className="media-body">
	        <button className="btn btn-primary-outline btn-sm pull-right" onClick={this.followClick}>
	         {this.state.isFollowing ? "Following" : "Follow"}
	        </button>
	        <strong><Link to={profileLink}>{ user.name }</Link></strong>
	        <br></br>
	        <small>{ user.score ? user.score : 0 }</small>
	      </div>
	    </div>
	  </li>
    );
  }

});

module.exports = LeaderBoardItem;


