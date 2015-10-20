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
var PostListItem = require('./PostListItem.jsx');
var PostListDateHeader = require('./PostListDateHeader.jsx'); 
var PostStore = require('../stores/PostStore');

var _postListItems = [];
var _dayCount = 0; 
var _init = false;

function sortPostsByDate(posts) {
  var dates = {};
  var dateKeys = [];
  for (var key in posts) {
    var dstr = posts[key].date.toDateString();
    if( !dates[dstr] ) {
      dates[dstr] = {};
      dateKeys.push(dstr);
      dates[dstr][key] = posts[key];
      _dayCount+=1;
    } 
    else {
      dates[dstr][key] = posts[key];
    }
  }
  console.log(dates, dateKeys);
  return [dateKeys, dates];
}

function sortDate(a, b) {
  if(new Date(a) < new Date(b)) { return 1; }
  if(new Date(a) > new Date(b)) { return -1; }
  return 0;
}

function compareScore(a, b) {
  if(a.score < b.score) return -1;
  else if(a.score > b.score) return 1;
  else if(a.score == b.score) return 1;
  return 0;
}

function compareCreatedAt(a, b) {
  if(a.created_at < b.created_at) return -1;
  else if(a.created_at > b.created_at) return 1;
  else if(a.created_at == b.created_at) return 1;
  return 0;
}

function getLength(a) {
  var i = 0;
  for(key in a){
    i++;
  }
  return i;
}

var PostsList = React.createClass({

  propTypes: {
    posts: ReactPropTypes.object.isRequired,
    sort: ReactPropTypes.string,
    genre: ReactPropTypes.string,
    onPostListItemClick: ReactPropTypes.func,
    loadSortedPlaylist: ReactPropTypes.func,
    onPostUpvote:ReactPropTypes.func
  },

  componentDidMount: function() {
    var posts = this.props.posts;
    //console.log('Posts to be displayed ', posts);
    console.log("PROPS PASSED ", this.props)
  },
  componentWillMount: function() {
    var posts = this.props.posts;
    //console.log('Posts to be displayed ', posts);
  },
  upvote: function(postid) {
    this.props.onPostUpvote(postid);
  },

  playPauseItem: function(stream_url, track) {
    this.props.onPostListItemClick(stream_url, track);
  },
  /**
   * @return {object}
   */
  render: function() {
    var posts = this.props.posts;
    _postListItems = [];
    for(key in posts) {
          _postListItems.push(<PostListItem 
                                  key={"p_"+key} 
                                  post={posts[key]}
                                  onUpvote={this.upvote}
                                  onClick={this.playPauseItem}
                                   />);
    }
    return (
      <div className="container tf-content-container" >
      <section id="main">
        <ul id="Post-list" className="tf-post-list" >{_postListItems}</ul>
      </section>
      </div>
    );
  }

});

module.exports = PostsList;
