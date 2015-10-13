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
    allPosts: ReactPropTypes.object.isRequired,
    sort: ReactPropTypes.string,
    genre: ReactPropTypes.string,
    onPostListItemClick: ReactPropTypes.func,
    loadSortedPlaylist: ReactPropTypes.func,
  },

  componentDidMount: function() {
    _postListItems = [];
    var allPosts = this.props.allPosts;
    var processedPosts = sortPostsByDate(allPosts);
    var postsByDate = processedPosts[1];
    //var sortRef = processedPosts[0].sort().reverse();
    var sortRef = processedPosts[0].sort(sortDate);
    
    console.log("SORTED DATES TO ", sortRef, processedPosts[0]);
    //console.log(postsByDate[sortRef[0]]);
    var postListItems = [];
    var playlist = [];
    var count = 0;
    for (var date in sortRef) {
      postListItems.push(<PostListDateHeader key={'d_'+date} date={sortRef[date].toString()}/>);
      //sort the posts in that day by their score attribute or sort by create_at
      /*
      if(this.props.sort == "TOP")
        postsByDate[sortRef[date]].sort(compareScore);
      else if(this.props.sort == "NEW")
        postsByDate[sortRef[date]].sort(compareCreatedAt);
      */
      //filter by genre held in state.genre
      for (var postKey in postsByDate[sortRef[date]]) {
        if(this.props.genre == "ALL" || this.props.genre == "" ){
          playlist.push(postsByDate[sortRef[date]][postKey]);
          postListItems.push(<PostListItem 
                                  key={postKey} 
                                  post={postsByDate[sortRef[date]][postKey]} 
                                  onClick={this.props.onPostListItemClick}
                                  trackIdx={count} />);
        }
        else if(this.props.genre == "ELECTRONIC"){
          if(postsByDate[sortRef[date]][postKey].genre == "Electronic") {
            playlist.push(postsByDate[sortRef[date]][postKey]);
            postListItems.push(<PostListItem 
                                  key={postKey} 
                                  post={postsByDate[sortRef[date]][postKey]} 
                                  onClick={this.props.onPostListItemClick}
                                  trackIdx={count} />);
          }
        }
        else if(this.props.genre == "HIPHOP"){
          if(postsByDate[sortRef[date]][postKey].genre == "Hip Hop / R&B") {
            playlist.push(postsByDate[sortRef[date]][postKey]);
            postListItems.push(<PostListItem 
                                  key={postKey} 
                                  post={postsByDate[sortRef[date]][postKey]} 
                                  onClick={this.props.onPostListItemClick}
                                  trackIdx={count} />);   
          }     
        }
        count += 1;
      }
    }
    this.loadSortedPlaylist(playlist);
    _postListItems = postListItems;
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    //either the sort or genre prop is different we know that the list should reload
    console.log("SORT", nextProps.sort, this.props.sort);
    console.log("GENRE", nextProps.genre, this.props.genre);
    var s = nextProps.sort !== this.props.sort || nextProps.genre !== this.props.genre;
    //var i = _postListItems.length == 0 && !_init
    var p = (getLength(_postListItems) - _dayCount) < getLength(this.props.allPosts) && !_init;
    if(p) { _init = true; }
    console.log( "Should update ", s + p);
    return s + p;
  },

  componentWillUpdate: function(nextProps, nextState) {
    _postListItems = [];
    console.log("UPDATING THE POSTLIST");
    var allPosts = this.props.allPosts;
    var processedPosts = sortPostsByDate(allPosts);
    var postsByDate = processedPosts[1];
    //var sortRef = processedPosts[0].sort().reverse();
    var sortRef = processedPosts[0].sort(sortDate);

    var sortRef = processedPosts[0].sort(sortDate);
    
    console.log("SORTED DATES TO ", sortRef, processedPosts[0]);

    var postListItems = [];
    var playlist = [];
    var count = 0;
    //console.log(processedPosts);
    for (var date in sortRef) {
      postListItems.push(<PostListDateHeader key={'d_'+date} date={sortRef[date].toString()}/>);
      //sort the posts in that day by their score attribute or sort by create_at
      /*
      if(this.props.sort == "TOP")
        postsByDate[sortRef[date]].sort(compareScore);
      else if(this.props.sort == "NEW")
        postsByDate[sortRef[date]].sort(compareCreatedAt);
      */
      //filter by genre held in state.genre
      for (var postKey in postsByDate[sortRef[date]]) {
        if(nextProps.genre == "ALL" || nextProps.genre == ""){
          playlist.push(postsByDate[sortRef[date]][postKey]);
          postListItems.push(<PostListItem 
                                  key={postKey} 
                                  post={postsByDate[sortRef[date]][postKey]} 
                                  onClick={nextProps.onPostListItemClick}
                                  trackIdx={count} />);
        }
        else if(nextProps.genre == "ELECTRONIC"){
          if(postsByDate[sortRef[date]][postKey].genre == "Electronic") {
            playlist.push(postsByDate[sortRef[date]][postKey]);
            postListItems.push(<PostListItem 
                                  key={postKey} 
                                  post={postsByDate[sortRef[date]][postKey]} 
                                  onClick={nextProps.onPostListItemClick}
                                  trackIdx={count} />);
            }
        }
        else if(nextProps.genre == "HIPHOP"){
          if(postsByDate[sortRef[date]][postKey].genre == "Hip Hop / R&B") {
            playlist.push(postsByDate[sortRef[date]][postKey]);
            postListItems.push(<PostListItem 
                                  key={postKey} 
                                  post={postsByDate[sortRef[date]][postKey]} 
                                  onClick={nextProps.onPostListItemClick}
                                  trackIdx={count} />);        
          }
        }
        count += 1;
      }
    }
    this.loadSortedPlaylist(playlist);
    _postListItems = postListItems; 
  }, 

  loadSortedPlaylist: function(playlist) {
    this.props.loadSortedPlaylist(playlist, playlist[0]);
  },
  
  /**
   * @return {object}
   */
  render: function() {
    console.log('RENDERING THE POSTLIST', _postListItems);
    /*if (Object.keys(this.props.allPosts).length < 1) {
      return null;
    }*/

    //use sort ref to sort the dates in DESC order
    return (
      <section id="main">
        <ul id="Post-list" className="tf-post-list" >{_postListItems}</ul>
      </section>
    );
  }

});

module.exports = PostsList;
