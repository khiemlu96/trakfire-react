/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var PostConstants = require('../constants/PostConstants');
var PostUtils = require('../utils/PostUtils');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _posts = {};
var _postsG = {};
var _genre = "ALL";
var _sort = "TOP";

function _addPosts(rawPosts) {
  console.log("ADDING POSTS", rawPosts);
  rawPosts.forEach(function(post){
    if (!_posts[post.id]) {
      _posts[post.id] = PostUtils.convertRawPost( post );
    }
  });

}

function _addPost(rawPost) {
  console.log("ADDING POST", rawPost);
  _posts[rawPost.id] = PostUtils.convertRawPost(rawPost);
}

function _addUser(user) {
  _user = user;
}

function _addPostsToUser(userPosts) {
  _uposts['upvoted'] = userPosts.upvoted;
  _uposts['posted'] = userPosts.posted;
}

function _addVoteToPost(post_id) {
  _posts[post_id].votes+=1;
}

/**
 * Update all of the TODO items with the same object.
 * @param  {object} updates An object literal containing only the data to be
 *     updated.
 */
function updateAll(updates) {
  for (var id in _posts) {
    update(id, updates);
  }
}

var PostStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of Posts.
   * @return {object}
   */
  getAll: function() {
    console.log('IN POST STORE GETTING '+_sort+' of type ', _genre);
    var posts;
    switch(_genre) {
      case "ALL":
        posts = _posts;
      break;
      case "ELECTRONIC":
        posts = this.getAllOfGenre("electronic");
      break;
      case "HIPHOP":
        posts = this.getAllOfGenre("Hip Hop / R&B");
      break;
      default:
    }
    return posts;
  },

  /**
   * Get a filtered slice of posts
   * ex: by genre
   * @return {object}
   */
  getAllOfGenre: function(genre){
    var postsOfGenre = {};
    for (var id in _posts ) { 
      if(_posts[id].genre == genre) {
        postsOfGenre[id] = _posts[id];
      }
    }

    return postsOfGenre;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case PostConstants.GET_POST_BATCH:
      console.log('GET_POST_BATCH', action.response);
      if(action.response)
        _addPosts(action.response);
      PostStore.emitChange();
      break;
    case PostConstants.RECIEVE_RAW_POSTS:
      console.log('RECIEVE_RAW_POSTS', action.rawPosts);
      _addPosts(action.rawPosts);
      PostStore.emitChange();
      break;
    case PostConstants.WRITE_POST:
      console.log('WRITE_POST');
      break;
    case PostConstants.UPVOTE_POST:
      console.log('UPVOTE POST');
      break;
    case PostConstants.RECIEVE_NEW_POST:
      console.log('RECIEVE_NEW_POST ', action.response);
      _addPost(action.response);
      PostStore.emitChange();
      break;
    case PostConstants.RECIEVE_NEW_VOTE:
      console.log('RECIEVE_NEW_VOTE', action.reponse);
      _addVoteToPost(action.post_id);
      PostStore.emitChange();
      break;
    case PostConstants.FILTER_POSTS:
      console.log("FILTER_POSTS");
      _genre = action.genre;
      PostStore.emitChange();
    default:
      // no op
  }
});

module.exports = PostStore;
