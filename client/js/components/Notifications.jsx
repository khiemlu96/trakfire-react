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
    border: '1px solid #FF0D55'
};

function getAppState() {
    return {
        isPlaying: false,
        isUpvoted: false,
        hasUpvoted: false,
        notifications: UserStore.getUserNotifications()
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

    follow_click: function() {
        if(this.state.isFollowing === true) {
            this.unFollowUser();
        } else {
            this.followUser();            
        }
    },

    renderSingleNotification: function(notification) {
        var data = notification.json_data;
        var currentUser = this.props.currentUser;
        var follow_text = "";
        var currentUser_followings = [];        

        for(var key in currentUser.followings) {
            currentUser_followings.push(currentUser.followings[key].id);
        }   

        if( notification.notification_type === "FOLLOW_USER" ) {
            if(currentUser_followings.indexOf(data.userid) > -1) {
                follow_text = "Following";
                followBtnStyle.backgroundColor = "#FF0D55";
            } else {
                follow_text = "Follow";
                followBtnStyle.backgroundColor = "#1C1C1C";
            }

            return (
                <div className="tf-notification-list-item">
                    <div className="col-md-12">
                        <div className="col-md-1 tf-notification-auther">
                           <Link to={'/profile/' + data.userid}>
                                <img className="tf-author-img tf-notification-auther-img" src={data.userimg}></img>
                           </Link>
                        </div>
                        <div className="col-md-9 tf-notification-profile">
                            <div className = "">
                                <a className="tf-link">{data.username}</a> 
                                <small className="tf-notification-sent-time"> &nbsp; {moment(notification.sent_time).fromNow()} </small>
                            </div>
                            <div> Started following you </div>
                        </div>
                        <div className = "col-md-2">
                            <div className="button tf-follow-button" style={followBtnStyle} onClick={this.follow_click}> {follow_text} </div>
                        </div>
                    </div>
                </div>
            );
        } else if( notification.notification_type === "COMMENT_ON_POST" ) {
            
            if(currentUser_followings.indexOf(data.commenter_id) > -1) {
                follow_text = "Following";
                followBtnStyle.backgroundColor = "#FF0D55";
            } else {
                follow_text = "Follow";
                followBtnStyle.backgroundColor = "#1C1C1C";
            }

            return (
                <div className="tf-notification-list-item">
                    <div className="col-md-12">
                        <div className="col-md-1 tf-notification-auther">
                           <Link to={'/profile/' + data.commenter_id} className="tf-link">
                                <img className="tf-author-img tf-notification-auther-img" src={data.commenter_img}></img>
                           </Link>
                        </div>
                        <div className="col-md-9 tf-notification-profile">
                            <div className = "">
                                <a className="tf-link">{data.commenter_name}</a> 
                                <small className="tf-notification-sent-time"> &nbsp; {moment(notification.sent_time).fromNow()} </small>
                            </div>
                            <div> Commented on your track </div>
                        </div>
                        <div className = "col-md-2">
                            <div className="button tf-follow-button" onClick={this.follow_click} style={followBtnStyle}> {follow_text} </div>
                        </div>
                    </div>
                </div>
            );
        } else if( notification.notification_type === "REPLY_ON_COMMENT" ) {
            if(currentUser_followings.indexOf(data.commenter_id) > -1) {
                follow_text = "Following";
                followBtnStyle.backgroundColor = "#FF0D55";
            } else {
                follow_text = "Follow";
                followBtnStyle.backgroundColor = "#1C1C1C";
            }
            return (
                <div className="tf-notification-list-item">
                    <div className="col-md-12">
                        <div className="col-md-1 tf-notification-auther">
                           <Link to={'/profile/' + data.commenter_id} className="tf-link">
                                <img className="tf-author-img tf-notification-auther-img" src={data.commenter_img}></img>
                           </Link>
                        </div>
                        <div className="col-md-9 tf-notification-profile">
                            <div className = "">
                                <a className="tf-link">{data.commenter_name}</a> 
                                <small className="tf-notification-sent-time"> &nbsp; {moment(notification.sent_time).fromNow()} </small>
                            </div>
                            <div> Replied to your comment </div>
                        </div>
                        <div className = "col-md-2">
                            <div className="button tf-follow-button" onClick={this.follow_click} style={followBtnStyle}> {follow_text} </div>
                        </div>
                    </div>
                </div>
            );
        } else if( notification.notification_type === "POSTED_NEW_TRACK" ) {
            if(currentUser_followings.indexOf(data.user_id) > -1) {
                follow_text = "Following";
                followBtnStyle.backgroundColor = "#FF0D55";
            } else {
                follow_text = "Follow";
                followBtnStyle.backgroundColor = "#1C1C1C";
            }

            return (
                <div className="tf-notification-list-item">
                    <div className="col-md-12">
                        <div className="col-md-1 tf-notification-auther">
                           <Link to={'/profile/' + data.user_id}>
                                <img className="tf-author-img tf-notification-auther-img" src={data.user_img}></img>
                           </Link>
                        </div>
                        <div className="col-md-9 tf-notification-profile">
                            <div className = "">
                                <a className="tf-link">{data.user_name}</a> 
                                <small className="tf-notification-sent-time"> &nbsp; {moment(notification.sent_time).fromNow()} </small>
                            </div>
                            <div> Posted a <Link className="tf-link" to={'/post/'+ data.post_id}> new track </Link> </div>
                        </div>
                        <div className = "col-md-2">
                            <div className="button tf-follow-button" style={followBtnStyle} onClick={this.follow_click}> {follow_text} </div>
                        </div>
                    </div>
                </div>
            );
        } else if( notification.notification_type === "FOLLOW_USER" ) {
            if(currentUser_followings.indexOf(data.userid) > -1) {
                follow_text = "Following";
                followBtnStyle.backgroundColor = "#FF0D55";
            } else {
                follow_text = "Follow";
                followBtnStyle.backgroundColor = "#1C1C1C";
            }

            return (
                <div className="tf-notification-list-item">
                    <div className="col-md-12">
                        <div className="col-md-1 tf-notification-auther">
                           <Link to={'/profile/' + data.userid}>
                                <img className="tf-author-img tf-notification-auther-img" src={data.userimg}></img>
                           </Link>
                        </div>
                        <div className="col-md-9 tf-notification-profile">
                            <div className = "">
                                <a className="tf-link">{data.username}</a> 
                                <small className="tf-notification-sent-time"> &nbsp; {moment(notification.sent_time).fromNow()} </small>
                            </div>
                            <div> Started following you </div>
                        </div>
                        <div className = "col-md-2">
                            <div className="button tf-follow-button" style={followBtnStyle} onClick={this.follow_click}> {follow_text} </div>
                        </div>
                    </div>
                </div>
            );
        } else if( notification.notification_type === "VOTED_YOUR_TRAK" ) {
            if(currentUser_followings.indexOf(data.user_id) > -1) {
                follow_text = "Following";
                followBtnStyle.backgroundColor = "#FF0D55";
            } else {
                follow_text = "Follow";
                followBtnStyle.backgroundColor = "#1C1C1C";
            }

            return (
                <div className="tf-notification-list-item">
                    <div className="col-md-12">
                        <div className="col-md-1 tf-notification-auther">
                           <Link to={'/profile/' + data.user_id}>
                                <img className="tf-author-img tf-notification-auther-img" src={data.user_img}></img>
                           </Link>
                        </div>
                        <div className="col-md-9 tf-notification-profile">
                            <div className = "">
                                <a className="tf-link">{data.user_name}</a> 
                                <small className="tf-notification-sent-time"> &nbsp; {moment(notification.sent_time).fromNow()} </small>
                            </div>
                            <div> Liked your track </div>
                        </div>
                        <div className = "col-md-2">
                            <div className="button tf-follow-button" style={followBtnStyle} onClick={this.follow_click}> {follow_text} </div>
                        </div>
                    </div>
                </div>
            );
        }           
    },

    renderNotifications: function() {
        var notifications = this.state.notifications;

        var notification_html = [];

        for(key in notifications) {
            notification_html.push(this.renderSingleNotification(notifications[key]));
        }
        return({notification_html});
    },
    demo: function() {
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
                    VIEW ALL &nbsp; <Link to={'/notification'} onClick={this.demo}> NOTIFICATIONS </Link>
                </div>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    }
});

module.exports = Notifications;