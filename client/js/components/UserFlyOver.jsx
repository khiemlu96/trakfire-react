
var React = require('react');
var classNames = require('classnames');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router');
var Link = Router.Link;

var Bootstrap = require('react-bootstrap');
var OverlayTrigger = Bootstrap.OverlayTrigger;
var Popover = Bootstrap.Popover;
var UserFlyOverContent = require('./UserFlyOverContent.jsx');

var followBtnStyle = {
    border: '1px solid #ff0d60'
};

var flyOverStyle = {
	zIndex: 100,
	display: 'block'
};

var UserFlyOver = React.createClass({

	getInitialState: function() {
		return {
			showCard: false
		}
	},

	propTypes: {
		user: ReactPropTypes.object,
		origin: ReactPropTypes.string
	},

	show: function() {
		if(this.state.showCard !== true) {
			this.setState({
				showCard: true
			});
		}		
	},

	hide: function() {		
		if(this.state.showCard !== false) {
			this.setState({
				showCard: false
			})
		}
	},

	showFlyOver: function() {
		var self = this;
		setTimeout(function() {
			self.show();
		}, 500);
	},

	hideFlyOver: function() {
		var self = this;
		setTimeout(function () {
			self.hide();
		}, 500);
	},

	renderUserProfile: function(event){
	    event.preventDefault();	    
	    location = '#/profile/' + this.props.user.id;
  	},

  	onClick: function(event) {
  		event.preventDefault();
	    location = '#/profile/' + this.props.user.id;
  	},

	render: function() {
		var userId = this.props.user.id;
		var userImg = this.props.user.img;

		if(this.state.showCard === true) {
			var userFlyOver = 
				<div ref="userFlyOver" style={flyOverStyle} className="tf-user-flyover col-md-4" onClick={this.renderUserProfile}>
					<UserFlyOverContent origin = {this.props.origin} user = {this.props.user} />
					<center><div className="arrow-down"></div></center>
				</div>;
		} else {
			var userFlyOver = "";
		}

		return (
          	<div className="user-flyover" onMouseOver = {this.showFlyOver} onMouseOut = {this.hideFlyOver} >
				{userFlyOver}
				<div>
					<div className="tf-link" onClick={this.renderUserProfile}>
						<img className='tf-author-img' src={userImg}></img>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = UserFlyOver;