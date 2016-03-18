/*********************Admin Page.jsx*************************
 *
 * Admin console made such that it will only seen by Admin User
 *
 */
'use strict';

var React = require('react/addons');
var Uri = require('jsuri');
var Router = require('react-router');
var Link = Router.Link;
var bootstrap = require('bootstrap');
var Bootstrap = require('react-bootstrap');
var ReactPropTypes = React.PropTypes;
var classNames = require('classnames');
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;
var NavDropdown = require('react-bootstrap').NavDropdown;
var MenuItem = require('react-bootstrap').MenuItem;
var RouteHandler = require('react-bootstrap').RouteHandler;

var PostStore = require('../../stores/PostStore.js');
var UserStore = require('../../stores/UserStore.js');
var NavBar = require('../NavBar.jsx');

function getAppState() {
  	return {
		currentUser: UserStore.getCurrentUser(),
		isLoggedIn: UserStore.isSignedIn(),
		isAdmin: UserStore.isAdmin(),
		posts: PostStore.getAll()
	};
}

var TrakFireAdminPage = React.createClass({
	getInitialState: function() {
		return getAppState();
	},

	getDefaultProps: function() {
		return {origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''};
	},

	componentWillMount: function() {
		this.setState({
			Height: $(document).height()
		});
	},

	componentDidMount: function() {
		UserStore.addChangeListener(this._onChange);
		PostStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		$(window).unbind('resize', this.adjustResize);
	},

	showModal: function(showState) {
		this.setState({showModal:showState});
	}, 

	closeModal: function() {
		this.setState({showModal:false});
	}, 

	showSignupModal: function(){
		this.setState({showSignupModal:true});
	},

	render: function() {
		/*
		 * Render the basic structure for admin page
		*/
		var Routes =  <div>
		{ 
			React.cloneElement(this.props.children, 
			{ 
				posts: this.state.posts,
				currUser: this.state.currentUser,
				origin: this.props.origin,
			})
		}</div>;

		if( this.state.currentUser !== null) {
			return (
				<div id="wrapper" className="content">
					<NavBar 
						isLoggedIn={true}
						origin={this.props.origin}
						isAdmin={true}
						user={this.state.currentUser}
						showSignupModal={this.showSignupModal}
						showModal={this.showModal} />

					<div className="navbar-default sidebar" role="navigation">
						<div className="sidebar-nav navbar-collapse">
							<ul className="nav in" id="side-menu">
								<li>
									<Link to="/admin/dashboard"><i className="fa fa-dashboard fa-fw"></i> &nbsp;Dashboard</Link>
								</li>
								<li> 
									<Link to="/admin/posts"><i className="fa fa-music fa-fw"></i> &nbsp;Posts</Link>
								</li> 
								<li> 
									<Link to="/admin/users"><i className="fa fa-user fa-fw"></i> &nbsp;Users</Link>
								</li>
								<li> 
 									<Link to="/admin/images"><i className="fa fa-user fa-fw"></i> &nbsp;Banner Skins</Link>
 								</li>
							</ul>
						</div>
					</div>
					<div id="page-wrapper" className="page-wrapper" ref="pageWrapper">
						{Routes}
					</div>
				</div>
			);
		} else {
			return(<div></div>);
		}		
	},

	_onChange: function() {
		this.setState(getAppState());
	}
});

module.exports = TrakFireAdminPage;