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
var PostGridItem = require('./PostGridItem.jsx');

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
    onPostListItemClick: ReactPropTypes.func
  },

  /**
   * @return {object}
   */
  render: function() {

    var upvoted = this.props.upvotedTracks;
    var posted = this.props.postedTracks;
    var upvotedPosts = [];
    var postedPosts = [];
    var i = 0;
    for(key in upvoted) {
      var post = upvoted[key];
      var item = <PostGridItem onClick={null} key={post.key} trackIdx={i} post={post}/>
      upvotedPosts.push(item);
      i+=1;
    }
    i = 0;
    for(key in posted) {
      var post = posted[key];
      var item = <PostGridItem onClick={null} key={post.key} trackIdx={i} post={post}/>
      postedPosts.push(item);
    } 
    console.log("USER'S POSTS ", postedPosts, upvotedPosts);
    return (
      <div>
      <section id="user-posts">
        <h1 className="tf-name">Posted Tracks</h1>
        <ul id="post-grid" >{postedPosts}</ul>
      </section>
      {/*<section id="user-upvotes">
        <h1 className="tf-name">Upvoted Tracks</h1>
        <ul id="post-grid" >{upvotedPosts}</ul>
      </section>*/}
      </div>
    );
  }

});

module.exports = UserPostsGrid;