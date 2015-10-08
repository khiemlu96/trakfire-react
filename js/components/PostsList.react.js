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
  for (var key in posts) {
    if( !dates[ posts[key].date ] ) {
      dates[ posts[key].date ] = {};
    } 
    else {
      dates[posts[key].date][key] = posts[key];
    }
  }
  return dates;
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
    var postsByDate = sortPostsByDate(allPosts);
    var postListItems = [];

    for (var date in postsByDate) {
      postListItems.push(<PostListDateHeader date={date}/>);
      for (var postKey in postsByDate[date]) {
        postListItems.push(<PostListItem key={postKey} post={postsByDate[date][postKey]}/>);
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
