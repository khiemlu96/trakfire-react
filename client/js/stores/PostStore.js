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
var SongActions = require('../actions/SongActions');

var CHANGE_EVENT = 'change';

var _posts = {};
var _postsG = {};
var _songs = {};
var _singlePost = {};
var _genre = ["ELECTRONIC", "VOCALS", "HIPHOP"]; //"ALL";
var _sort = "TOP";
var _dayCount = 0; 
var _current_new_post = {};

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
  //console.log(dates, dateKeys);
  return [dateKeys, dates];
}

function sortDate(a, b) {
  if(new Date(a) < new Date(b)) { return 1; }
  if(new Date(a) > new Date(b)) { return -1; }
  return 0;
}

function sortScore(a, b) {
  if(a.score > b.score) return -1;
  else if(a.score < b.score) return 1;
  else if(a.score == b.score){
    return sortDate(a, b);
  }
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

function toArray(obj) {
  var array = [];
  for(key in obj) {
    array.push(obj[key]);
  }
  return array.sort(compareCreatedAt);
}

function getSongList(posts) {
    var postsByDate = sortPostsByDate(posts); //sort posts into date keyed dict + array of date str for the headers
    //console.log("PBD", postsByDate, posts);
    var dates = postsByDate[0].sort(sortDate); //sort dates in decending order
    var posts = postsByDate[1] //date keyed dict
    var songList = {};
    var songCount = 0;
    for(date in dates) {
      var array = toArray(posts[dates[date]]).sort(sortScore);
      //console.log("ARRAY BOI", array);
      for(key in array) {
        var s = array[key];
        s.sortedIdx = songCount;
        songList[songCount] = s;
        songCount += 1;          
      }
    }
    return songList;
}

function _addPosts(rawPosts) {
  //console.log("ADDING POSTS", rawPosts);
  rawPosts.forEach(function(post){
    if (!_posts[post.id]) {      
      console.log("RAW POST", post);
      _posts[post.id] = PostUtils.convertRawPost( post );
    }
  });

  //sort the posts into the song object
  _songs = getSongList(_posts);
}

function _addPost(rawPost) {
  //console.log("ADDING POST", rawPost);
  var post = PostUtils.convertRawPost(rawPost);
  _current_new_post = post;
  //if(post.status == "approved")
  _posts[rawPost.id] = post; //PostUtils.convertRawPost(rawPost);
}

function _sPost(rawPost) {
  if (rawPost !== undefined) {
    _singlePost = PostUtils.convertRawPost(rawPost);
  };
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

function _markPostAsCurrent(song_id) {
  _songs[song_id].current = true;
  console.log(_songs[song_id].current);
}

function _addPostComment(post_id, comment) {
  if(comment !== undefined) {    
    if(comment.parent_id === null) {
      comment.replies = [];
      _singlePost.comments.push(comment);
    } else {
      var parent_comment_id = comment.parent_id;
      for(key in _singlePost.comments) {
        if(_singlePost.comments[key].id === parent_comment_id) {
          _singlePost.comments[key].replies.push(comment);
        }
      }
    }
  }
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
    //console.log('IN POST STORE GETTING '+_sort+' of type ', _genre);
    var posts;
    /*switch(_genre) {
      case "ALL":
        posts = _posts;
      break;
      case "ELECTRONIC":
        posts = this.getAllOfGenre("electronic");
      break;
      case "HIPHOP":
        posts = this.getAllOfGenre("HipHop");
      break;
      case "VOCALS":
        posts = this.getAllOfGenre("Vocals");
      break;
      default:
    }*/
    console.log("GENRES", _genre);
    posts = this.getAllOfGenres(_genre);
    return posts;
  },

  getSinglePost:function(){
    return _singlePost;
  },
  /**
   * Get a filtered slice of posts
   * ex: by genre
   * @return {object}
   */
  getAllOfGenre: function(genre){
    var postsOfGenre = {};
    for (var id in _posts ) { 
      if(_posts[id].genre && _posts[id].genre.indexOf(genre) > -1) {
        postsOfGenre[id] = _posts[id];
      }
    }

    return postsOfGenre;
  },

  getAllOfGenres: function(genres) {
    var postsOfGenres = {};
    for(genre in genres) {
      console.log("GENRE", _genre[genre])
      for (var id in _posts ) { 
        if(_posts[id].genre && _posts[id].genre.indexOf(_genre[genre]) > -1) {
          postsOfGenres[id] = _posts[id];
        }
      }      
    }
    console.log("POSTS OF GENRES", postsOfGenres);
    return postsOfGenres;
  }, 

  getSortedPosts: function() {
    return _songs;
  }, 

  getCurrentSong: function() {
    var len = Object.keys(_songs).length;
    for(var i = 0; i < len; i++) {
      var song = _songs[i];
      if(song.current) {
        return song;
      }
    }
    return false;
  }, 

  getNextSong: function() {
    var len = Object.keys(_songs).length;
    var curr = this.getCurrentSong();
    var currIdx = curr.sortedIdx;
    var nextIdx = currIdx + 1;
    if(nextIdx >= len)
      nextIdx = currIdx;
    var next = _songs[nextIdx];
    next.current = true;
    curr.current = false;

    return next;
  }, 

  getPrevSong: function() {
    var curr = this.getCurrentSong();
    var currIdx = curr.sortedIdx;
    var prevIdx = currIdx - 1;
    if(prevIdx < 0)
      prevIdx = currIdx;
    var prev = _songs[prevIdx];
    prev.current = true;
    curr.current = false;

    return prev;
  }, 

  getPostById: function(id) {
    return _posts[id];
  },

  getNewPost: function(){
    return _current_new_post;
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
PostStore.dispatchToken = AppDispatcher.register(function(action) {
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
      break;
    case PostConstants.SET_CURR_POST:
      console.log("SET CURR POST", action.song_id);
      _markPostAsCurrent(action.song_id);
      PostStore.emitChange();
    case PostConstants.GET_SINGLE_POST:
      _sPost(action.response);
      PostStore.emitChange();
    case PostConstants.RECIEVE_NEW_COMMENT:
      _addPostComment(action.post_id, action.response);
      PostStore.emitChange();
    default:
      // no op
  }
});

module.exports = PostStore;
