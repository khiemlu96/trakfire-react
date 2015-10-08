/*
 * PostConstants
 */

var keyMirror = require('keymirror');

module.exports = {

  ActionTypes: keyMirror({
    POST_CREATE: null,
    POST_UPVOTE: null,
    RECIEVE_RAW_POSTS: null,
    SORT_POSTS: null,
    FILTER_POSTS_GENRE: null
  })

};