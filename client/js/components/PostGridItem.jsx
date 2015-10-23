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

var PostGridItem = React.createClass({

  propTypes: {
   key: ReactPropTypes.string,
   post: ReactPropTypes.object,
   trackIdx: ReactPropTypes.number.isRequired,
   onClick: ReactPropTypes.func
  },

  getInitialState: function() {
    return {};
  },

  upvote: function(e) {
    e.preventDefault();
    this.PostActions.upvote(this.props.key);
  },

  playPauseTrack: function(e) {
    e.preventDefault();
    console.log("TRACK", this.props.trackIdx);
    this.props.onClick(this.props.trackIdx);
  },
  /**
   * @return {object}
   */
  render: function() {
    var post = this.props.post;

    return (
      <li className="tf-post-grid">
        <div className="tf-post-item-content">
          <div className="tf-post-item--votes">
          {post.vote_count}
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

          <div className="tf-post-item--rank">1</div>
          <div className="tf-post-item--info">
            <h5> { post.title } </h5>
            <small> {post.artist } </small>
          </div>
          <div className="tf-post-item--tags">
            <div className="tf-tag"> 
              HIP-HOP
            </div> 
            <div className="tf-tag"> 
              REMIX
            </div> 

          </div>
        </div>
      </li>
    );
  }

});

module.exports = PostGridItem;


