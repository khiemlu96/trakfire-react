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
var _user = null;

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
/**
 * Create a TODO item.
 * @param  {string} text The content of the TODO
 */
function create(text) {}

/**
 * Update a TODO item.
 * @param  {string} id
 * @param {object} updates An object literal containing only the data to be
 *     updated.
 */
function upvote(id, user_id) {}

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
    console.log('GETTING ALL');
    return _posts;
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

  getCurrentUser: function() {
    return _user;
  },

  isSignedIn: function() {
    console.log('USER IS SIGNED IN?', _user ? true : false);
    return _user ? true : false;
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
      console.log(action.response);
      console.log('recieving post batch from api', action.response);
      if(action.response)
        _addPosts(action.response);
      PostStore.emitChange();
      break;
    case PostConstants.GET_CURRENT_USER:
      console.log('recieving the current user for session', action.response);
      _addUser(action.response);
      PostStore.emitChange();
      break;
    case PostConstants.RECIEVE_RAW_POSTS:
      console.log('recieving', action.rawPosts);
      _addPosts(action.rawPosts);
      PostStore.emitChange();
      break;
    case PostConstants.WRITE_POST:
      console.log('WROTE A POST');
      break;
    case PostConstants.RECIEVE_NEW_POST:
      console.log('wrote a post ', action.response);
      _addPost(action.response);
      PostStore.emitChange();
      break;
    default:
      // no op
  }
});

module.exports = PostStore;
