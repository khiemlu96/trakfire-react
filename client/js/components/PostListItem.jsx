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

var PostListItem = React.createClass({

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
      <li className="tf-post-item">
        <span className="tf-post-item--votes col-xs-1">
        1
        </span>
        <span className="tf-post-item--img">
          <a href="#!" className="tf-post-play" onClick={this.playPauseTrack}>
            <img className="tf-thumbnail" src={post.thumbnail_url}/>
          </a>
        </span>
        <span className="tf-post-item--rank">1</span>
        <span className="tf-post-item--info">
          <h5> { post.title } </h5>
          <small> {post.artist } </small>
        </span>

      </li>
    );
  }

});

module.exports = PostListItem;

/*<li class="tf-post-item" data-src="<%=post.song.stream_url%>" data-img="<%= post.song.thumb_url %>" data-title="<%= post.song.title %>" data-artist="<%= post.song.artist %>">
  <span class="tf-post-item--votes col-xs-1">
    <a href="#" class="no_scroll_to_top tf-post-vote-btn">
      <span class="glyphicon glyphicon-triangle-top"></span><br>
      <span><%= post.votes.length %></span>
    </a>
  </span>
  <span class="tf-post-item--img">
    <a href="#" class="tf-post-play no_scroll_to_top" data-sid="<%= post.song.id %>" data-src="<%= post.song.stream_url %>" data-img="<%= post.song.thumb_url %>" data-title="<%= post.song.title %>" data-artist="<%= post.song.artist %>">
      <% if post.song.thumb_url %> 
        <img class="tf-thumbnail" src= "<%= post.song.thumb_url%>">
      <% else %>
        <%= image_tag 'no_album_art.jpg', :class => "tf-thumbnail" %>
      <% end %>
    </a>
  </span>
  <!--<span class="tf-post-item--rank">1</span>-->
  <span class="tf-post-item--info">
    <h5><%= post.song.title %></h5>
    <small><%= post.song.artist %></small>
  </span>
  <span class="tf-post-item--meta pull-right">
    <img src="<%= post.user.img %>" class="img-circle tf-user-avatar" height="30" >
    <div class="tf-tags">
      <% post.all_tags.split(",").each do |t|%>
        <span class="badge" style=" background-color: #ed2653; color: #fff;"><%= t %></span>
        <%end%>
    </div>
  </span>
</li>*/

