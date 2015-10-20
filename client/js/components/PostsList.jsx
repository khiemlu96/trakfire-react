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
    _postListItems = [];
    var allPosts = this.props.posts;
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
      for (var postKey in postsByDate[sortRef[date]]) {
        if(this.props.genre == "ALL" || this.props.genre == "" ){
          playlist.push(postsByDate[sortRef[date]][postKey]);
          console.log('THE FUCKING POST KEY');
          postListItems.push(<PostListItem 
                                  key={"p_"+postKey} 
                                  post={postsByDate[sortRef[date]][postKey]} 
                                  onClick={this.props.onPostListItemClick}
                                  trackIdx={count} 
                                  onUpvote={this.onPostUpvote}/>);
        }
        else if(this.props.genre == "ELECTRONIC"){
          if(postsByDate[sortRef[date]][postKey].genre == "Electronic") {
            playlist.push(postsByDate[sortRef[date]][postKey]);
            postListItems.push(<PostListItem 
                                  key={postKey} 
                                  post={postsByDate[sortRef[date]][postKey]} 
                                  onClick={this.props.onPostListItemClick}
                                  trackIdx={count} 
                                  onUpvote={this.onPostUpvote}/>);
          }
        }
        else if(this.props.genre == "HIPHOP"){
          if(postsByDate[sortRef[date]][postKey].genre == "Hip Hop / R&B") {
            playlist.push(postsByDate[sortRef[date]][postKey]);
            postListItems.push(<PostListItem 
                                  key={postKey} 
                                  post={postsByDate[sortRef[date]][postKey]} 
                                  onClick={this.props.onPostListItemClick}
                                  trackIdx={count} 
                                  onUpvote={this.onPostUpvote}/>);   
          }     
        }
        count += 1;
      }
    }
    this.loadSortedPlaylist(playlist);
    _postListItems = postListItems;
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    var s = nextProps.sort !== this.props.sort || nextProps.genre !== this.props.genre;
    //var i = _postListItems.length == 0 && !_init
    var p = (getLength(_postListItems) - _dayCount) < getLength(this.props.allPosts) && !_init;
    if(p) { _init = true; }
    return s + p;
  },

  componentWillUpdate: function(nextProps, nextState) {
    _postListItems = [];
    console.log("UPDATING THE POSTLIST");
    var allPosts = this.props.posts;
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
      //filter by genre held in state.genre
      for (var postKey in postsByDate[sortRef[date]]) {
        if(nextProps.genre == "ALL" || nextProps.genre == ""){
          playlist.push(postsByDate[sortRef[date]][postKey]);
          console.log("FUCK ", postKey);
          postListItems.push(<PostListItem 
                                  key={"p_"+postKey} 
                                  post={postsByDate[sortRef[date]][postKey]} 
                                  onClick={nextProps.onPostListItemClick}
                                  trackIdx={count}
                                  onUpvote={this.onPostUpvote} />);
        }
        else if(nextProps.genre == "ELECTRONIC"){
          if(postsByDate[sortRef[date]][postKey].genre == "Electronic") {
            playlist.push(postsByDate[sortRef[date]][postKey]);
            postListItems.push(<PostListItem 
                                  key={postKey} 
                                  post={postsByDate[sortRef[date]][postKey]} 
                                  onClick={nextProps.onPostListItemClick}
                                  trackIdx={count} 
                                  onUpvote={this.onPostUpvote}/>);
            }
        }
        else if(nextProps.genre == "HIPHOP"){
          if(postsByDate[sortRef[date]][postKey].genre == "Hip Hop / R&B") {
            playlist.push(postsByDate[sortRef[date]][postKey]);
            console.log("FUCK ", postkey);
            postListItems.push(<PostListItem 
                                  key={postKey} 
                                  post={postsByDate[sortRef[date]][postKey]} 
                                  onClick={nextProps.onPostListItemClick}
                                  trackIdx={count} 
                                  onUpvote={this.onPostUpvote}/>);        
          }
        }
        count += 1;
      }
    }
    //this.loadSortedPlaylist(playlist);
    console.log("ITEMS BITCH ", postListItems);
    _postListItems = postListItems; 
  }, 

  loadSortedPlaylist: function(playlist) {
    //this.props.loadSortedPlaylist(playlist, playlist[0]);
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
      <div className="container tf-content-container" >
      <section id="main">
        <ul id="Post-list" className="tf-post-list" >{_postListItems}</ul>
      </section>
      </div>
    );
  }

});

module.exports = PostsList;
