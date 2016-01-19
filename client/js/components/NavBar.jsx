/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');

var Router = require('react-router');
var Link = Router.Link;

var PostForm = require('./PostForm.jsx');
var SearchBar = require('./SearchBar.jsx');
var Bootstrap = require('react-bootstrap');
var Tooltip = Bootstrap.Tooltip;
var OverlayTrigger = Bootstrap.OverlayTrigger;
var Popover = Bootstrap.Popover;
var ReactPropTypes = React.PropTypes;

var UserStyle = { top:38, maxWidth:'80%', backgroundColor: '#1c1c1c', border:'1px solid #2b2b2b'};
var searchIconStyle = {cursor: 'pointer'};

var NavBar = React.createClass({

  propTypes: {
    isLoggedIn: ReactPropTypes.bool,
    origin: ReactPropTypes.string,
    isAdmin: ReactPropTypes.bool,
    user: ReactPropTypes.object, 
    showSignupModal: ReactPropTypes.func,
    onPostItemClick: ReactPropTypes.func,
    currStreamUrl: ReactPropTypes.string
  },

  handleSignOut: function() {
    sessionStorage.setItem('jwt','');
    location = '/';
  },

  showModal: function() {
    this.props.showModal(true);
  },

  closeModal: function() {
    this.props.showModal(false);
  }, 

  showSignupModal: function() {
    this.props.showSignupModal();
  }, 

  renderUserInfo: function(){
    return <OverlayTrigger trigger="click" rootClose placement="bottom" 
              overlay={ 
                        <Popover className="tf-notification-popup col-md-4" id="tf-post-detail-popup" style={UserStyle} >
                            <div className="tf-popup-profile-link" onClick={() => this.hide()}> GO TO YOUR <Link to={'/profile/'+2}>PROFILE</Link> </div>
                              <div className="tf-notification-content">
                                <div className="">
                                  <div className="" >
                                    <div className="tf-notification-auther">
                                       <Link to={'/profile/'+2} className="tf-link">
                                        <img className="tf-author-img" src={"https://pbs.twimg.com/profile_images/668573362738696193/g0-CxwLx_400x400.png"}></img>
                                       </Link>
                                    </div>
                                    <div className="tf-notification-title">
                                      <a className="tf-profile-link"> Arjun Mehta</a> 
                                      <small> 4 - Hours ago </small>
                                      <div> Commented on your trak.</div>
                                    </div> 
                                    <div className="button tf-follow-button"> Following </div>
                                  </div>
                                </div>
                              </div>
                            <div className="tf-popup-profile-link" onClick={() => this.hide()} > VIEW ALL <Link to={'/notifications'}>NOTIFICATIONS <span className="tf-notification-link"></span></Link></div>
                        </Popover>
                      }>
              <span className="tf-firestarters-upvotes-count">
                <img className='tf-author-img' src={this.props.user.img}></img>
              </span>
            </OverlayTrigger>
  },

  /**
   * @return {object}
   */
  render: function() {
    if(this.props.isLoggedIn) {
      console.log("IN NAVBAR");
      var signinLink = <a href="#!" onClick={this.handleSignOut}> SIGN OUT </a>
      var profileLink = <span className="tf-menu">{this.renderUserInfo()}</span>
      //if(this.props.isAdmin || this.props.user.canPost) { 
        
      var postLink = <span className="tf-menu"><PostForm isVisible={true} origin={this.props.origin} /></span> 
      var searchIcon =  <span><SearchBar 
                              isVisible={true} 
                              currStreamUrl={this.props.currStreamUrl}
                              onPlayBtnClick={this.props.onPostItemClick} /></span>
      /*} else {
        var tooltip = <Tooltip>Posting is invite only</Tooltip>;
        var postLink = <OverlayTrigger placement="left" overlay={tooltip}><a className="tf-inactive">POST</a></OverlayTrigger>;//<a href="" className="tf-inactive">POST</a>;
      }*/
    } else {
      var signinLink = <a href="#" onClick={this.showModal}> SIGN IN </a>
      var inviteLink = <a href="#" onClick={this.showSignupModal}> REQUEST INVITE </a>
      var profileLink = "";
      var postLink = '';
      var searchIcon = '';
      //var emailLink = <Link to='/email?id=1'>EMAIL</Link>;
    }
  
    return (
      <div className="tf-navbar" role="navigation"> 
        
        <div className="tf-navbar-inner container">   
          <div className="tf-logo"> 
            <Link to="/"><img src={"assets/img/logo.svg"}/></Link>
          </div> 
          
          <div className="right"> 
            {postLink}
            {searchIcon}
            {profileLink}
            {/*<a>             
              <img src={'assets/img/search.svg'}/> 
            </a>*/}
            {signinLink}
            {inviteLink}
          </div>
        </div> 
      </div> 
      );
  }


});

module.exports = NavBar;