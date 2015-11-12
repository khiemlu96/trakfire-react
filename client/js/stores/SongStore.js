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
var SongConstants = require('../constants/SongConstants');
//var SongUtils = require('../utils/SongUtils');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _songs = {};
var _currentSong = null;
var _prevSong = null;
var _nextSong = null;
var _isPlaying = false;
var _isPaused = false;
var _isActive = null;

function _addSong(song) {
  _currentSong = song;
}

function _addSongs(songs) {
  _songs = songs;
}

var SongStore = assign({}, EventEmitter.prototype, {

  getCurrentSong: function() {
    return _currentSong;
  }, 

  isPlaying: function() {
    return _isPlaying;
  }, 

  isPaused: function() {
    return _isPaused;
  }, 

  play: function() {
    if(!this.isActive){ 
      this.isActive = true;
    }
    this.isPlaying = true;
    this.isPaused = false;
  }, 

  pause: function() {
    this.isPlaying = false;
    this.isPaused = true;
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
    case SongConstants.GET_CURR_SONG:
      console.log('SET_CURR_SONG', action.response);
      if(action.response)
        _addSong(action.response);
      SongStore.emitChange();
      break;
    case SongConstants.SET_SONG_LIST:
      console.log('SET_SONG_LIST', action.response);
      if(action.response)
        _addSongs(action.response);
      SongStore.emitChange();
      break;
    case SongConstants.PLAY:
      console.log('PLAY');
      SongStore.play();
      SongStore.emitChange();
      break;  
    case SongConstants.PAUSE:
      console.log('PAUSE');
      SongStore.pause();
      SongStore.emitChange();
      break;
    case SongConstants.NEXT:
      console.log('NEXT');
      SongStore.emitChange();
      break;
    case SongConstants.PREV:
      console.log('PREV');
      SongStore.emitChange();
      break;             
    default:
      // no op
  }
});

module.exports = SongStore;
