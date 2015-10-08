
var AppDispatcher = require('../dispatcher/AppDispatcher');
var PostConstants = require('../constants/PostConstants');

var PostActions = {

  create: function(text) {
    AppDispatcher.dispatch({
      actionType: PostConstants.POST_CREATE,
      text: text
    });
  },

  upvote: function(id, user_id) {
    AppDispatcher.dispatch({
      actionType: PostConstants.POST_UPVOTE,
      id: id,
      user_id: userid
    });
  },

};

module.exports = PostActions;
