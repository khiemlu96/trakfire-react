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

function renderPostsByDate(dates, posts) {
  console.log(posts, dates);
  var container = [];
  for(date in dates) {
    var dateHeader = <PostListDateHeader key={'d_'+date} date={dates[date].toString()}/>
    container.push(dateHeader);
    //console.log(posts[dates[date]]);
    for(key in posts[dates[date]]) {
      //console.log(key);
      var post = <PostListItem 
                    key={"p_"+key} 
                    post={posts[dates[date]][key]}
                    onUpvote={this.upvote}
                    onClick={this.playPauseItem} />
      container.push(post);           
    }
  }
  return container;
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
    //console.log("PROPS PASSED ", this.props)

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
    var postsByDate = sortPostsByDate(posts); //sort posts into date keyed dict + array of date str for the headers
    var dates = postsByDate[0].sort(sortDate); //sort dates in decending order
    var posts = postsByDate[1]; //date keyed dict

    _postListItems = [];
    _postListItems = renderPostsByDate(dates, posts); // return a list of <PostListDateHeader/> <PostListItems/>

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
