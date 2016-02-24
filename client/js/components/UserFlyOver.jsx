
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
		var self = this;
		if(self.state.showCard !== true) {
			self.setState({
				showCard: true
			});
		}		
	},

	hide: function() {
		var self = this;
		self.setState({
			showCard: false
		})
	},

	showFlyOver: function() {
		var self = this;
		setTimeout(function() { 
			self.show();
		}, 100);
	},

	hideFlyOver: function() {
		var self = this;
		setTimeout(function () {
			self.hide();
		}, 100);
	},
	renderUserProfile: function(event){
	    event.preventDefault();
	    var self = this;
	    var aId = self.props.user.id;
	    location = '#/profile/'+aId;
  	},
	render: function() {
		var self = this;
		var userId = self.props.user.id;
		var userImg = self.props.user.img;

		if(self.state.showCard === true) {
			var userFlyOver = <div style={flyOverStyle} onMouseOver={self.showFlyOver} className="tf-user-flyover col-md-4">
					<UserFlyOverContent origin = {self.props.origin} user = {self.props.user} />
					<center><div className="arrow-down"></div></center>
				</div>;
		} else {
			var userFlyOver = <div></div>;
		}

		return (
          	<div className="user-flyover" onMouseOut={self.hideFlyOver}>
				{userFlyOver}
				<div onMouseOver={self.showFlyOver}>
					<div className="tf-link" onClick={this.renderUserProfile}><img className='tf-author-img' src = {userImg}></img></div>
				</div>
			</div>
		);
	}
});

module.exports = UserFlyOver;