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
var UserStore = require('../stores/UserStore.js');
var UserActions = require('../actions/UserActions.js');

var Link = require('react-router').Link;
var ProfileBar = require('./ProfileBar.jsx');
var classNames = require('classnames');
var moment = require('moment');

var isPlaying = classNames("tf-post-item is-playing");
var isNotPlaying = classNames("tf-post-item");
var isUpvoted = classNames("tf-post-item--votes is-upvoted");
var isNotUpvoted = classNames("tf-post-item--votes");
var _localVoteCount = 0;

var followBtnStyle = {
    border: '1px solid #ff0d60'
};

function getAppState() {
    return {
        isPlaying: false,
        isUpvoted: false,
        hasUpvoted: false,
        notifications: UserStore.getUserNotifications(),
        currentUser: UserStore.getCurrentUser()
    };
}

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
        showModal: ReactPropTypes.func,
        origin: ReactPropTypes.string,
        currentUser: ReactPropTypes.object
    },

    getInitialState: function() {
        return getAppState();
    },

    getUserNotifications: function() {
        var data = {
            limit: 5,
            offset: 0
        };
        UserActions.getUserNotifications(this.props.origin+'/notifications', data);
    },

    handle_follow_click: function(event) {
        var id = event.target.parentNode.id;

        var user_id = parseInt(id.substring("followUser_".length));

        var currentUser_followings = [];
        for(var key in this.state.currentUser.followings) {
            currentUser_followings.push(this.state.currentUser.followings[key].id);
        }
        if(currentUser_followings.indexOf(user_id) > -1) {
            this.unFollowUser(user_id);
        } else {
            this.followUser(user_id); 
        }
    },

    followUser: function(follow_id) {
        UserActions.followUser(this.props.origin+ '/follower', follow_id);
    },

    unFollowUser: function(follow_id) {
        UserActions.unFollowUser(this.props.origin+ '/follower', follow_id);
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
        this.getUserNotifications();
        this.state.isUpvoted = this.props.isUpvoted;
    },

    componentWillMount: function() {

    },

    renderSingleNotification: function(notification_data) {
        return (
            <div className="tf-notification-list-item">
                <div className="col-md-12">
                    <div className="col-md-1 tf-notification-auther">
                       <Link to={'/profile/' + notification_data.srcUserId}>
                            <img className="tf-author-img tf-notification-auther-img" src={notification_data.srcUserImg}></img>
                       </Link>
                    </div>
                    <div className="col-md-9 tf-notification-profile">
                        <div className = "">
                            <a className="tf-link">{notification_data.srcUserName}</a> 
                            <small className="tf-notification-sent-time"> &nbsp; {moment(notification_data.sent_time).fromNow()} </small>
                        </div>
                        <div> {notification_data.description} </div>
                    </div>
                    <div className = "col-md-2">
                        <div className={notification_data.className} id={"followUser_"+ notification_data.srcUserId} style={followBtnStyle} onClick={this.handle_follow_click}> {notification_data.follow_text} </div>
                    </div>
                </div>
            </div>
        );          
    },

    renderNotifications: function() {
        var user_notifications = this.state.notifications;
        var notificationHtml = [];
        var className = "";
        var vote_notification = {};

        for( key in user_notifications ) {
            var notification = user_notifications[key];
            var data = notification.json_data;     
            var follow_text = "";  

            var currentUser = this.state.currentUser;
            var currentUser_followings = [];
            var notification_data = {};
            for(key in currentUser.followings) {
                currentUser_followings.push(currentUser.followings[key].id);
            }

            if(currentUser_followings.indexOf(data.src_user_id) > -1) {
                follow_text = "Following";
                className = "button tf-follow-button";

            } else {
                follow_text = "Follow";
                className = "button tf-follow-button tf-background";
            }
            notification_data.follow_text = follow_text;
            notification_data.className = className;

            if(notification.notification_type === "FOLLOW_USER") {
                
                notification_data.notification_id = notification.id;
                notification_data.srcUserId = data.src_user_id;
                notification_data.srcUserName = data.src_user_name;
                notification_data.srcUserImg = data.src_user_img;
                notification_data.description = "Started following you";
                notification_data.sent_time = notification.sent_time;
            } else if(notification.notification_type === "COMMENT_ON_POST") {

                notification_data.notification_id = notification.id;
                notification_data.srcUserId = data.src_user_id;
                notification_data.srcUserName = data.src_user_name;
                notification_data.srcUserImg = data.src_user_img;
                notification_data.description = <span>Commented on <Link to={"/post/" + data.post_id} className = "tf-link"> your track </Link></span>; 
                notification_data.post_id = data.post_id;
                notification_data.sent_time = notification.sent_time;
            } else if(notification.notification_type === "REPLY_ON_COMMENT") {

                notification_data.notification_id = notification.id;
                notification_data.srcUserId = data.src_user_id;
                notification_data.srcUserName = data.src_user_name;
                notification_data.srcUserImg = data.src_user_img;
                notification_data.description = "Replied on your comment";
                notification_data.post_id = data.post_id;
                notification_data.sent_time = notification.sent_time;         
            } else if(notification.notification_type === "POSTED_NEW_TRACK") {

                notification_data.notification_id = notification.id;
                notification_data.srcUserId = data.src_user_id;
                notification_data.srcUserName = data.src_user_name;
                notification_data.srcUserImg = data.src_user_img;
                notification_data.description = <span>Posted a <Link to={"/post/" + data.post_id} className = "tf-link"> new track </Link></span>;
                notification_data.post_id = data.post_id;
                notification_data.sent_time = notification.sent_time;
            } else if(notification.notification_type === "VOTED_YOUR_TRAK") {

                notification_data.notification_id = notification.id;            
                notification_data.srcUserId = data.src_user_id;
                notification_data.srcUserName = data.src_user_name;
                notification_data.srcUserImg = data.src_user_img;
                notification_data.description = "Liked your track";
                notification_data.post_id = data.post_id;
                notification_data.sent_time = notification.sent_time;

                if(vote_notification[data.post_id] === undefined)
                    vote_notification[data.post_id] = [];
                
                vote_notification[data.post_id].push(notification);
            }

            notificationHtml.push(this.renderSingleNotification(notification_data));
        }
        return notificationHtml;
    },
    
    hide: function() {
        document.getElementById("tf-post-detail-popup").style.display = 'none';
        return true;
    },
    
    /**
     * @return {object}
     */

    render: function() {
        return (
            <div>
                <div className="row tf-notification-header"> GO TO YOUR <Link to={'/profile/'+2}>PROFILE</Link> </div>
                <div className="row tf-notification-content">
                    <div className="tf-notification-list col-md-12">
                        {this.renderNotifications()}
                    </div>
                </div>
                <div className="row tf-notification-footer">
                    VIEW ALL &nbsp; <Link to={'/notification'} onClick={this.hide}> NOTIFICATIONS </Link>
                </div>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    }
});

module.exports = Notifications;