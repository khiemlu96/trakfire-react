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
var PostListItem = require('./PostListItem.react');
var PostListDateHeader = require('./PostListDateHeader.react'); 
var PostStore = require('../stores/PostStore');

function sortPostsByDate(posts) {
  var dates = {};
  var dateKeys = [];
  for (var key in posts) {
    //console.log(key);
    if( !dates[ posts[key].date] ) {
      dates[ posts[key].date] = {};
      dateKeys.push(posts[key].date);
      dates[posts[key].date][key] = posts[key];
    } 
    else {
      dates[posts[key].date][key] = posts[key];
    }
  }
  //console.log(dates, dateKeys);
  return [dateKeys, dates];
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


var PostsList = React.createClass({

  propTypes: {
    allPosts: ReactPropTypes.object.isRequired,
    sort: ReactPropTypes.string,
    genre: ReactPropTypes.string
  },
  /**
   * @return {object}
   */
  render: function() {
    console.log('render postslist');
    /*if (Object.keys(this.props.allPosts).length < 1) {
      return null;
    }*/

    var allPosts = this.props.allPosts;
    var processedPosts = sortPostsByDate(allPosts);
    var postsByDate = processedPosts[1];
    var sortRef = processedPosts[0].sort().reverse();
    //console.log(postsByDate[sortRef[0]]);
    var postListItems = [];
    //use sort ref to sort the dates in DESC order

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
        if(this.props.genre == "ALL"){
          postListItems.push(<PostListItem key={postKey} post={postsByDate[sortRef[date]][postKey]}/>);
        }
        else if(this.props.genre == "ELECTRONIC"){
          if(postsByDate[sortRef[date]][postKey].genre == "Electronic") 
            postListItems.push(<PostListItem key={postKey} post={postsByDate[sortRef[date]][postKey]}/>);
        }
        else if(this.props.genre == "HIPHOP"){
          if(postsByDate[sortRef[date]][postKey].genre == "Hip Hop / R&B") 
            postListItems.push(<PostListItem key={postKey} post={postsByDate[sortRef[date]][postKey]}/>);         
        }
      }
    }

    return (
      <section id="main">
        <ul id="Post-list" className="tf-post-list" >{postListItems}</ul>
      </section>
    );
  }

});

module.exports = PostsList;
