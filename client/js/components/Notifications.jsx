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
var PostActions = require('../actions/PostActions');

var Link = require('react-router').Link;
var ProfileBar = require('./ProfileBar.jsx');
var classNames = require('classnames');

var isPlaying = classNames("tf-post-item is-playing");
var isNotPlaying = classNames("tf-post-item");
var isUpvoted = classNames("tf-post-item--votes is-upvoted");
var isNotUpvoted = classNames("tf-post-item--votes");
var _localVoteCount = 0;

var Notifications = React.createClass({

  propTypes: {
   key: ReactPropTypes.string,
   post: ReactPropTypes.object,
   idx: ReactPropTypes.number,
   onClick: ReactPropTypes.func,
   onUpvote: ReactPropTypes.func,
   isLoggedIn: ReactPropTypes.bool, 
   userId: ReactPropTypes.number,
   isUpvoted: ReactPropTypes.bool,
   rank: ReactPropTypes.string,
   currStreamUrl: ReactPropTypes.string, 
   showModal: ReactPropTypes.func
  },

  getInitialState: function() {
    return {isPlaying:false, isUpvoted:false, hasUpvoted:false};
  }, 

  componentDidMount: function() {
    console.log("POST LIST ITEM PROPS", this.props);
    this.state.isUpvoted = this.props.isUpvoted;
  },

  componentWillMount: function() {
    //this.hasUpvoted("WILL MOUNT", this.props.post);

  }, 

  renderNotifications: function(){
    return <div className='container'>
            <div className="tf-post-item-content">
              <div className="">
                <div className="" >
                  <div className="tf-notification-auther">
                     <Link to={'/profile/'+2} className="tf-link">
                      <img className="tf-author-img" src={"https://pbs.twimg.com/profile_images/668573362738696193/g0-CxwLx_400x400.png"}></img>
                     </Link>
                  </div>
                  <div className="tf-notification-title">
                    <a className="tf-profile-link"> Arjun Mehta</a> 
                    <small> 4 - Hours ago </small>
                    <div> Commented on your trak.</div>
                  </div> 
                  <div className="button tf-follow-button"> Follow </div>
                </div>
              </div>
            </div>
          </div>;
  },
  /**
   * @return {object}
   */
  render: function() {
    
    return (
            <div>
              <div> 
                <ProfileBar/>
              </div>
              <div className = "tf-notifications-header">NOTIFICATIONS</div>
              <div>
                {this.renderNotifications()}
              </div>
              <div>
               
              </div>
            </div>
        );
  }

});

module.exports = Notifications;


