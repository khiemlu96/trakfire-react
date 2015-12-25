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
var PostStore = require('../stores/PostStore.js');
var UserStore = require('../stores/UserStore.js');
var SongStore = require('../stores/SongStore.js');
var PostList = require('./PostList.jsx');
var FilterBar = require('./FilterBar.jsx');
var PostActions = require('../actions/PostActions');
var SongActions = require('../actions/SongActions');

function getAppState() {
  return {
    posts: PostStore.getAll(),
    currUser: UserStore.getCurrentUser()
  };
}

var PostsPage = React.createClass({

  propTypes : {
    sort : ReactPropTypes.string,
    genre : ReactPropTypes.string,
    posts : ReactPropTypes.object,
    togglePlay : ReactPropTypes.func,
    upvote: ReactPropTypes.func,
    filterPosts : ReactPropTypes.func,
    currUser: ReactPropTypes.object, 
    showModal: ReactPropTypes.func,
    setSongList: ReactPropTypes.func
  }, 

  getInitialState: function() {
    console.log('GETTING APP STATE');
    var as = getAppState();
    console.log(as);
    return as;
  },

  getDefaultProps: function() {
    return {origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''};
  },

  componentWillMount: function() {
    this.readPostsFromApi();
  },

  componentDidMount: function() {
    PostStore.addChangeListener(this._onChange);
    UserStore.addChangeListener(this._onChange);
    SongStore.addChangeListener(this._onChange);
    console.log("STATE", this.state);
    console.log("PROPS", this.props);
    console.log("POSTPAGE POSTS", this.state.posts);
    //console.log("POSTPAGE MOUNT ", this.state.posts);
  },

  componentWillUnmount: function() {
    PostStore.removeChangeListener(this._onChange);
    UserStore.removeChangeListener(this._onChange);
    SongStore.removeChangeListener(this._onChange);
  }, 

  upvote: function(postid) {
    PostActions.upvote(this.props.origin+'/votes', postid);
  },

  togglePlay: function(stream_url, track, idx) {
    this.props.togglePlay(stream_url, track, idx);
  },

  filterPosts: function(genre, sort) {
    this.props.filterPosts(genre, sort);
  },

  readPostsFromApi: function(){
    console.log('FETCHING POST BATCH', this.props.origin);
    PostActions.getPostBatch(this.props.origin+'/posts');
  },
  
  /**
   * @return {object}
   */
  render: function() {
    return (
      <div>
        <FilterBar
          onClick={this.filterPosts}
          genre={this.props.genre}
          sort={this.props.sort}
          scrollToTop={this.props.scrollToTop} />
          
        <PostList
          posts={this.state.posts}
          sort={this.props.sort}
          genre={this.props.genre}
          onPostListItemClick={this.togglePlay}
          onPostUpvote={this.upvote}
          currUser={this.props.currUser}
          showModal={this.props.showModal}
          setSongList={this.props.setSongList}/>
      </div>
    );
  },
  /**
   * Event handler for 'change' events coming from the PostStore
   */
  _onChange: function() {
    //console.log('CHANGE IN THE POST STORE');
    this.setState(getAppState());
  }

});

module.exports = PostsPage;
