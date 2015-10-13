
var AppDispatcher = require('../dispatcher/AppDispatcher');
var PostConstants = require('../constants/PostConstants');
var TfAPI = require('../utils/TrakfireWebApiUtils');
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
      actionType: PostConstants.SORT_POSTS,
      method: method
    });
  },

  filterByGenre: function(genre) {
    console.log(genre);
    AppDispatcher.dispatch({
      actionType: PostConstants.FILTER_BY_GENRE,
      genre: genre
    });
  },

  getPostBatch: function(origin) {
    console.log("IN PA GETTING POST BATCH");
    AppDispatcher.dispatch({
      actionType: PostConstants.GET_POST_BATCH
    });

    TfAPI.getPostBatch(origin);
  },

  getCurrentUser: function(origin) {
    console.log("GETTING THE CURRENT USER", origin);
    AppDispatcher.dispatch({
      actionType: PostConstants.GET_CURRENT_USER
    });

    TfAPI.getCurrentUser(origin);
  },

  /*getPostsForUsers: function() {
    console.log("POSTING POST to "+origin+" WITH "+data);
    AppDispatcher.dispatch({
      actionType: PostConstants.WRITE_POST,
      data: data
    });

    TfAPI.writePost(origin, data);
  },*/

  writePost: function(origin, data) {
    console.log("POSTING POST to "+origin+" WITH "+data);
    AppDispatcher.dispatch({
      actionType: PostConstants.WRITE_POST,
      data: data
    });

    TfAPI.writePost(origin, data);
  }

};

module.exports = PostActions;
