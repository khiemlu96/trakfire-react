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
var LeaderBoardItems = require('./LeaderBoardItems.jsx');

function getAppState() {
  return {
   	users: UserStore.getAll()
  };
}

function sortScore(a, b) {
  if(a.score > b.score) return -1;
  else if(a.score < b.score) return 1;
  else if(a.score == b.score){
    return -1;
  }
}

var LeaderBoard = React.createClass({


  getInitialState: function() { return getAppState(); }, 

  componentDidMount: function() {
  	console.log(this.state.users);
  },

  renderUserItems: function(sortedUsers) {
  	var leaderBoardItems = [];
  	for(i in sortedusers) {
  		var u = sortedUsers[i];
  		var uItem = <LeaderBoardItem user={u}/>
  		leaderBoardItems.push(uItem);
  	}
  	return leaderBoardItems;
  }, 

  /**
   * @return {object}
   */
  render: function() {
  	var users = this.state.users;
  	var userItems = this.renderUserItems(users.sort(sortByScore));
    return (
	    <ul class="media-list media-list-users list-group">
	    	{ userItems }
	    </ul>
    );
  }

});

module.exports = LeaderBoard;


