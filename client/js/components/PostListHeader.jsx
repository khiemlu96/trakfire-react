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

var PostListHeader = React.createClass({

  propTypes: {
   post: ReactPropTypes.object,
  },

  componentWillMount: function() {
    console.log("WILL MOUNT THE HEADER");
  },

  componentDidMount: function() {
    console.log("MOUNTING THE HEADER");
  }, 

  /*getInitialState: function() {
    return {isPlaying:false, isUpvoted:false, hasUpvoted:false};
  },*/

  /*upvote: function(e) {
    e.preventDefault();
    this.PostActions.upvote(this.props.key);
  },

  playPauseTrack: function(e) {
    e.preventDefault();
    console.log("TRACK", this.props.trackIdx);
    this.props.onClick(this.props.post.stream_url, this.props.post);
    if(!this.state.isPlaying) {
      //this.refs.post.className += " is-playing";
      this.setState({isPlaying : true});
      mixpanel.track("Track Play");
    }
    else {
      //this.refs.post.className = isNotPlaying;
      this.setState({isPlaying : false});
      mixpanel.track("Track Pause");
    }
    console.log("POST", this.state.isPlaying, this.refs.post);
  },*/

  /**
   * @return {object}
   */
  render: function() {
    var post = this.props.post;
    var background_img = { backgroundImage: "url("+post.img_url_lg+")" };
    return(
      <div className="profile-header text-center">

        <div className="tf-header-background" style={background_img}></div>
        <div className="tf-header-background-overlay">
          <img src="assets/img/polygon_overlay.png" alt="..."></img>
        </div>

        <div className="container">
          <div className="container-inner-home">
            <div className="row no-gutter">

              <div className="col-md-offset-2 col-md-3">
                <div className="tf-header-thumbnail">
                    <img src={post.img_url_lg} alt="..."></img>
                </div>
              </div>

              <div className="col-md-7">
                <div className="tf-header-info">
                    <h4>{post.title}</h4>
                    <h6>{post.artist}</h6>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div> 
    );}

});

module.exports = PostListHeader;