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

var ReactPropTypes = React.PropTypes;

var NavBar = React.createClass({

  propTypes: {
    isLoggedIn: ReactPropTypes.bool,
    origin: ReactPropTypes.string,
    isAdmin: ReactPropTypes.bool,
    user: ReactPropTypes.object
  },

  handleSignOut: function() {
    sessionStorage.setItem('jwt','');
    location = '/';
  },

  showModal: function() {
    this.props.showModal(true);
  },
  /**
   * @return {object}
   */
  render: function() {
    if(this.props.isLoggedIn) {
      var signinLink = <a href="#!" onClick={this.handleSignOut}> SIGN OUT </a>
      var profileLink = <Link to={'/profile/'+user.id} className="tf-uppercase">{this.props.user.handle}</Link>;
      //var emailLink = <Link to='/email?id=1'>EMAIL</Link>;
      if(this.props.isAdmin || this.props.user.canPost) { 
        var postLink = <Link to='/post'>POST</Link> 
      } else {
        var postLink = "";
      }
    } else {
      var signinLink = <a href={this.props.origin+'/request_token'}> SIGN IN </a>
      var profileLink = "";
      var postLink = '';
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
            {profileLink}
            {/*<a>             
              <img src={'assets/img/search.svg'}/> 
            </a>*/}
            {signinLink}
          </div>
        </div> 
      </div> 
      );
  }


});

module.exports = NavBar;