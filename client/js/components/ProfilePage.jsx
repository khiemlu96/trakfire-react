/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var PostActions = require('../actions/PostActions');
var ProfileHeader = require('./ProfileHeader.jsx');
var PostGrid = require('./PostGrid.jsx');
var ReactPropTypes = React.PropTypes;
var _user = { 
      name: 'Grant Collins', 
      handle: "lilcpu",
      tLink: "http://twitter.com/lilcpu", 
      description: "Hi my name is g money", 
      img: "https://pbs.twimg.com/profile_images/647921734167822336/XguQDA-x_bigger.png" 
};

var ProfilePage = React.createClass({

  /*propTypes: {
    currentUser: ReactPropTypes.object.isRequired
  },*/
  componentWillMount: function(){
    //PostActions.getUserPosts(_user.handle);
  }
  /**
   * @return {object}
   */
  render: function() {

    return (
      <div>
        <ProfileHeader currentUser={_user}/>
      </div>
    );
  },


});

module.exports = ProfilePage;
