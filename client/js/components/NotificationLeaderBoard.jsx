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
var UserStore = require('../stores/UserStore');
var Link = require('react-router').Link;

var classNames = require('classnames');
var UserFlyOver = require('./UserFlyOver.jsx');
var NotificationLeaderBoardItem = require('./NotificationLeaderBoardItem.jsx');

function getComponentState() {
  return {
    users: UserStore.getAllUsers(),
    currentUser: UserStore.getCurrentUser()
  };
}

function sortByScore(a, b) {
  if(a.score > b.score) return -1;
  else if(a.score < b.score) return 1;
  else if(a.score == b.score){
    return -1;
  }
}

var NotificationLeaderBoard = React.createClass({

  propTypes: {
    origin: ReactPropTypes.string
  }, 

  getInitialState: function() { return getComponentState(); }, 

  componentDidMount: function() {
    console.log(this.state.users);
    UserStore.addChangeListener(this._onChange);
    UserActions.getAllUsers(this.props.origin+'/users', {limit:5, offset:1});
  },

  renderUserItems: function(sortedUsers) {
    var leaderBoardItems = [];
  
    for(i in sortedUsers) {
      var u = sortedUsers[i];
      var uItem = <NotificationLeaderBoardItem user={u} origin={this.props.origin} currentUser={this.state.currentUser}/>
      leaderBoardItems.push(uItem);
    }
    return leaderBoardItems;
  }, 

  /**
   * @return {object}
   */
  render: function() {
    
    var users = this.state.users;
    [].sort.call(users, sortByScore)
    var userItems = this.renderUserItems([].sort.call(users, sortByScore));
    return (
      <div>
      <h5 className="tf-media-list-header">TASTEMAKERS</h5>
      <ul className="media-list media-list-users list-group">
        { userItems }
      </ul>
      </div>
    );
  }, 

  _onChange: function() {
    this.setState(getComponentState());
  }

});

module.exports = NotificationLeaderBoard;


