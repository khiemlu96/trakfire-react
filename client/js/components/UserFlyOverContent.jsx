var React = require('react');
var classNames = require('classnames');
var ReactPropTypes = React.PropTypes;
var UserStore = require('../stores/UserStore.js');
var UserActions = require('../actions/UserActions.js');

var followBtnStyle = {
    border: '1px solid #ff0d60'
};

var UserFlyOverContent = React.createClass({
	getInitialState: function() {
		return {
			user: this.props.user,
			currentUser: UserStore.getCurrentUser()	
		};
	},

	propTypes: {
		user: ReactPropTypes.object,
		origin: ReactPropTypes.string
	},

    handle_follow_click: function(event) {

    	if( this.state.currentUser !== null || sessionStorage.getItem('jwt') !== null ) {
			var currentUser_followings = [];
	        for(var key in this.state.currentUser.followings) {
	            currentUser_followings.push(this.state.currentUser.followings[key].id);
	        }

	        if(currentUser_followings.indexOf(this.state.user.id) > -1) {
	            this.unFollowUser(this.state.user.id);
	        } else {
	            this.followUser(this.state.user.id); 
	        }
    	} else {
    		// If user is not logged in and if he clicks on Follow User button
    		// then forced user to login in to site to follow the user
    		$(document).trigger("ReactComponent:TrakfireApp:showModal");
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
    },

	render: function() {
		var follow_text = "", className = "";

		if ( sessionStorage.getItem('jwt') !== '' && this.state.currentUser !== null) {			
			if(this.state.currentUser.id !==  this.state.user.id) {
				var currentUser_followings = [];
	        
		        for(var key in this.state.currentUser.followings) {
		            currentUser_followings.push(this.state.currentUser.followings[key].id);
		        }

		        if(currentUser_followings.indexOf(parseInt(this.state.user.id)) > -1) {
	                follow_text = "Following";
	                className = "button tf-follow-button";
	            } else {
	                follow_text = "Follow";
	                className = "button tf-follow-button tf-background";
	            }
				var follow_btn_Html = <div className = "user-flyover-follow-btn">
	            						<div className={className} style={followBtnStyle} onClick={this.handle_follow_click}> {follow_text} </div>
	        						</div>;
			} else {
				var follow_btn_Html = <div></div>;
			}
		} else {
			follow_text = 'Follow';
			className = "button tf-follow-button tf-background";
			var follow_btn_Html = <div className = "user-flyover-follow-btn">
            						<div className={className} style={followBtnStyle} onClick={this.handle_follow_click}> {follow_text} </div>
        						</div>;
		}

		if( this.state.user !== null ) {
			var user = this.state.user;

			return (
				<div className = "col-md-12 user-flyover-container">
					<div className = "col-md-12 user-flyover-content">
						<div className = "user-flyover-profile-image">
							<img className="tf-author-img" src={user.img}></img>
						</div>
						<div className = "user-flyover-profile-info">
							<div className="tf-link user-flyover-profile-name">{user.username}</div>
							<div className="user-flyover-profile-bio">{user.tbio}</div>							
						</div>
						{follow_btn_Html}
					</div>
				</div>
			);
		} else {
			return (<div></div>);
		}	
	},
	
	_onChange: function() {
        this.setState({
        	currentUser: UserStore.getCurrentUser()
        });
    }
});

module.exports = UserFlyOverContent;