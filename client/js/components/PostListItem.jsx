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
var PostActions = require('../actions/PostActions');

var classNames = require('classnames');

var isPlaying = classNames("tf-post-item is-playing");
var isNotPlaying = classNames("tf-post-item");
var isUpvoted = classNames("tf-post-item--votes is-upvoted");
var isNotUpvoted = classNames("tf-post-item--votes");

var PostListItem = React.createClass({

  propTypes: {
   key: ReactPropTypes.string.isRequired,
   post: ReactPropTypes.object,
   trackIdx: ReactPropTypes.number.isRequired,
   onClick: ReactPropTypes.func,
   onUpvote: ReactPropTypes.func,
  },
  getInitialState: function() {
    return {isPlaying:false, isUpvoted:false};
  }, 

  componentDidMount: function() {
    console.log("POST LIST ITEM ", this.props);
  } ,

  upvote: function(e) {
    e.preventDefault();
    //console.log('upvoting '+this.props.key);
    //PostActions.upvote('http://localhost:3000'+'/votes', this.props.post.id);
    this.props.onUpvote(this.props.post.id);
    this.setState({isUpvoted:true});
    console.log("UPVOTE", this.refs.upvotes);
  },

  playPauseTrack: function(e) {
    e.preventDefault();
    console.log("TRACK", this.props.trackIdx);
    this.props.onClick(this.props.post.stream_url, this.props.post);

    if(!this.state.isPlaying) {
      //this.refs.post.className += " is-playing";
      this.setState({isPlaying : true});
    }
    else {
      //this.refs.post.className = isNotPlaying;
      this.setState({isPlaying : false});
    }
    console.log("POST", this.state.isPlaying, this.refs.post);
  },
  /**
   * @return {object}
   */
  render: function() {
    var post = this.props.post;
    var key = this.props.key;
    console.log(key);
    return (
      <li className={this.state.isPlaying ? isPlaying : isNotPlaying} ref="post">
        <div className="tf-post-item-content">
          <div className={this.state.isUpvoted ? isUpvoted : isNotUpvoted} ref="upvotes" onClick={this.upvote}>
          { post.vote_count ? post.vote_count : 1 }
          </div>
          <div className="tf-post-item--img"> 
            <a href="#!" className="tf-post-play" onClick={this.playPauseTrack}>
              <img className="tf-thumbnail" src={post.img_url}/>
            </a>
            <div className="tf-overlay" onClick={this.playPauseTrack}> 
            </div> 
            <div className="tpf-play-button" onClick={this.playPauseTrack}> 
              <img src={'assets/img/player-play-white.svg'} /> 
            </div> 
            <div className="tpf-pause-button" onClick={this.playPauseTrack}> 
              <img src={'assets/img/player-pause-white.svg'} /> 
            </div> 


          </div>
          <div className="tf-post-item--rank">{" "}</div>
          <div className="tf-post-item--info">
            <h5> { post.title } </h5>
            <small> {post.artist } </small>
          </div>
          {/*<div className="tf-post-item--tags">
            <div className="tf-tag"> 
              HIP-HOP
            </div> 
            <div className="tf-tag"> 
              REMIX
            </div> 

          </div>*/}
        </div>
      </li>
    );
  }

});

module.exports = PostListItem;


