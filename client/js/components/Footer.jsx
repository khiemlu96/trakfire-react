/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;

var Footer = React.createClass({

  /**
   * @return {object}
   */
  render: function() {

  	return (
      <footer className="tf-footer">
        <div className="tf-footer-inner container">
          <div className="tf-logo-footer"> 
            <img src={"assets/img/logo_footer.svg"}/> 
          </div> 
          <a href="#!">MISSION</a>
          <a href="#!">CONTACT</a>
          <a href="#!">TERMS OF SERVICE</a>
          <a href="#!">PRIVACY POLICY</a>
        </div>
      </footer>
    );
  },

  /**
   * Event handler to delete all completed TODOs
   */
  _onClearCompletedClick: function() {
    TodoActions.destroyCompleted();
  }

});

module.exports = Footer;
