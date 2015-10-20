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
var PostList = require('./PostsList.jsx');
var PostGrid = require('./PostGrid.jsx');

var PostContainer = React.createClass({
  propTypes: {
    sort: ReactPropTypes.string,
    genre: ReactPropTypes.string,
    posts: ReactPropTypes.object,
    onSongItemClick: ReactPropTypes.func,
    onPostUpvoteClick: ReactPropTypes.func
  },

  /**
   * @return {object}
   */
  render: function() {
    console.log('RENDER THE POST CONTAINER ', this.props.posts, this.props.sort);
    if( this.props.sort == "TOP" ) { 
      var postView = <PostList ref="pcontainer" allPosts={this.props.posts} 
      genre={this.props.genre} 
      sort={this.props.sort} 
      onPostListItemClick={this.onSongItemClick}
      onPostUpvote={this.props.onPostUpvoteClick} />;
    } else if (this.props.sort == "NEW") {
      var postView = <PostGrid ref="pcontainer" allPosts={this.props.posts} 
      genre={this.props.genre} 
      sort={this.props.sort} 
      onPostListItemClick={this.onSongItemClick}
      onPostUpvote={this.props.onPostUpvoteClick} />;
    }
    return (
      <div className="container tf-content-container" > {postView} </div>
    );
  }


});

module.exports = PostContainer;
