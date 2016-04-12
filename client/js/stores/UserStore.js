var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants');
var UserUtils = require('../utils/UserUtils');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _cUser = null;
var _user = null;
var _users = {};
var _posts = null;
var _notifications = null;
var _users = {};
var _userState = {};
var _adminStates = null;
var _adminCarousalFiles = null;
var _adminCarousalFilesState = null;

function _addCurrentUser(user) {
  _cUser = UserUtils.convertRawUser(user);
  
  mixpanel.identify(_cUser.id);
  mixpanel.people.set_once({
  '$handle' : _cUser.handle,
  '$name': _cUser.name,
  '$created': new Date(),
  '$id': _cUser.id  
  });
}

function _addUser(user) {
  _user = UserUtils.convertRawUser(user);
}

function _addUsers(data) {
  if(data !== undefined){
    var users = data.users;
    _users = {};
    _userState = {};
    _userState = data.state;
    
    if(users !== undefined){
      users.forEach(function(user){
        if(!_users[user.id]){
          _users[user.id] = UserUtils.convertRawUser(user);
        }
      });
    }
  }
}

function _addPostsToUser(userPosts) {
  _posts['upvoted'] = userPosts.upvoted;
  _posts['posted'] = userPosts.posted;
}

function _addUserNotifications(notifications) {
  _notifications = notifications;
  _cUser.notifications = _notifications;
}

function _addMoreUserNotifications(notifications) {
  _notifications = notifications;
  for(key in notifications) {
    _cUser.notifications.push(notifications[key]);
  }
}

function _addFollower(follower) {
  _cUser.followings.push(follower);
}

function _removeFollower(follower) {
  var rowIdx = 0;
  var followings = _cUser.followings;
  for(key in followings) {
    if(followings[key].id === follower.id) {
      followings.splice(rowIdx, 1);
    }
    rowIdx++;
  }
  _cUser.followings = followings;
} 

function _deleteUser(user_id) {
  if(_users[user_id] !== null && _users[user_id] !== undefined) {
    delete _users[user_id];
  }
}

function _addAdminState(response) {
    _adminStates = response;
}

function _verifiedUserState(user){
  if(_users[user.id] !== null && _users[user.id] !== undefined) {
    _users[user.id].isVerified = user.isVerified;
  }
}

/*
 *  Add post into admin page
 */
function addAdminCarousalFiles(data) {
  var files = data.files; 
  _adminCarousalFiles = {};
  _adminCarousalFilesState = {};
  _adminCarousalFilesState = data.state;
  for(var key in files) {
    _adminCarousalFiles[files[key].id] = files[key];
  }
}

function addIntoAdminCarousalFile(file) {
  if( file !== null ){
    _adminCarousalFiles[file.id] = file;
    _adminCarousalFilesState.total_count++;
  }
}

function deleteFromAdminCarousalFile(file_id) {
  if( _adminCarousalFiles[file_id] !== null && _adminCarousalFiles[file_id] !== undefined ) {
    delete _adminCarousalFiles[file_id];
    _adminCarousalFilesState.total_count--;
  }
}

var UserStore = assign({}, EventEmitter.prototype, {

  getCurrentUser: function() {
    //console.log('CURRENT USER: ', _cUser);
    return _cUser;
  },

  getUser: function() {
    //console.log('USER ', _user);
    return _user;
  },

  getAllUsers: function(){
    return _users;
  }, 

  isSignedIn: function() {
    console.log('USER IS SIGNED IN?', _cUser ? true : false);
    return _cUser ? true : false;
  },

  isAdmin: function() {
    if(this.isSignedIn()) { var isAdmin = !!_cUser.isAdmin ? _cUser.isAdmin : false }
    //console.log('USER ISADMIN? ', isAdmin);
    return isAdmin;
  },

  getCurrentUserPosts: function() {
    //console.log('GETTING THE USERS POSTS');
    return _uposts;
  }, 

  getUserNotifications: function() {
      return _cUser.notifications;
  },

  getAdminState: function() {
      return _adminStates;
  },

  getAdminCarousalFiles: function() {
    return _adminCarousalFiles;
  },

  /*
   *  get the post states 
   */
  getAdminCarousalFilesState: function() {
      return _adminCarousalFilesState;
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
  },

  getUsersState: function() {
    return _userState;
  }

});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case UserConstants.GET_CURRENT_USER:
      //console.log('getting the curr user', action.response);
      //_addUser(action.response);
      //UserStore.emitChange();
      break;
    case UserConstants.RECIEVE_CURR_USER:
      //console.log('recieving the current user for session', action.response);
      _addCurrentUser(action.response);
      UserStore.emitChange();      
      break;
    case UserConstants.RECIEVE_USER:
      //console.log('recieving the current user for session', action.response);
      _addUser(action.response);
      UserStore.emitChange();      
      break;
    case UserConstants.GET_ALL_USERS:
       //console.log('recieving the all user for session', action.response);
      _addUsers(action.response);
      UserStore.emitChange();
      break;
    case UserConstants.GET_USER_POSTS:
      //console.log('Getting a users posts');
      break;
    case UserConstants.RECIEVE_USER_POSTS:
      //console.log('recieving user posts ', action.response);
      _addPostsToUser(action.response);
      UserStore.emitChange();
      break;
    case UserConstants.RECIEVE_USER_NOTIFICATIONS:
      if(action.loadMore === true){
        _addMoreUserNotifications(action.response);
      } else {
        _addUserNotifications(action.response);
      }      
      UserStore.emitChange();
      break;
    case UserConstants.ADD_FOLLOWER:
      _addFollower(action.response);   
      UserStore.emitChange();
      break;
    case UserConstants.REMOVE_FOLLOWER:
      _removeFollower(action.response);    
      UserStore.emitChange();
      break;
    case UserConstants.DELETE_USER:
      _deleteUser(action.user_id);
      UserStore.emitChange();
      break;
    case UserConstants.GET_ADMIN_STATE:
      _addAdminState(action.response);
      UserStore.emitChange();
      break;
    case UserConstants.VERIFY_USER:
      _verifiedUserState(action.response);
      UserStore.emitChange();
      break;
    case UserConstants.GET_ADMIN_CAROUSAL_FILES:
      addAdminCarousalFiles(action.response);
      UserStore.emitChange();
      break;
    case UserConstants.ADD_ADMIN_CAROUSAL_FILE:
      addIntoAdminCarousalFile(action.response);
      UserStore.emitChange();
      break;
    case UserConstants.DELETE_ADMIN_CAROUSAL_FILE:
      deleteFromAdminCarousalFile(action.response);
      UserStore.emitChange();
      break;
    default:
      // no op
  }
});

module.exports = UserStore;