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

var FilterBar = React.createClass({

  propTypes: {
    onClick: ReactPropTypes.func.isRequired
  },

  componentDidMount: function() {
    this.props.onClick("ALL", "TOP");
  },

  handleAllClick: function() {
    this.props.onClick("ALL", null);
  },

  handleElectronicClick: function() {
    this.props.onClick("ELECTRONIC", null);
  },

  handleHipHopClick: function(){
    this.props.onClick("HIPHOP", null);
  },

  handleTopClick: function(){
    this.props.onClick(null, "TOP");
  },

  handleNewClick: function(){
    this.props.onClick(null, "NEW");
  },
  
  /**
   * @return {object}
   */
  render: function() {
    return (
      <div className="mxn1">
        <a href="#!" 
          className="btn button-narrow" 
          onClick={this.handleAllClick}>
          All
        </a>
        <a href="#!" 
          className="btn button-narrow" 
          onClick={this.handleElectronicClick}>
          Electronic
        </a>
        <a href="#!" className="btn button-narrow" 
          onClick={this.handleHipHopClick} >
          Hip Hop
        </a>
      </div>
    );
  },


});

module.exports = FilterBar;
