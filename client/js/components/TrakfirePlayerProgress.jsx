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

function seconds2time (milliseconds) {
    var seconds = milliseconds * 0.001;
    var hours   = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var seconds = Math.floor(seconds - (hours * 3600) - (minutes * 60));
    var time = "";

    minutes = (minutes < 10) ? "0" + minutes : String(minutes);
    time += minutes + ":";
    
    time += (seconds < 10) ? "0" + seconds : String(seconds);
    
    return time;
}

var TrakfirePlayerProgress = React.createClass({

  propTypes: {
    isPlaying: ReactPropTypes.bool,
    duration: ReactPropTypes.number,
    onProgressClick: ReactPropTypes.func,
    toggle: ReactPropTypes.bool,
    showTrackDuration: ReactPropTypes.bool
  },

  componentDidMount: function() {
    this.timer = setInterval(this.advancePos, 1000);
   // console.log("0", this.timer);
  }, 

  componentWillUpdate: function(nextProps, nextState){
    var isPlaying = nextProps.isPlaying;
    //console.log("PLAYING OR TOGGLE", isPlaying, this.props.toggle);
    if(!isPlaying || (!this.props.toggle && nextProps.toggle) || this.state.hasFinished) { 
      //if the track is not playing in nextState it will be paused
      //clear the timer
      //console.log("1", this.timer);
      //console.log("PAUSED BRUH");
      clearInterval(this.timer);
      if(this.state.hasFinished) {
        this.setState({hasFinished:false});
      }

    } else if(nextProps.isPlaying && !this.props.isPlaying ) {
      //else if the track is paused in nextProps and is paused currently 
      //restart the timer
      //console.log("PAUSED H BRUH");
      this.timer = setInterval(this.advancePos, 1000);
      //console.log("2",this.timer);
    } else if(nextProps.toggle != this.props.toggle) {
      //console.log("KILLER BRUH");
      this.setState({currPos:0});
      this.timer = setInterval(this.advancePos, 1000);
      //console.log("3",this.timer);
    }
  }, 

  componentWillUnmount: function(){
    clearInterval(this.timer);
  },

  getInitialState: function() {
    return {currPos:0, hasFinished:false};
  }, 

  handleClickAtPos: function(event) {
    var el = this.refs.progressbar.getDOMNode();
    var rect = el.getBoundingClientRect();
    var left = rect.left;
    var nextPos = event.clientX - left;
    var w = rect.width;
    var p = nextPos/w;
    var milliPos = this.props.duration * p.toFixed(2);
    console.log(w, nextPos, milliPos, p);
    var pos = this.state.currPos;
    this.setState({currPos:Math.round(milliPos)});
    this.props.onProgressClick(milliPos);
  }, 

  advancePos: function() {
    var duration = this.props.duration; 

    var pos = this.state.currPos + 1000;
    if(this.state.currPos >= duration) {
      pos = 0;
      this.setState({hasFinished:true});
      clearInterval(this.timer);
    }
    this.setState({currPos: pos});
  }, 

  render: function() {
    var curr = this.state.currPos;
    var duration = this.props.duration;
    var value = Math.round((curr/duration)*100);

    if (value < 0) {value = 0};
    if (value >= duration) {value = 100};

    var timePassed = seconds2time(curr);
    var timeRemained = seconds2time(duration - curr);

    var style = {
      backgroundColor: this.props.color || '#ff0d55',
      width: value + '%',
      transition: "width 100ms",
      height: this.props.height || 5
    };

    var scrubberStyle = {
      left: (value-1) + '%',
      transition: "left 100ms"
    };

    if(this.props.showTrackDuration === true) {
      var timePassedHtml = <div className="tf-playbackTimeline-timePassed left">{timePassed}</div>;
      var timeRemainedHtml = <div className="tf-playbackTimeline-timeRemained right">{"-" + timeRemained}</div>
    } else {
      var timePassedHtml = '';
      var timeRemainedHtml = '';
    }   

    return (
      <div>
        {timePassedHtml}
        {timeRemainedHtml}
        <div id="tf-progress-bar" className="tf-progress-container" ref="progressbar" onClick={this.handleClickAtPos}>
          <div className="tf-progress-inner" style={style}></div>
          <div id="progress-scrubber" className="tf-progress-scrubber" style={scrubberStyle}></div>          
        </div>        
      </div>
    );
  }
});

module.exports = TrakfirePlayerProgress;
