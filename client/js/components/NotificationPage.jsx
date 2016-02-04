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
    border: '1px solid #FF0D55'
};

var NotificationPage = React.createClass({
	
	getInitialState: function(){
		return {
			notifications: UserStore.getUserNotifications(),
			currentUser: this.props.currUser		
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

    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
        this.getUserNotifications();
    },

	renderNotifications: function() {
		var user_notifications = this.state.notifications;
		var notificationHtml = [];
		
		var currentUser = this.props.currUser;

        var follow_text = "";
        var currentUser_followings = [];        

        for(var key in currentUser.followings) {
            currentUser_followings.push(currentUser.followings[key].id);
        }

		for(key in user_notifications ) {
			var notification = user_notifications[key];
			var data = notification.json_data;     

			
			if(notification.notification_type === "FOLLOW_USER") {
				if(currentUser_followings.indexOf(data.userid) > -1) {
	                follow_text = "Following";
	                followBtnStyle.backgroundColor = "#FF0D55";
	            } else {
	                follow_text = "Follow";
	                followBtnStyle.backgroundColor = "#1C1C1C !important";
	            }
				notificationHtml.push(
					<div id = {"notification-" + notification.id} className = "tf-notification-list-item">
						<div className="col-md-12">
							<div className="col-md-1 left tf-notification-auther">
		                       <Link to={'/profile/' + data.userid}>
		                            <img className="tf-author-img tf-notification-auther-img" src={data.userimg}></img>
		                       </Link>
		                    </div>
		                    <div className="col-md-9 tf-notification-profile">
		                        <div className = "">
		                            <a className="tf-link">{data.username}</a> 
		                            <small className="tf-notification-sent-time"> &nbsp; - &nbsp;{moment(notification.sent_time).fromNow()} </small>
		                        </div>
		                        <div> Started following you </div>
		                    </div>
		                    <div className = "col-md-2 right">
		                        <div className="button tf-follow-button" style={followBtnStyle}> {follow_text} </div>
		                    </div>
	                    </div>
					</div>
				);
			} else if(notification.notification_type === "COMMENT_ON_POST") {
				if(currentUser_followings.indexOf(data.commenter_id) > -1) {
	                follow_text = "Following";
	                followBtnStyle.backgroundColor = "#FF0D55";
	            } else {
	                follow_text = "Follow";
	                followBtnStyle.backgroundColor = "#1C1C1C !important";
	            }
				notificationHtml.push(
					<div id = {"notification-" + notification.id} className = "tf-notification-list-item">
						<div className="col-md-12">
							<div className="col-md-1 left tf-notification-auther">
		                       <Link to={'/profile/' + data.commenter_id}>
		                            <img className="tf-author-img tf-notification-auther-img" src={data.commenter_img}></img>
		                       </Link>
		                    </div>
		                    <div className="col-md-9 tf-notification-profile">
		                        <div className = "">
		                            <a className="tf-link">{data.commenter_name}</a> 
		                            <small className="tf-notification-sent-time"> &nbsp; - &nbsp;{moment(notification.sent_time).fromNow()} </small>
		                        </div>
		                        <div> Commented on your track </div>
		                    </div>
		                    <div className = "col-md-2 right">
		                        <div className="button tf-follow-button" style={followBtnStyle}> {follow_text} </div>
		                    </div>
	                    </div>
					</div>
				);
			} else if(notification.notification_type === "REPLY_ON_COMMENT") {
				if(currentUser_followings.indexOf(data.commenter_id) > -1) {
	                follow_text = "Following";
	                followBtnStyle.backgroundColor = "#FF0D55";
	            } else {
	                follow_text = "Follow";
	                followBtnStyle.backgroundColor = "#1C1C1C !important";
	            }
				notificationHtml.push(
					<div id = {"notification-" + notification.id} className = "tf-notification-list-item">
						<div className="col-md-12">
							<div className="col-md-1 left tf-notification-auther">
		                       <Link to={'/profile/' + data.commenter_id}>
		                            <img className="tf-author-img tf-notification-auther-img" src={data.commenter_img}></img>
		                       </Link>
		                    </div>
		                    <div className="col-md-9 tf-notification-profile">
		                        <div className = "">
		                            <a className="tf-link">{data.commenter_name}</a> 
		                            <small className="tf-notification-sent-time"> &nbsp; - &nbsp;{moment(notification.sent_time).fromNow()} </small>
		                        </div>
		                        <div> Replied to your comment  </div>
		                    </div>
		                    <div className = "col-md-2 right">
		                        <div className="button tf-follow-button" style={followBtnStyle}> {follow_text} </div>
		                    </div>
	                    </div>
					</div>
				);
			} else if(notification.notification_type === "POSTED_NEW_TRACK") {
				if(currentUser_followings.indexOf(data.user_id) > -1) {
	                follow_text = "Following";
	                followBtnStyle.backgroundColor = "#FF0D55";
	            } else {
	                follow_text = "Follow";
	                followBtnStyle.backgroundColor = "#1C1C1C !important";
	            }
				notificationHtml.push(
					<div id = {"notification-" + notification.id} className = "tf-notification-list-item">
						<div className="col-md-12">
							<div className="col-md-1 left tf-notification-auther">
		                       <Link to={'/profile/' + data.user_id}>
		                            <img className="tf-author-img tf-notification-auther-img" src={data.user_img}></img>
		                       </Link>
		                    </div>
		                    <div className="col-md-9 tf-notification-profile">
		                        <div className = "">
		                            <a className="tf-link">{data.user_name}</a> 
		                            <small className="tf-notification-sent-time"> &nbsp; - &nbsp;{moment(notification.sent_time).fromNow()} </small>
		                        </div>
		                        <div> Posted a <Link className="tf-link" to={'/post/'+ data.post_id}> new track </Link> </div>
		                    </div>
		                    <div className = "col-md-2 right">
		                        <div className="button tf-follow-button" style={followBtnStyle}> {follow_text} </div>
		                    </div>
	                    </div>
					</div>
				);
			} else if(notification.notification_type === "VOTED_YOUR_TRAK") {
				if(currentUser_followings.indexOf(data.user_id) > -1) {
	                follow_text = "Following";
	                followBtnStyle.backgroundColor = "#FF0D55";
	            } else {
	                follow_text = "Follow";
	                followBtnStyle.backgroundColor = "#1C1C1C !important";
	            }
				notificationHtml.push(
					<div id = {"notification-" + notification.id} className = "tf-notification-list-item">
						<div className="col-md-12">
							<div className="col-md-1 left tf-notification-auther">
		                       <Link to={'/profile/' + data.user_id}>
		                            <img className="tf-author-img tf-notification-auther-img" src={data.user_img}></img>
		                       </Link>
		                    </div>
		                    <div className="col-md-9 tf-notification-profile">
		                        <div className = "">
		                            <a className="tf-link">{data.user_name}</a> 
		                            <small className="tf-notification-sent-time"> &nbsp; - &nbsp;{moment(notification.sent_time).fromNow()} </small>
		                        </div>
		                        <div> Liked your track </div>
		                    </div>
		                    <div className = "col-md-2 right">
		                        <div className="button tf-follow-button" style={followBtnStyle}> {follow_text} </div>
		                    </div>
	                    </div>
					</div>
				);
			}
		}
		return notificationHtml;
	},

	render: function() {
		if(this.props.currUser !== undefined && this.state.notifications !== undefined) {
			return (
				<div className="tf-notification-page-container container col-md-12">
					<div className="tf-notification-page-content-container container">
						<div className="row tf-notification-page-header">
							<div className="row">
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
			notifications: UserStore.getUserNotifications()
		});
	}
});

module.exports = NotificationPage;