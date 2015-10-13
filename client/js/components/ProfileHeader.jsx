/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var PostActions = require('../actions/PostActions');
var ReactPropTypes = React.PropTypes;

var ProfileHeader = React.createClass({

  propTypes: {
    currentUser: ReactPropTypes.object.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {

    return (
      <div>
        {this.props.currentUser.name}
        {this.props.currentUser.img}
        {this.props.currentUser.handle}
        {this.props.currentUser.description} 
      </div>
    );
  },


});

module.exports = ProfileHeader;
