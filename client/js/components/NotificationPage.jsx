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
var NotificationLeaderBoard = require('./NotificationLeaderBoard.jsx');
var Link = require('react-router').Link;
var moment = require('moment');

var offset = 0;

var followBtnStyle = {
    border: '1px solid #ff0d60'
};
var notificationStyle ={
	height:'auto',
}
function getLength(arr) {
    var count = 0;
    for(key in arr){
        count++;
    }
    return count;
}

var NotificationPage = React.createClass({
	
	propTypes: {
		origin: ReactPropTypes.string,
		currUser: ReactPropTypes.object
	},

	getInitialState: function(){
		return {
			notifications: UserStore.getUserNotifications(),
			currentUser: UserStore.getCurrentUser()
		};
	},

	getDefaultProps: function() {
	    return {origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''};
	},

	getUserNotifications: function() {
		console.log("GETTING NOTIFICATIONS for", this.props.currUser.id, this.state.currentUser)
		var data = {
            limit: 15,
            offset: 0,
            user_id: this.props.currUser.id
        };
		UserActions.getUserNotifications(this.props.origin + '/notifications/', data);
		offset = 15;
	},

	loadMoreNotifications: function() {		
		var data = {
            limit: 7,
            offset: offset,
            user_id: this.props.currUser.id
        };
		UserActions.loadMoreUserNotifications(this.props.origin + '/notifications/', data);
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

    renderAuthorImages: function(sender_imgs) {
        var imgHtml = [];
        var img_count = getLength(sender_imgs);
        var count = img_count < 3 ? img_count : 3;

        for(var i = 0, j = img_count - 1; i < count; i++, j--) {
            imgHtml.push(<img className="tf-author-img tf-notification-auther-img" src={sender_imgs[j]}></img>);
        }

        return imgHtml;
    },

	renderAuthorNames: function(screen_names) {
	 	var namesHtml = [];
        var screen_name_count = getLength(screen_names);
        var count = screen_name_count < 3 ? screen_name_count : 3;
        var screen_names_to_show = [];

        for(var i = 0, j = screen_name_count - 1; i < count; i++, j--) {
            screen_names_to_show.push(screen_names[j]);
        }
        namesHtml.push(<span className="tf-link">{screen_names_to_show.join(", ")}</span>);

        if(count < screen_name_count) {
			namesHtml.push(<p> and {screen_name_count - count} others</p>);
        }        

        return namesHtml;
	},

	readNotification: function(notification_data) {
		console.log("-------notification_data---------", notification_data);
		var data = {
            notification: {}
        };

        data['notification']['id'] = parseInt(notification_data.notification_id);
        data['notification']['user_id'] = parseInt(notification_data.srcUserId);

		UserActions.readNotification(this.props.origin + '/notifications/' + notification_data.notification_id, data);
	},

    renderSingleNotification: function(notification_data) {

    	var sender_ids = notification_data.srcUserId.split(",");
		var count_of_sender_ids = getLength(sender_ids);
		var screen_names = notification_data.srcUserName ? notification_data.srcUserName.split(",") : "N/A" ;

		var isNotificationRead = notification_data.read_time === null ? false : true;
		if(isNotificationRead === false) {
			var indicator = <div className="tf-unread-indicator"></div>;
		} else {
			var indicator = "";
		}

		var followButtonClassName = notification_data.className + " pull-right";

		if(count_of_sender_ids < 2) {
			return(    		
	    		<div id = {"notification-" + notification_data.notification_id} className = "tf-notification-list-item list-group-item">
					<Link to={notification_data.target_url} onClick={this.readNotification.bind(this, notification_data)}>
						<div className="col-md-12">
							<div className="left tf-notification-auther">
		                       	{indicator}
	                        	<img className="tf-author-img tf-notification-auther-img" src={notification_data.srcUserImg}></img>
		                    </div>
		                    <div className="col-md-9 tf-notification-profile">
		                        <div className = "">
		                        	<span className="tf-link">{notification_data.srcUserName}</span> 
		                            <small className="tf-notification-sent-time"> &nbsp; - &nbsp;{moment(notification_data.sent_time).fromNow()} </small>
		                        </div>
		                        <div> {notification_data.description} </div>
		                    </div>
		                    <div className = "col-md-3 right pull-right">
		                        <div className={followButtonClassName} id={"followUser_"+ notification_data.srcUserId} style={followBtnStyle} onClick={this.handle_follow_click}> {notification_data.follow_text} </div>
		                    </div>
		                </div>
	                </Link>
				</div>
			);
		} else {
			var sender_imgs = notification_data.srcUserImg.split(",");
			return(    		
	    		<div id = {"notification-" + notification_data.notification_id} className = "tf-notification-list-item tf-consolidate-notification list-group-item">
					<Link to={notification_data.target_url}>
						<div className="col-md-12">
							<div className="left col-md-0 tf-consolidate-notifications-auther">
                                {this.renderAuthorImages(sender_imgs)}
                            </div>
		                    <div className="col-md-9 tf-consolidate-notifications-profile tf-notification-profile">
		                        <div className = "">
		                        	<span className="tf-notification-profile-header"><b>Trakfire</b></span> 
		                            <small className="tf-notification-sent-time"> &nbsp; - &nbsp;{moment(notification_data.sent_time).fromNow()} </small>
		                        </div>
		                        <div> {this.renderAuthorNames(screen_names)} {notification_data.description} </div>
		                    </div>
		                </div>
	                </Link>
				</div>
			);
		}    	
    },

	renderNotifications: function() {
		var user_notifications = this.state.notifications;
		var notificationHtml = [];
		var className = "";
		var vote_notification = {};
		var currentUser = this.state.currentUser;
		var currentUser_followings = [];
		console.log("====================Notifications======================");
		console.log(this.state.notifications);
		for(key in currentUser.followings) {
            currentUser_followings.push(currentUser.followings[key].id);
        }

		for( key in user_notifications ) {
			var notification = user_notifications[key];
			var data = notification.json_data;     
			var sender = notification.sender;
			var follow_text = "";
	        var notification_data = {};	        
		
			if(currentUser_followings.indexOf(parseInt(data.sender_id)) > -1) {
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
				notification_data.srcUserId = data.sender_id;
	            notification_data.srcUserName = data.screen_name;
	            notification_data.srcUserImg = sender.img;
	            notification_data.description = <span className="tf-notification-desc">Started following you</span>;
	            notification_data.sent_time = notification.sent_time;
	            notification_data.read_time = notification.read_time;
				notification_data.target_url = 'profile/'+ data.sender_id;

			} else if(notification.notification_type === "COMMENT_ON_POST") {
				
				notification_data.notification_id = notification.id;
	            notification_data.srcUserId = data.sender_id;
	            notification_data.srcUserName = data.screen_name;
	            notification_data.srcUserImg = sender.img;
	            notification_data.description = <span className="tf-notification-desc">Commented on <span className="tf-link"> your track </span>:<i> {data.comment_text} </i></span>;	
				notification_data.post_id = data.post_id;
				notification_data.sent_time = notification.sent_time;
				notification_data.read_time = notification.read_time;
				notification_data.target_url = 'post/'+ data.post_id;

			} else if(notification.notification_type === "REPLY_ON_COMMENT") {
				
				notification_data.notification_id = notification.id;
	            notification_data.srcUserId = data.sender_id;
	            notification_data.srcUserName = data.screen_name;
	            notification_data.srcUserImg = sender.img;
	            notification_data.description = <span className="tf-notification-desc">Replied on your comment:<i> {data.comment_text} </i></span>;
	            notification_data.post_id = data.post_id;
	            notification_data.sent_time = notification.sent_time;
	            notification_data.read_time = notification.read_time;
	            notification_data.target_url = 'post/'+ data.post_id;

			} else if(notification.notification_type === "POSTED_NEW_TRACK") {
				
				notification_data.notification_id = notification.id;
	            notification_data.srcUserId = data.sender_id;
	            notification_data.srcUserName = data.screen_name;
	            notification_data.srcUserImg = sender.img;
	            notification_data.description = <span className="tf-notification-desc">Posted a <span className = "tf-link"> new track </span></span>;
				notification_data.post_id = data.post_id;
				notification_data.sent_time = notification.sent_time;
				notification_data.read_time = notification.read_time;
				notification_data.target_url = 'post/'+ data.post_id;

			} else if(notification.notification_type === "VOTED_YOUR_TRAK") {
				
				notification_data.notification_id = notification.id;			
	            notification_data.srcUserId = data.sender_id;
	            notification_data.srcUserName = data.screen_name;
	            notification_data.srcUserImg = sender.img;
	            notification_data.description = <span className="tf-notification-desc">Liked your track</span>;
	            notification_data.post_id = data.post_id;
	            notification_data.sent_time = notification.sent_time;
	            notification_data.read_time = notification.read_time;
				notification_data.target_url = 'post/'+ data.post_id;

			}

			notificationHtml.push( this.renderSingleNotification( notification_data ) );
			this.readNotification( notification_data );
		}

		return notificationHtml;
	},

	render: function() {

		if(this.props.currUser !== undefined && this.state.notifications !== undefined) {
				return (<div style={notificationStyle}>
					
					<div className="container p-t-md">
						<div className="row">
						      <ul className="list-group media-list media-list-stream">
						        <div className="list-group-item p-a">
						          <h3 className="m-a-0">Notifications</h3>
						        </div>
					          	{this.renderNotifications()}	
							  </ul>
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