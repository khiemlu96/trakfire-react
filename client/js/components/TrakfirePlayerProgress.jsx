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

var TrakfirePlayerProgress = React.createClass({

  propTypes: {
    duration: ReactPropTypes.number
  },

  componentDidMount: function() {},
  
  /**
   * @return {object}
   * NOTE: Im not 100% sure how the progress bar will work with the slider
   * Im assuming if you position it (absolute) above the bar i can use javascript to calculate 
   * the track position and adjust the track accordingly
   * You may even just replace the <progress> with a regular <div> with a background
   */
  render: function() {
    return (
      <div className="tf-player-inline"><div id="marker"></div> 
      <progress value="0" min="0" max="100"></progress></div>
    );
  },


});

module.exports = TrakfirePlayerProgress;
