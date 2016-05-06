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

var FollowButtonStyle = {
  backgroundColor: 'transparent' 
}
var FollowingButtonStyle = {
  backgroundColor: '#ff0d60' 
}

var nodecor = {
  color: "#fff"
}

var LeaderBoardItem = React.createClass({

  propTypes: {
  	user: ReactPropTypes.object,
  	origin: ReactPropTypes.string,
    showModal: ReactPropTypes.func
  },

  getInitialState: function(){
  	return{
  		isFollowing: false,
      currentUser: UserStore.getCurrentUser()
  	};
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
  },

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
    if(!this.state.currentUser) {
      this.props.showModal();
      return;
    }
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
  	var currentUser = this.state.currentUser;

    var isFollowing = false;
  	if(currentUser !== null && user !== null) {
        for(var key in currentUser.followings) {
          if(currentUser.followings[key].id === user.id) {
            isFollowing = true;
          }
        }
    }
    var followBtnHtml = <button className = "btn btn-primary-outline btn-sm pull-right" style = {isFollowing ? FollowingButtonStyle : FollowButtonStyle} onClick = {this.followClick}>
                    {isFollowing ? "Following" : "Follow"} 
                    </button>;
    // Do not show Edit Follow Button if user is not logged in
    if( !UserStore.isSignedIn() || (currentUser !== null && user.id === currentUser.id)) {
        // Do not show Edit Profile Button if user is not logged in
        //var showFolloweBtn = true;
        followBtnHtml = <button className = "btn btn-primary-outline btn-sm pull-right" style = {FollowButtonStyle} onClick = {this.followClick}>
                    {"Follow"} 
                    </button>;
    } else if (currentUser !== null && user.id !== currentUser.id) {
        // Do not show Edit Profile Button if user is not on its own profile page
        //var showFolloweBtn = true;
        followBtnHtml = <button className = "btn btn-primary-outline btn-sm pull-right" style = {isFollowing ? FollowingButtonStyle : FollowButtonStyle} onClick = {this.followClick}>
                    {isFollowing ? "Following" : "Follow"} 
                    </button>;
    }
    //console.log("FOLLOWER", followBtnHtml)
    var profileLink = '/profile/' + user.id;
    return (
	  <li className="list-group-item tf-user">
	    <div className="media">
	      <Link to={profileLink} className="media-left">
	        <img className="media-object img-circle" src={user.img}></img>
	      </Link>
	      <div className="media-body">
	        {followBtnHtml}
	        <strong><Link to={profileLink} className="nd" style={nodecor}>{ user.name }</Link></strong>
	        <br></br>
	        <small>{ user.score ? user.score : 0 }</small>
	      </div>
	    </div>
	  </li>
    );
  },
  _onChange: function() {
      this.setState({
        currentUser: UserStore.getCurrentUser()
      });
  }
});

module.exports = LeaderBoardItem;


