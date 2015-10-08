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

function _addPosts(rawPosts) {

  rawPosts.forEach(function(post){
    if (!_posts[post.id]) {
      _posts[post.id] = PostUtils.convertRawPost( post );
    }
  });

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

  switch(action.type) {
    //case "FILTER_POST_GENRE"
      //console.log('filtering', action.genre);
      //break;
    //case "SORT_POSTS"
      //console.log('sorting', action.method)
      //break;
    case "RECEIVE_RAW_POSTS":
      console.log('recieving', action.rawPosts);
      _addPosts(action.rawPosts);
      PostStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = PostStore;
