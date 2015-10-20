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
var PostGridItem = require('./PostListItem.jsx');
var PostListDateHeader = require('./PostListDateHeader.jsx'); 
var PostStore = require('../stores/PostStore');

var _postGridItems = [];
var _dayCount = 0; 
var _init = false;

/*function sortPostsByDate(posts) {
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
}*/

function toArray(obj) {
  var arr = [];
  for (key in obj) {
    obj[key].key = key;
    arr.push(obj[key]);
  }
  return arr;
}

function sortNew(a, b) {
  da = new Date(a.date);
  db = new Date(b.date);

  if(da < db) return 1;
  if(da > db) return -1;
  return 0;
}

function getLength(a) {
  var i = 0;
  for(key in a){
    i++;
  }
  return i;
}

var PostsGrid = React.createClass({

  propTypes: {
    allPosts: ReactPropTypes.object.isRequired,
    sort: ReactPropTypes.string,
    genre: ReactPropTypes.string,
    onPostListItemClick: ReactPropTypes.func,
    loadSortedPlaylist: ReactPropTypes.func,
    onPostUpvote:ReactPropTypes.func
  },

  componentDidMount: function() {
    _postGridItems = [];
    var allPosts = this.props.allPosts;
    var sortedPosts = toArray(allPosts).sort(sortNew);
    var postGridItems = [];
    var playlist = [];

    for(var i = 0; i < sortedPosts.length; i++) {
      var post = sortedPosts[i];
      var item = <PostGridItem onClick={this.props.onPostListItemClick} key={post.key} trackIdx={i} post={post}/>
      postGridItems.push(item);
      playlist.push(post);
    }

    //this.loadSortedPlaylist(playlist);
    _postGridItems = postGridItems;
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    //either the sort or genre prop is different we know that the list should reload
    console.log("SORT", nextProps.sort, this.props.sort);
    console.log("GENRE", nextProps.genre, this.props.genre);
    var s = nextProps.sort !== this.props.sort || nextProps.genre !== this.props.genre;
    var p = (getLength(_postGridItems) - _dayCount) < getLength(this.props.allPosts) && !_init;
    if(p) { _init = true; }
    console.log( "Should update ", s + p);
    return s + p;
  },

  componentWillUpdate: function(nextProps, nextState) {
    _postGridItems = [];
    console.log("UPDATING THE POSTLIST");
    var allPosts = this.props.allPosts;
    var sortedPosts = toArray(allPosts).sort(sortNew);
    var postGridItems = [];
    var playlist = [];

    for(var i = 0; i < sortedPosts.length; i++) {
      var post = sortedPosts[i];
      var item = <PostGridItem onClick={this.props.onPostListItemClick} key={post.key} trackIdx={i} post={post}/>
      postGridItems.push(item);
      playlist.push(post);
    }

    //this.loadSortedPlaylist(playlist);
    _postGridItems = postGridItems; 
  }, 

  loadSortedPlaylist: function(playlist) {
    this.props.loadSortedPlaylist(playlist, playlist[0]);
  },
  
  /**
   * @return {object}
   */
  render: function() {
    console.log('RENDERING THE POSTGRID', _postGridItems);
    /*if (Object.keys(this.props.allPosts).length < 1) {
      return null;
    }*/
    _postGridItems = [];
    console.log("UPDATING THE POSTGrid ", allPosts);
    var allPosts = this.props.allPosts;
    var sortedPosts = toArray(allPosts);//.sort(sortNew);
    var postGridItems = [];
    //var playlist = [];
    console.log("Sorted Posts ", sortedPosts);
    for(var i = 0; i < sortedPosts.length; i++) {
      var post = sortedPosts[i];
      var item = <PostGridItem onClick={this.props.onPostListItemClick} key={post.key} trackIdx={i} post={post}/>
      postGridItems.push(item);
      //playlist.push(post);
    }

    //this.loadSortedPlaylist(playlist);
    _postGridItems = postGridItems;
    return (
      <section id="main">
        <ul id="post-grid" >{_postGridItems}</ul>
      </section>
    );
  }

});

module.exports = PostsGrid;
