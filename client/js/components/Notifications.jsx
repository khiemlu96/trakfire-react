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
        UserActions.getUserNotifications(this.props.origin+'/notifications');
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
        this.getUserNotifications();
        this.state.isUpvoted = this.props.isUpvoted;
    },

    componentWillMount: function() {

    },

    renderSingleNotification: function(notification) {
        var data = notification.json_data;

        if( notification.notification_type === "FOLLOW_USER" ) {
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
                            <div className="button tf-follow-button"> Following </div>
                        </div>
                    </div>
                </div>
            );
        } else if( notification.notification_type === "COMMENT_ON_POST" ) {
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
                            <div className="button tf-follow-button"> Following </div>
                        </div>
                    </div>
                </div>
            );
        } else if( notification.notification_type === "REPLY_ON_COMMENT" ) {
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
                            <div className="button tf-follow-button"> Following </div>
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

    /**
     * @return {object}
     */
    render: function() {
        return (
            <div>
                <div className="tf-notification-header"> GO TO YOUR <Link to={'/profile/'+2}>PROFILE</Link> </div>
                <div className="tf-notification-content">
                    <div className="tf-notification-list col-md-12">
                        {this.renderNotifications()}
                    </div>
                </div>
                <div className="tf-notification-footer">
                    VIEW ALL &nbsp; <Link to={'/notifications'}> NOTIFICATIONS</Link>
                </div>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    }
});

module.exports = Notifications;