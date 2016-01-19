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
//var PostGridItem = require('./PostGridItem.jsx');
var PostGridItem = require('./PostGridItemNew.jsx');
var Link = require('react-router').Link;

var _postGridItems = [];

function toArray(obj) {
  var arr = [];
  for (key in obj) {
    obj[key].key = key;
    arr.push(obj[key]);
  }
  return arr;
}

var UserPostsGrid = React.createClass({

  propTypes: {
    upvotedTracks: ReactPropTypes.array,
    postedTracks: ReactPropTypes.array,
    onPostItemClick: ReactPropTypes.func
  },

  /**
   * @return {object}
   */
  render: function() {
    var upvoted = this.props.upvotedTracks;
    var posted = this.props.postedTracks;
    var postHeader = (posted.length > 0) ? <h1 className="tf-header">Posted Tracks</h1> : "";
    var upvoteHeader = (upvoted.length > 0) ? <h1 className="tf-header">Upvoted Tracks</h1> : "";
    var upvotedPosts = [];
    var postedPosts = [];
    var i = 0;
    for(key in upvoted) {
      var post = upvoted[key];
      var item = <PostGridItem onClick={this.props.onPostItemClick} key={post.key} trackIdx={i} post={post} currStreamUrl={this.props.currStreamUrl}/>
      upvotedPosts.push(item);
      i+=1;
    }
    i = 0;
    for(key in posted) {
      var post = posted[key];
      var item = <PostGridItem onClick={this.props.onPostItemClick} key={post.key} trackIdx={i} post={post} currStreamUrl={this.props.currStreamUrl}/>
      postedPosts.push(item);
    } 
    return (
      <div>
      <section id="user-posts">
        {postHeader}
        <ul id="post-grid" >{postedPosts}</ul>
        <div className="row tf-load-more-section">
            LOAD MORE FOR   <span className="">
                                <a>POSTED TRACKS</a>&nbsp;&nbsp;
                                <a>&#9660;</a>
                            </span>
        </div>
      </section>
      <section id="user-upvotes">
        {upvoteHeader}
        <ul id="post-grid" >{upvotedPosts}</ul>
      </section>
      </div>
    );
  }

});

module.exports = UserPostsGrid;
