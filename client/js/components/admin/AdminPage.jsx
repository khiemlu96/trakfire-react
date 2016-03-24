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

var currentRoute = "";

function getAppState() {
  	return {
		currentUser: UserStore.getCurrentUser(),
		isLoggedIn: UserStore.isSignedIn(),
		isAdmin: UserStore.isAdmin()
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
		currentRoute = window.location.hash;
		var selectedMenu = "";
		if( currentRoute.indexOf("admin/dashboard") !== -1 ) 
			selectedMenu = 'dashboard';
		else if(currentRoute.indexOf("admin/posts") !== -1 )
			selectedMenu = 'post';
		else if(currentRoute.indexOf("admin/users") !== -1 )
			selectedMenu = 'user';
		else if(currentRoute.indexOf("admin/images") !== -1 )
			selectedMenu = 'carousal';

		this.setState({
			selectedMenu: selectedMenu
		});
	},

	componentDidMount: function() {
		UserStore.addChangeListener(this._onChange);
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

	selectSideBar: function(key) {
		var selectedMenu = "";

		switch ( key ) {
			case 'dashboard':
				selectedMenu = key;
				break;
			case 'post':
				selectedMenu = key;
				break;
			case 'user':
				selectedMenu = key;
				break;
			case 'carousal':
				selectedMenu = key;
				break;
			default:
				throw new Error('pageType is not valid');
		}

		this.setState({
			selectedMenu: selectedMenu
		});
	},

	render: function() {		
		/*
		 * Render the basic structure for admin page
		*/
		var Routes =  <div>
		{ 
			React.cloneElement(this.props.children, 
			{ 
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
								<li id="dashboard-link" className={(this.state.selectedMenu === 'dashboard' ? 'selected': '')}>
									<Link onClick = {this.selectSideBar.bind(this, 'dashboard')} to="/admin/dashboard"><i className="fa fa-dashboard fa-fw"></i> &nbsp;Dashboard</Link>
								</li>
								<li id="post-link" className={(this.state.selectedMenu === 'post' ? 'selected': '')}> 
									<Link onClick = {this.selectSideBar.bind(this, 'post')} to="/admin/posts"><i className="fa fa-music fa-fw"></i> &nbsp;Posts</Link>
								</li> 
								<li id="user-link" className={(this.state.selectedMenu === 'user' ? 'selected': '')}> 
									<Link onClick = {this.selectSideBar.bind(this, 'user')} to="/admin/users"><i className="fa fa-group fa-fw"></i> &nbsp;Users</Link>
								</li>
								<li id="carousal-link" className={(this.state.selectedMenu === 'carousal' ? 'selected': '')}> 
 									<Link onClick = {this.selectSideBar.bind(this, 'carousal')} to="/admin/images"><i className="fa fa-list-alt fa-fw"></i> &nbsp;Banner Skins</Link>
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