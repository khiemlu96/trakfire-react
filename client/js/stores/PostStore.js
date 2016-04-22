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
var _error = {};
var _adminPosts = {}, _adminPostsState = {};

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
  console.log("CURRENT NEW POST", _current_new_post);
  //if(post.status == "approved")
  if(_posts["dummy"]) {
    delete _posts["dummy"];
  }
  
  _posts[rawPost.id] = post; //PostUtils.convertRawPost(rawPost);
  _songs = getSongList(_posts);
}

function _addLocalPost(rawPost){
  //console.log("ADDING POST", rawPost);
  var post = PostUtils.convertRawLocalPost(rawPost);
  _current_new_post = post;
  //if(post.status == "approved")
  _posts["dummy"] = post; //PostUtils.convertRawPost(rawPost);
  _songs = getSongList(_posts);
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

function _addVoteToPost(post_id, vote) {  
  if( _singlePost.id !== undefined && _singlePost.id !== null ) {
    _singlePost.votes.push(vote);
    _singlePost.voters.push(vote.user_id);
    _singlePost.vote_count += 1;
  } else {
    _posts[post_id].votes.push(vote);
    _posts[post_id].voters.push(vote.user_id);
    _posts[post_id].vote_count += 1;
  }
}

function _markPostAsCurrent(song_id) {
  console.log("marky mark");
  for(song in _songs) {
    if(_songs[song].id == song_id) {
      //_songs[song_id].current = true;
      console.log("SONGSONG", song);
      _songs[song].current = true;
    }
  }
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

function _addErrorMessage(error) {
  _error = error;
}

function _addLoadMorePosts(posts) {
  for(key in posts) {
    _addPost(posts[key]);
  }  
}

/*
 *  Add post into admin page
 */
function addAdminPosts(data) {
  var posts = data.posts; 
  _adminPosts = {};
  _adminPostsState = {};
  _adminPostsState = data.state;
  var i = 0;
  for(var key in posts) {
    _adminPosts[posts[key].id] = posts[key];
    i++;
  }
}

/*
 *  get the post states 
 */
function getAdminPostsState() {
    return _adminPostsState;
}

/*
 *  Delete a post from admin List page
 */
function deleteAdminPosts(post_id) {
  if(_adminPosts[post_id] !== null || _adminPosts[post_id] !== undefined) {
    delete _adminPosts[post_id];
    _adminPostsState.total_count--;
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
        /*var post_genres = _posts[id].genre.map(function(value){
            return value.toUpperCase();
        });*/
        if(_posts[id].genre && _posts[id].genre.indexOf(_genre[genre]) > -1) {
          postsOfGenres[id] = _posts[id];
        }
      }      
    }
    console.log("POSTS OF GENRES", postsOfGenres);
    return postsOfGenres;
  },

  getSongsLength: function(){
     var len = Object.keys(_songs).length;
     return len;
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
    console.log("NEXT", len, curr, currIdx, nextIdx, _songs);
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

  getError: function() {
    return _error;
  },

  getAdminPosts: function() {
    var state = getAdminPostsState();
    var posts = _adminPosts;
    var data = {
      posts: posts,
      state: state
    };

    return data;
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
      var post = JSON.parse( action.data );
      post = post.post;
      console.log('WRITE_POST', post);
      _addLocalPost(post);
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
      console.log('RECIEVE_NEW_VOTE', action.response);
      _addVoteToPost(action.post_id, action.response);
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
      break;
    case PostConstants.GET_SINGLE_POST:
      _sPost(action.response);
      PostStore.emitChange();
      break;
    case PostConstants.RECIEVE_NEW_COMMENT:
      _addPostComment(action.post_id, action.response);
      PostStore.emitChange();
      break;
    case PostConstants.ERROR_MESSAGE:
      _addErrorMessage(action.error);
      break;
    case PostConstants.GET_MORE_POSTS:
      _addLoadMorePosts(action.response);
      PostStore.emitChange();
      break;
    case PostConstants.GET_ADMIN_POSTS:
      addAdminPosts(action.response);
      PostStore.emitChange();
      break;
    case PostConstants.DELETE_ADMIN_POST:
      deleteAdminPosts(action.post_id);
      PostStore.emitChange();
      break;
    default:
      // no op
  }
});

module.exports = PostStore;
