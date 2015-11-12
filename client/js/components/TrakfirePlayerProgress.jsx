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

function getSecondsFromMilli(milliseconds) {
  return milliseconds * 0.001; 

}

var TrakfirePlayerProgress = React.createClass({

  propTypes: {
    isPlaying: ReactPropTypes.bool,
    duration: ReactPropTypes.number,
    handleClickAtPos: ReactPropTypes.func
  },

  componentDidMount: function() {
    this.timer = setInterval(this.advancePos, 1000);
  }, 

  componentWillUpdate: function(nextProps, nextState){
    var isPlaying = nextProps.isPlaying;
    if(!isPlaying) { 
      //if the track is not playing in nextState it will be paused
      //clear the timer
      clearInterval(this.timer);
    } else if(nextProps.isPlaying && !this.props.isPlaying) {
      //else if the track is paused in nextProps and is paused currently 
      //restart the timer
      this.timer = setInterval(this.advancePos, 1000);
    }
  }, 

  componentWillUnmount: function(){
    clearInterval(this.timer);
  },

  getInitialState: function() {
    return {currPos:0};
  }, 

  handleClickAtPos: function() {
    var pos = this.state.currPos;
    this.props.handleClickAtPos(pos);
  }, 

  advancePos: function() {
    var duration = this.props.duration; 
    var pos = this.state.currPos + 1000;
    this.setState({currPos: pos});
  }, 

  render: function() {
    var curr = this.state.currPos;
    var duration = this.props.duration;
    var value = Math.round((curr/duration)*100);
    console.log("CURR", curr, "DUR", duration, "VALUE", value);
    if (value < 0) {value = 0};
    if (value >= duration) {value = 100};

    var style = {
      backgroundColor: this.props.color || '#ff0d55',
      width: value + '%',
      transition: "width 200ms",
      height: this.props.height || 3
    };

    return (
      <div className="tf-progress-container" >
        <div className="tf-progress-inner" style={style}></div>
      </div>
    );
  }
});

module.exports = TrakfirePlayerProgress;
