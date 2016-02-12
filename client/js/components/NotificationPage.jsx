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
var moment = require('moment');

var offset = 0;

var followBtnStyle = {
    border: '1px solid #ff0d60'
};

var NotificationPage = React.createClass({
	
	getInitialState: function(){
		return {
			notifications: UserStore.getUserNotifications(),
			currentUser: UserStore.getCurrentUser()
		};
	},

	propTypes: {
		origin: ReactPropTypes.string,
		currUser: ReactPropTypes.object
	},

	getUserNotifications: function() {
		var data = {
            limit: 15,
            offset: 0
        };
		UserActions.getUserNotifications(this.props.origin + '/notifications', data);
		offset = 15;
	},

	loadMoreNotifications: function() {		
		var data = {
            limit: 7,
            offset: offset
        };
		UserActions.loadMoreUserNotifications(this.props.origin + '/notifications', data);
		offset = offset + 7;
	},

	handle_follow_click: function(event) {
		event.preventDefault();
		
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
		return true;
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
    },

    renderSingleNotification: function(notification_data) {
    	return(
    		
    		<div id = {"notification-" + notification_data.notification_id} className = "tf-notification-list-item">
				<Link to={notification_data.target_url}>
					<div className="col-md-12">
						<div className="left tf-notification-auther">
	                       	<div className="tf-unread-indicator"></div>
                        	<img className="tf-author-img tf-notification-auther-img" src={notification_data.srcUserImg}></img>
	                    </div>
	                    <div className="col-md-9 tf-notification-profile">
	                        <div className = "">
	                        	<span className="tf-link">{notification_data.srcUserName}</span> 
	                            <small className="tf-notification-sent-time"> &nbsp; - &nbsp;{moment(notification_data.sent_time).fromNow()} </small>
	                        </div>
	                        <div> {notification_data.description} </div>
	                    </div>
	                    <div className = "col-md-2 right">
	                        <div className={notification_data.className} id={"followUser_"+ notification_data.srcUserId} style={followBtnStyle} onClick={this.handle_follow_click}> {notification_data.follow_text} </div>
	                    </div>
	                </div>
                </Link>
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
	            notification_data.description = <span className="tf-notification-desc">Started following you</span>;
	            notification_data.sent_time = notification.sent_time;
				notification_data.target_url = 'profile/'+ data.src_user_id;

			} else if(notification.notification_type === "COMMENT_ON_POST") {
				
				notification_data.notification_id = notification.id;
	            notification_data.srcUserId = data.src_user_id;
	            notification_data.srcUserName = data.src_user_name;
	            notification_data.srcUserImg = data.src_user_img;
	            notification_data.description = <span className="tf-notification-desc">Commented on <span className="tf-link"> your track </span></span>;	
				notification_data.post_id = data.post_id;
				notification_data.sent_time = notification.sent_time;
				notification_data.target_url = 'post/'+ data.post_id;

			} else if(notification.notification_type === "REPLY_ON_COMMENT") {
				
				notification_data.notification_id = notification.id;
	            notification_data.srcUserId = data.src_user_id;
	            notification_data.srcUserName = data.src_user_name;
	            notification_data.srcUserImg = data.src_user_img;
	            notification_data.description = <span className="tf-notification-desc">Replied on your comment</span>;
	            notification_data.post_id = data.post_id;
	            notification_data.sent_time = notification.sent_time;
	            notification_data.target_url = 'post/'+ data.post_id;

			} else if(notification.notification_type === "POSTED_NEW_TRACK") {
				
				notification_data.notification_id = notification.id;
	            notification_data.srcUserId = data.src_user_id;
	            notification_data.srcUserName = data.src_user_name;
	            notification_data.srcUserImg = data.src_user_img;
	            notification_data.description = <span className="tf-notification-desc">Posted a <span className = "tf-link"> new track </span></span>;
				notification_data.post_id = data.post_id;
				notification_data.sent_time = notification.sent_time;
				notification_data.target_url = 'post/'+ data.post_id;

			} else if(notification.notification_type === "VOTED_YOUR_TRAK") {
				
				notification_data.notification_id = notification.id;			
	            notification_data.srcUserId = data.src_user_id;
	            notification_data.srcUserName = data.src_user_name;
	            notification_data.srcUserImg = data.src_user_img;
	            notification_data.description = <span className="tf-notification-desc">Liked your track</span>;
	            notification_data.post_id = data.post_id;
	            notification_data.sent_time = notification.sent_time;
				notification_data.target_url = 'post/'+ data.post_id;

	            if(vote_notification[data.post_id] === undefined)
	            	vote_notification[data.post_id] = [];
            	
            	vote_notification[data.post_id].push(notification);
			}

			notificationHtml.push( this.renderSingleNotification( notification_data ) );
		}

		return notificationHtml;
	},

	render: function() {
		if(this.props.currUser !== undefined && this.state.notifications !== undefined) {
			return (
				<div className="tf-notification-page-container container col-md-12">
					<div className="tf-notification-page-content-container container">
						<div className="row tf-notification-page-header">
							<div className = "row">
								<Link to="#!" className="tf-back-link"><h6>BACK</h6></Link>
							</div>	
							<div className="tf-notification-heading">
								<center><h1><b>NOTIFICATIONS</b></h1></center>
							</div>
						</div>
						<div className="row tf-notification-page-content">
							<div className="tf-notification-page-list">
								{this.renderNotifications()}
							</div>
						</div>
						<div className="row tf-notification-page-footer">						
							<span>
								LOAD MORE &nbsp; <a onClick={this.loadMoreNotifications} className="tf-link tf-load-more-link">NOTIFICATIONS &nbsp;&nbsp;&#9660;</a>
							</span>
						</div>
					</div>
				</div>
			);
		} else {
			return (<div></div>);
		}
	},

	_onChange: function() {
		this.setState({
			notifications: UserStore.getUserNotifications(),
			currentUser: UserStore.getCurrentUser()
		});
	}
});

module.exports = NotificationPage;