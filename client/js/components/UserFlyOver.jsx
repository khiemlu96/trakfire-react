
var React = require('react');
var classNames = require('classnames');
var ReactPropTypes = React.PropTypes;

var Bootstrap = require('react-bootstrap');
var OverlayTrigger = Bootstrap.OverlayTrigger;
var Popover = Bootstrap.Popover;
var UserFlyOverContent = require('./UserFlyOverContent.jsx');

var followBtnStyle = {
    border: '1px solid #ff0d60'
};

var UserFlyOver = React.createClass({

	propTypes: {
		user: ReactPropTypes.object,
		origin: ReactPropTypes.string
	},

	show: function() {
		console.log("show----------------");
	},
	hide: function() {
		console.log("hide----------------");
	},
	render: function() {
		var userId = this.props.user.id;
		var userImg = this.props.user.img;

		return (
          	<div>			
				<OverlayTrigger trigger="hover" placement="top" onMouseOver={this.show} onMouseOut={this.hide}
					overlay={
						<Popover className="tf-user-flyover col-md-4" >
							<UserFlyOverContent origin = {this.props.origin} user = {this.props.user} />
						</Popover>
					}>
  					<img className='tf-author-img' src = {userImg}></img>
				</OverlayTrigger>
			</div>
		);
	}
});

module.exports = UserFlyOver;