
var AppDispatcher = require('../dispatcher/AppDispatcher');
var UserConstants = require('../constants/UserConstants');
var TfAPI = require('../utils/TrakfireWebApiUtils');
var UserActions = {

  getCurrentUser: function(origin) {
    console.log("GETTING THE CURRENT USER", origin);
    AppDispatcher.dispatch({
      actionType: UserConstants.GET_CURRENT_USER
    });

    TfAPI.getCurrentUser(origin);
  },

  getPostsForUser: function(origin) {
    console.log("GETTING POSTS FOR USER ", userid);
    AppDispatcher.dispatch({
      actionType: UserConstants.GET_USER_POSTS
    });

    TfAPI.getPostsForUser(origin);
  }, 

  updateEmail: function(origin,email) {
    console.log("SETTING EMAIL FOR USER ", email);
    AppDispatcher.dispatch({
      actionType: UserConstants.UPDATE_EMAIL
    });

    TfAPI.updateUserWithEmail(origin, email);    
  }, 

  getUser: function(origin, userid) {
    console.log("GETTING USER ", userid);
    AppDispatcher.dispatch({
      actionType: UserConstants.GET_USER
    });

    TfAPI.getUser(origin, userid);    
  }

};

module.exports = UserActions;
