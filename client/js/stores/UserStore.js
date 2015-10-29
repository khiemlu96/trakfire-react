var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants');
var UserUtils = require('../utils/UserUtils');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _user = null;
var _posts = null;


function _addUser(user) {
  _user = UserUtils.convertRawUser(user);
  mixpanel.people.set({
  '$handle' : _user.handle,
  '$name': _user.name,
  '$created': new Date()
  });
}

function _addPostsToUser(userPosts) {
  _posts['upvoted'] = userPosts.upvoted;
  _posts['posted'] = userPosts.posted;
}


var UserStore = assign({}, EventEmitter.prototype, {

  getCurrentUser: function() {
    console.log('CURRENT USER: ', _user);
    return _user;
  },

  isSignedIn: function() {
    console.log('USER IS SIGNED IN?', _user ? true : false);
    return _user ? true : false;
  },

  isAdmin: function() {
    if(this.isSignedIn()) { var isAdmin = !!_user.isAdmin ? _user.isAdmin : false }
    console.log('USER ISADMIN? ', isAdmin);
    return isAdmin;
  },

  getCurrentUserPosts: function() {
    console.log('GETTING THE USERS POSTS');
    return _uposts;
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
    case UserConstants.GET_CURRENT_USER:
      console.log('getting the curr user', action.response);
      //_addUser(action.response);
      //UserStore.emitChange();
      break;
    case UserConstants.RECIEVE_CURR_USER:
      console.log('recieving the current user for session', action.response);
      _addUser(action.response);
      UserStore.emitChange();      
      break;
    case UserConstants.GET_USER_POSTS:
      console.log('Getting a users posts');
      break;
    case UserConstants.RECIEVE_USER_POSTS:
      console.log('recieving user posts ', action.response);
      _addPostsToUser(action.response);
      UserStore.emitChange();
      break;
    default:
      // no op
  }
});

module.exports = UserStore;