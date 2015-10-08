
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

  sort: function(method) {
    AppDispatcher.dispatch({
      actionType: PostConstants.ActionTypes.SORT_POSTS,
      method: method
    });
  },

  filterByGenre: function(genre) {
    console.log(genre);
    AppDispatcher.dispatch({
      actionType: "FILTER_POST_GENRE",
      genre: genre
    })
  }

};

module.exports = PostActions;
