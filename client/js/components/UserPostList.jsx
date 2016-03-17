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
var PostListItem = require('./PostListItem.jsx');
var Link = require('react-router').Link;

function toArray(obj) {
  var arr = [];
  for (key in obj) {
    obj[key].key = key;
    arr.push(obj[key]);
  }
  return arr;
}

var UserPostList = React.createClass({

  propTypes: {
    upvotedTracks: ReactPropTypes.array,
    postedTracks: ReactPropTypes.array,
    onPostItemClick: ReactPropTypes.func
  },

  /**
   * @return {object}
   */
  render: function() {
    console.log("CREATING USER PROFILE TABS");
    var upvoted = this.props.upvotedTracks;
    var posted = this.props.postedTracks;
    var upvotedPosts = [];
    var postedPosts = [];
    var i = 0;
    for(key in upvoted) {
      var post = upvoted[key];
      var item = <PostListItem onClick={this.props.onPostItemClick} key={post.key} trackIdx={i} post={post} currStreamUrl={this.props.currStreamUrl} showAuthor={true} showNumber={false}/>
      upvotedPosts.push(item);
      i+=1;
    }
    i = 0;
    for(key in posted) {
      var post = posted[key];
      var item = <PostListItem onClick={this.props.onPostItemClick} key={post.key} trackIdx={i} post={post} currStreamUrl={this.props.currStreamUrl} showAuthor={false} showNumber={false}/>
      postedPosts.push(item);
      i+=1;
    } 
    return (
      <div className="tab-content">
        <div role="tabpanel" className="tab-pane" id="posted">
          <div className= "container p-t-md tf-background">
            <div className="row">
              <div className="col-md-8 col-md-offset-2">
                <ul className="media-list"> {postedPosts} </ul>
              </div>
            </div>
          </div>
        </div>
        <div role="tabpanel" className="tab-pane active" id="upvoted">
          <div className= "container p-t-md tf-background">
            <div className="row">
              <div className="col-md-8 col-md-offset-2">
                <ul className="media-list"> {upvotedPosts} </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = UserPostList;
