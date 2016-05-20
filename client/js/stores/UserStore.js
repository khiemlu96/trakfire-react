var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants');
var UserUtils = require('../utils/UserUtils');
var PostUtils = require('../utils/PostUtils');
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
var _userPostedTraks = [];
var _posted_trak_stats = null, _upvoted_trak_stats = null; 
var _userUpvotedTraks = [];
var _userRequestInvites = null, _userRequestInvitesState = {};
var _whitelistUsers= null, _whitelistUsersState = {};
var _arePendingNotifications = false;

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
  if(_user !== null && _user.id === follower.id) {
    _user.followers.push(_cUser);
  }
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
  
  rowIdx = 0;
  if(_user !== null && _user.id === follower.id) {
    var followers = _user.followers;
    for( key in followers ) {
      if( followers[key].id === _cUser.id ) {
        followers.splice(rowIdx, 1);
      }
      rowIdx++;
    }
  }
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

function addUserPostedTraks(response) {
  var posted_traks = response.posts;
  _posted_trak_stats = response.stats;
  for(var key in posted_traks) {
    _userPostedTraks.push( PostUtils.convertRawPost(posted_traks[key]) );
  }
}

function addUserUpvotedTraks(response) {
  var upvoted_traks = response.posts;
  _upvoted_trak_stats = response.stats;

  for(var key in upvoted_traks) {
    _userUpvotedTraks.push( PostUtils.convertRawPost(upvoted_traks[key]) );
  }
}

function addUserRequestInvites(data) {
  var user_requests = data.requests;
  _userRequestInvites = {};
  _userRequestInvitesState = {};
  _userRequestInvitesState = data.state;
  for(var key in user_requests) {
    _userRequestInvites[user_requests[key].id] = user_requests[key];
  }
}

function deleteUserRequestInvite(response) {
  var request_id = response.request_id;
  if( _userRequestInvites[request_id] !== null && _userRequestInvites[request_id] !== undefined ) {
    delete _userRequestInvites[request_id];
    _userRequestInvitesState.total_count--;
  }
}

function addUserToWhiteList(response) {
  var user = response[0];
  if( user !== null || user !== undefined ) {
    _whitelistUsers[user.id] = user;
    _whitelistUsersState.total_count++;
  }
}

function addAllUsersToWhiteList(response) {
  var users = response.whitelist_users;
  if( users !== null || users !== undefined ) {
    _whitelistUsers = {};
    _whitelistUsersState = {};
    _whitelistUsersState = response.state;
    for(var key in users) {
      _whitelistUsers[users[key].id] = users[key];
    }
  }
}

function delWhiteListUser(response) {
  var user_id = response.user_id;
  if( _whitelistUsers[user_id] !== null && _whitelistUsers[user_id] !== undefined ) {
    delete _whitelistUsers[user_id];
    _whitelistUsersState.total_count--;
  }
}

function setPendingStatus(status) {
  _arePendingNotifications = status;
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

  isBot: function() {
    return _user.isBot;
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

  getUserPostedTraks: function() {
      return _userPostedTraks;
  },

  getUserPostedTraksStats: function() {
    return _posted_trak_stats;
  },

  getUserUpvotedTraks: function() {
      return _userUpvotedTraks;
  },

  getUserUpvotedTraksStats: function() {
    return _upvoted_trak_stats;
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
  },

  getUserRequestInvites: function() {
    return _userRequestInvites;
  },

  getUserRequestInvitesStats: function() {
    return _userRequestInvitesState;
  },

  getAllWhiteListUsers: function() {
    return _whitelistUsers;
  },

  getAllWhiteListUsersState: function() {
    return _whitelistUsersState;
  },

  resetPostedTraks: function() {
    _userPostedTraks =  [];
  },

  resetUpvotedTraks: function() {
    _userUpvotedTraks = [];
  },

  getPending: function() {
    return _arePendingNotifications;
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
    case UserConstants.GET_USER_POSTED_TRAKS:
      addUserPostedTraks(action.response);
      UserStore.emitChange();
      break;
    case UserConstants.GET_USER_UPVOTED_TRAKS:
      addUserUpvotedTraks(action.response);
      UserStore.emitChange();
      break;
    case UserConstants.GET_USER_REQUEST_INVITES:
      addUserRequestInvites(action.response);
      UserStore.emitChange();
      break;
    case UserConstants.DEL_USER_REQUEST_INVITES:
      deleteUserRequestInvite(action.response);
      UserStore.emitChange();
      break;
    case UserConstants.ADD_USER_TO_WHITELIST:
      addUserToWhiteList(action.response);
      UserStore.emitChange();
      break;
    case UserConstants.GET_WHITELIST_USERS:
      addAllUsersToWhiteList(action.response);
      UserStore.emitChange();
      break;
    case UserConstants.DEL_WHITELIST_USERS:
      delWhiteListUser(action.response);
      UserStore.emitChange();
      break;
    case UserConstants.GET_PENDING:
      setPendingStatus(action.response);
      UserStore.emitChange();
    default:
      // no op
  }
});

module.exports = UserStore;