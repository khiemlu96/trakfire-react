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

function sortPostsByDate(posts) {
  var dates = {};
  var dateKeys = [];
  for (var key in posts) {
    console.log(key);
    if( !dates[ posts[key].date] ) {
      dates[ posts[key].date] = {};
      dateKeys.push(posts[key].date);
      dates[posts[key].date][key] = posts[key];
    } 
    else {
      dates[posts[key].date][key] = posts[key];
    }
  }
  console.log(dates, dateKeys);
  return [dateKeys, dates];
}

var PostsList = React.createClass({

  propTypes: {
    allPosts: ReactPropTypes.object.isRequired
  }, 

  /**
   * @return {object}
   */
  render: function() {
    console.log('reder postslist');
    // This section should be hidden by default
    // and shown when there are Trakfires.
    if (Object.keys(this.props.allPosts).length < 1) {
      return null;
    }

    var allPosts = this.props.allPosts;
    var processedPosts = sortPostsByDate(allPosts);
    var postsByDate = processedPosts[1];
    var sortRef = processedPosts[0].sort().reverse();
    console.log(postsByDate[sortRef[0]]);
    var postListItems = [];
    //use sort ref to sort the dates in DESC order

    for (var date in sortRef) {
      postListItems.push(<PostListDateHeader date={sortRef[date].toString()}/>);
      for (var postKey in postsByDate[sortRef[date]]) {
        console.log(postKey);
        postListItems.push(<PostListItem key={postKey} post={postsByDate[sortRef[date]][postKey]}/>);
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
