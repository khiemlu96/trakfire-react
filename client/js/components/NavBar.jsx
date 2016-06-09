/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var Uri = require('jsuri');
var Router = require('react-router');
var Link = Router.Link;

var PostForm = require('./PostForm.jsx');
var SearchBar = require('./SearchBar.jsx');
var Bootstrap = require('react-bootstrap');
var Notifications = require('./Notifications.jsx');
var UserStore = require('../stores/UserStore.js');

var Tooltip = Bootstrap.Tooltip;
var OverlayTrigger = Bootstrap.OverlayTrigger;
var Popover = Bootstrap.Popover;
var ReactPropTypes = React.PropTypes;
var SearchResultPage = require('./SearchResultPage.jsx');
var UserStyle = { top:38, maxWidth:'80%', backgroundColor: '#1c1c1c', border:'1px solid #2b2b2b', width: 470, borderRadius: 4};
var searchIconStyle = {cursor: 'pointer'};
var searchkey = "";
var searchIconStyle = {
  cursor: 'pointer',
  color: '#ff0d55',
  fontSize: '18px',
  marginRight: '15px'
};


var searchButtonStyle = {
  position:'relative'
}

var searchBoxStyle = {
    backgroundColor: '#fff',
    border: '1px solid #2b2b2b',
    left: '0 !important',
    marginLeft: '2%',
    marginRight: '2%',
    marginTop: '9px',
    maxHeight: 'auto',
    maxWidth: '96%',
    paddingTop: 0,
    position: 'fixed',
    zIndex: 100,
    borderRadius: '5px',
    display: 'none'
};

var searchInputArea = {
  backgroundColor: '#161616',
  border: 'none',
  textAlign: 'center',
  fontSize: 20,
  height: 60,
  fontWeight: 600,
  maxWidth: '97%',
  float: 'left'
};
var closeButtonStyle = {
  fontSize: 40,
  color: '#ff0d55',
  textDecoration: 'none',
  verticalAlign: 'middle',
  float: 'right',
  top:20,
  position: 'relative'
};
var searchIconStyle = {
  cursor: 'pointer',
  color: '#ff0d55',
  fontSize: '18px',
  marginRight: '15px'
};

var MenuIconStyle = {
}
var showMoreStyle = {
  display: 'none'
};
 
/*function getComponentState() {
  return {
    arePendingNotifications: UserStore.getPending()
  };
}*/

var NavBar = React.createClass({

  propTypes: {
    isLoggedIn: ReactPropTypes.bool,
    origin: ReactPropTypes.string,
    isAdmin: ReactPropTypes.bool,
    user: ReactPropTypes.object, 
    showSignupModal: ReactPropTypes.func,
    onPostItemClick: ReactPropTypes.func,
    currStreamUrl: ReactPropTypes.string,
    searchkey:ReactPropTypes.string, 
    showGrowl: ReactPropTypes.func
  },

  componentDidMount: function() {  
    // Check if the url contains 'attempt_failed' search-keyword,
    // then show signup modal popup 
    var isShowSignUpPopup = false;
    if( window.location.search.indexOf('attempt_failed') !== -1 ){
      isShowSignUpPopup = new Uri(location.search).getQueryParamValue('attempt_failed');
    }

    if(this.props.isLoggedIn === false && isShowSignUpPopup === 'true')
    {
      this.showSignupModal();
    }
  },
  
  handleSignOut: function() {
    localStorage.setItem('jwt','');
  },

  showModal: function() {
    this.props.showModal(true);
  },

  hideMenuPopup: function() { 
    this.refs.menuIcon.getDOMNode().value = "";
    this.setState({
          isVisible: true
        }); 
        MenuIconStyle.display = 'none';
    this.refs.menuPopup.hide();
  }, 

  showSignupModal: function() {
    this.props.showSignupModal();
  },

  handleKeyUp: function(e) {
    e.preventDefault();
    searchkey = e.target.value;
    console.log(searchkey);

    if(searchkey.length == 1)
    { 
      this.showSearchResult();
    }
    else{ 
      this.hideSearchResult();
    }
  },

  hideSearchResult: function() { 
    document.getElementById("show-more-btn-container").style.display = "none";
  },

  showSearchResult: function() {
    var searchKey = this.refs.searchInput.getDOMNode().value; 
    console.log(searchKey);
    if(searchKey != ''){
        React.render(
        <SearchBar 
          isSearchVisible={true} 
          searchKeyword={searchKey} 
          onPlayBtnClick = {this.props.onPlayBtnClick}
            currStreamUrl={this.props.currStreamUrl} />, 
        document.getElementById("tf-search-result")
      );
        this.setState({
          isVisible: true
        }); 
        searchBoxStyle.display = 'block';
    }else{
      document.getElementById("tf-search-results").style.display = "none";
    }
    this.props.searchkey = this.refs.searchInput.getDOMNode().value; 
    this.setState({isVisible:false});
    console.log(this.props);
  },

  showSearchResultPage: function() {
    console.log(searchKey);
    //this.setState({isVisible:false});
    
  }, 

  renderUserInfo: function(){
    return <OverlayTrigger trigger="click" rootClose placement="bottom" 
              overlay={ 
                        <Popover className="tf-notification-popup col-md-4" id="tf-post-detail-popup" style={UserStyle} >
                          <Notifications origin={this.props.origin} currentUser={this.props.user} />                           
                        </Popover>
                      }>
              <span className="tf-firestarters-upvotes-count">
                <img className='tf-author-img' src={this.props.user.img}></img>
              </span>
            </OverlayTrigger>
  },

  renderStaticInfo: function(){
    var signinLink = '', adminConsoleLink = '';
    if(this.props.isLoggedIn) {
        signinLink = <div className="tf-menu-popup-list-item tf-sign-out-link"><a href='/' className="nd" onClick={this.handleSignOut}><h6>SIGN OUT</h6></a></div>
    }

    if(this.props.isAdmin !== undefined && this.props.isAdmin === true) {
        adminConsoleLink = <div className="tf-menu-popup-list-item"><Link to={'/admin'} className="nd"><h6>ADMIN CONSOLE</h6></Link></div>; 
    }
  
    return <OverlayTrigger trigger="click" rootClose placement="bottom" ref = "menuPopup" style = {MenuIconStyle}
              overlay={
                  <Popover id="tf-menu-popup">
                     <div className="tf-menu-popup-list-item" ref = "menuIcon" onClick = {this.hideMenuPopup}><Link className="nd" to={'/about'}><h6>ABOUT</h6></Link></div>
                     <div className="tf-menu-popup-list-item" ref = "menuIcon" onClick = {this.hideMenuPopup}><Link className="nd" to={'/faq'}><h6>FAQ</h6></Link></div>
                     <div className="tf-menu-popup-list-item" ref = "menuIcon" onClick = {this.hideMenuPopup}><Link className="nd" to={'/jobboard'}><h6>JOB BOARD</h6></Link></div>
                     <div className="tf-menu-popup-list-item" ref = "menuIcon" onClick = {this.hideMenuPopup}><Link className="nd" to={'/privacy'}><h6>PRIVACY POLICY</h6></Link></div>
                     <div className="tf-menu-popup-list-item" ref = "menuIcon" onClick = {this.hideMenuPopup}><Link className="nd" to={'/terms'}><h6>TERMS OF USE</h6></Link></div>
                     <div className="tf-menu-popup-list-item" ref = "menuIcon" onClick = {this.hideMenuPopup}><Link className="nd" to={'/jobboard'}><h6>JOB BOARD</h6></Link></div>
                     <div onClick = {this.hideMenuPopup} ref = "menuIcon"> {adminConsoleLink} </div>
                     <div onClick = {this.hideMenuPopup} ref = "menuIcon"> {signinLink} </div>
                  </Popover>
                }>
              <span className="glyphicon glyphicon-option-horizontal tf-menu-link" ></span>
          </OverlayTrigger>
  },

  renderSearchBar: function() {
    this.setState({
      isVisible: true
    }); 
    searchBoxStyle.display = 'block';
  },


  getInitialState: function() {
    return {
      isVisible: this.props.isVisible,
      showSearchResultPopup: false
    };
  },

  /**
   * @return {object}
   */
  render: function() {

    var indicator = "";
    if(this.props.user != null){
     //if (this.state.
     if(this.props.user.unread_notifications > 0) {
        var indicator = <div className="tf-bell-unread-indicator"></div>;
      } 
    }
    if(this.props.isLoggedIn) {
      console.log("IN NAVBAR ", '/profile/'+this.props.user.id);
      var notificationLink = <li><Link className="app-notifications" to="/notifications">{indicator}<span className="icon icon-bell "></span></Link></li>
      var signinLink = '';
      
      var profileLink = <li><button className="btn btn-default navbar-btn navbar-btn-avitar" data-toggle="popover"><Link to={'/profile/'+this.props.user.id}><img className="img-circle" src={this.props.user.img} ></img></Link></button></li>
      //<span className="tf-menu">{this.renderUserInfo()}</span>
      //if(this.props.isAdmin || this.props.user.canPost) { 
      var requestInviteLink = '';
      var postLink = <PostForm isVisible={true} origin={this.props.origin} showGrowl={this.props.showGrowl}/>
      var searchIcon =  <span><span className = "glyphicon glyphicon-search" onClick={this.renderSearchBar} style = {searchIconStyle}></span> </span>
      var menuIcon = <li><a href="#" onClick={function(e) {e.preventDefault();}}>{this.renderStaticInfo()}</a></li>;

      /*} else {
        var tooltip = <Tooltip>Posting is invite only</Tooltip>;
        var postLink = <OverlayTrigger placement="left" overlay={tooltip}><a className="tf-inactive">POST</a></OverlayTrigger>;//<a href="" className="tf-inactive">POST</a>;
      }*/
    } else {
      var notificationLink = '';
      var signinLink = <li><a className="btn btn-navbar-link btn-primary-outline btn-sm pull-right" href={this.props.origin+'/request_token'}> MEMBER SIGN IN </a></li>
      var requestInviteLink = <li> <a href="#" className="btn btn-navbar-link btn-primary-outline btn-sm pull-right" onClick={this.showSignupModal}> REQUEST INVITE </a> </li>
      var inviteLink = <a href="#" onClick={this.showSignupModal}> REQUEST INVITE </a>
      var profileLink = "";
      var postLink = '';
      var searchIcon = '';
      var menuIcon = <li><a href="#" onClick={function(e) {e.preventDefault();}}>{this.renderStaticInfo()}</a></li>;
      //var emailLink = <Link to='/email?id=1'>EMAIL</Link>;s
    }
    console.log("SEARCH KEY", this.props.searchkey);
    //onKeyUp={this.handleKeyUp}
    return (
<div>
<nav className="navbar navbar-inverse navbar-fixed-top app-navbar">
  <div className="container">
    <div className="navbar-header">
      <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-main">
        <span className="sr-only">Toggle navigation</span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
      </button>
      <Link className="navbar-brand"  to="/" >
        <img src="http://d1zb20amprz33r.cloudfront.net/trakfirewhite-sm.png" alt="brand"></img>
      </Link>
    </div>
    <div className="navbar-collapse collapse" id="navbar-collapse-main">

        <ul className="nav navbar-nav navbar-right m-r-0 hidden-xs">
          {notificationLink}
          {postLink}
          {profileLink}
          {signinLink}
          {requestInviteLink}
          {menuIcon}
        </ul>

        {/*<form className="navbar-form navbar-right app-search" role="search">
          <div className="form-group">
            <input type="text" id="tf-search-input" className="form-control tf-search-input" data-action="grow" placeholder="Search" ref="searchInput" onKeyUp={this.handleKeyUp} ></input>
          </div>
        </form>*/}

        <ul className="nav navbar-nav hidden-sm hidden-md hidden-lg">
          <li><a href="index.html">Home</a></li>
          <li><a href="profile/index.html">Profile</a></li>
          <li><a href="notifications/index.html">Notifications</a></li>
          <li><a data-toggle="modal" href="#msgModal">Messages</a></li>
          <li><a href="docs/index.html">Docs</a></li>
          <li><a href="#" data-action="growl">Growl</a></li>
          <li><a href="login/index.html">Logout</a></li>
        </ul>

        <ul className="nav navbar-nav hidden">
          <li><a href="#" data-action="growl">Growl</a></li>
          <li><a href="login/index.html">Logout</a></li>
        </ul>
      </div>
  </div>
</nav>
  <div id="tf-search-results">
    <a href="#" id="closeModal"><span className="icon icon-cross"> close </span></a>
    <div id="tf-search-result-container">
      <ul id="tf-search-result"></ul>
    </div>
    <div id="tf-search-count"></div>
    <Link to={'/searchresult/'+searchkey} params={{searchkey:"searchkey"}}>
      <div id="show-more-btn-container" className="row show-more-btn-container col-md-12 col-sm-12 col-xs-12" style={showMoreStyle}>
        <div className="show-more-result-btn btn btn-pimary" >
          <b>See more results(5)</b>
        </div>
      </div>
    </Link>
    <div id="tf-search-result-stat"></div>
  </div>
</div>
      );
  }


});

module.exports = NavBar;