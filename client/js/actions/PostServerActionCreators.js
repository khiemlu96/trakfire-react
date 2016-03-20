/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var PostConstants = require('../constants/PostConstants');


module.exports = {

  receiveAll: function(rawPosts) {
    AppDispatcher.dispatch({
      type: PostConstants.RECEIVE_RAW_POSTS,
      rawPosts: rawPosts
    });
  },

  recieveBatch: function(response) {
    console.log('HAS RECIEVED THE BATCH DISPATCHING');
    AppDispatcher.dispatch({
      actionType: PostConstants.GET_POST_BATCH,
      response: response
    });	
  },

  recieveCurrentUser: function(response) {
    console.log("RECIEVE CURR USER", response);
    AppDispatcher.dispatch({
      actionType: PostConstants.GET_CURRENT_USER,
      response: response
    });
  },

  recieveCreatedPost: function(response) {
    console.log('RECIEVING THE CREATED POST', response);
    AppDispatcher.dispatch({
      actionType: PostConstants.RECIEVE_NEW_POST,
      response: response
    });
    $(document).trigger("ReactComponent:PostFormLast:showTrackData"); 
  }, 

  recieveUserPosts: function(response) {
    console.log("RECIEVING THE USERS POSTS", response);
    AppDispatcher.dispatch({
      actionType: PostConstants.RECIEVE_USER_POSTS,
      response: response
    });     
  }, 

  recieveNewVote: function(response) {
    console.log("RECIEVING A NEW VOTE", response);
    AppDispatcher.dispatch({
      actionType: PostConstants.RECIEVE_NEW_VOTE,
      response: response,
      post_id: response.post_id
    });    
  },
  
  recieveSinglePost: function(response) {
    AppDispatcher.dispatch({
      actionType: PostConstants.GET_SINGLE_POST,
      response: response,
      post_id: response.post_id
    });    
  },

  recieveNewPostComment: function(response) {
    AppDispatcher.dispatch({
      actionType: PostConstants.RECIEVE_NEW_COMMENT,
      response: response,
      post_id: response.post_id
    });    
  },

  showError: function(url, errorObj) {
    AppDispatcher.dispatch({
      actionType: PostConstants.ERROR_MESSAGE,
      error: errorObj,
    });    
    $(document).trigger("ReactComponent:PostFormLast:showError");
  },

  getMorePostsByDate: function(response) {
      AppDispatcher.dispatch({
          actionType: PostConstants.GET_MORE_POSTS,
          response: response,
      });
  },

  getAdminPosts: function(response) {
    AppDispatcher.dispatch({
        actionType: PostConstants.GET_ADMIN_POSTS,
        response: response,
    });
  },

  deleteAdminPost: function(response) {
    if(response.code === 0) {
      AppDispatcher.dispatch({
          actionType: PostConstants.DELETE_ADMIN_POST,
          post_id: response.post_id
      });
    }    
  }
};