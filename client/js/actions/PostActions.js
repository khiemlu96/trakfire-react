
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

  upvote: function(origin, post_id) {
    console.log('UPVOTING ', origin, post_id);
    AppDispatcher.dispatch({
      actionType: PostConstants.UPVOTE_POST
    });
    console.log('UPVOTING');
    TfAPI.upvotePostFromUser(origin, post_id);
  },

  unvote: function(origin, post_id) {
    console.log('REMOVING VOTE', origin, post_id);
    AppDispatcher.dispatch({
      actionType: PostConstants.UNVOTE_POST
    });
    console.log('UNVOTING');
    TfAPI.unvotePostFromUser(origin, post_id);
  }, 

  sort: function(method) {
    AppDispatcher.dispatch({
      actionType: PostConstants.SORT_POSTS,
      method: method
    });
  },

  filterPosts: function(genre, sort) {
    console.log(genre, sort);
    AppDispatcher.dispatch({
      actionType: PostConstants.FILTER_POSTS,
      genre: genre,
      sort: sort
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

  getPostsForUser: function(origin) {
    console.log("GETTING POSTS FOR USER ", userid);
    AppDispatcher.dispatch({
      actionType: PostConstants.GET_USER_POSTS
    });

    TfAPI.getPostsForUser(origin);
  },

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
