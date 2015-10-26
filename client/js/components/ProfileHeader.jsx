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

var ProfileHeader = React.createClass({

  propTypes: {
    userName: ReactPropTypes.string,
    userTwitterLink: ReactPropTypes.string,
    userBio: ReactPropTypes.string,
    userFacebookLink: ReactPropTypes.string,
    userImg: ReactPropTypes.string
  },

  componentDidMount: function() {
    //console.log(this.props);
  }, 
  /**
   * @return {object}
   */
  render: function() {
    return (
      <div className="tf-profile-wrapper"> 

        <img src={this.props.userImg} className="tf-profile-image"></img>

        <h1 className="tf-name">{this.props.userName}</h1> 
        <p className="tf-bio">{this.props.userBio}</p>

        <div className="tf-social-icons"> 
          {/*<img src="assets/img/facebook_share.svg"></img>*/}
          <a href={this.props.userTwitterLink}>
            <img src="assets/img/twitter_share.svg"></img>
          </a>
        </div>

      </div>
    );
  },


});
module.exports = ProfileHeader;
