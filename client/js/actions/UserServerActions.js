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
var UserConstants = require('../constants/UserConstants');


module.exports = {

  recieveCurrentUser: function(response) {
    console.log("RECIEVE CURR USER", response, UserConstants.RECIEVE_CURR_USER);
    AppDispatcher.dispatch({
      actionType: UserConstants.RECIEVE_CURR_USER,
      response: response
    });
  },

  recieveUserPosts: function(response) {
    console.log("RECIEVING THE USERS POSTS", response);
    AppDispatcher.dispatch({
      actionType: UserConstants.RECIEVE_USER_POSTS,
      response: response
    });     
  }, 

  recieveNewUser: function(response) {
    console.log("RECIEVING USER", response);
    AppDispatcher.dispatch({
      actionType: UserConstants.RECIEVE_USER,
      response: response
    });      
  }, 

  recieveAll: function(response){
    console.log("RECIEVING ALL USER", response);
    AppDispatcher.dispatch({
      actionType: UserConstants.GET_ALL_USERS,
      response: response
    });
  },
  
  recieveUserNotifications: function(response) {
    AppDispatcher.dispatch({
      actionType: UserConstants.RECIEVE_USER_NOTIFICATIONS,
      response: response,
      loadMore: false
    });
  },

  recieveMoreUserNotifications: function(response) {
    AppDispatcher.dispatch({
      actionType: UserConstants.RECIEVE_USER_NOTIFICATIONS,
      response: response,
      loadMore: true
    });
  },

  addFollowers: function(response) {
    AppDispatcher.dispatch({
      actionType: UserConstants.ADD_FOLLOWER,
      response: response,
    });
  },
  
  removeFollowers: function(response) {
    AppDispatcher.dispatch({
      actionType: UserConstants.REMOVE_FOLLOWER,
      response: response,
    });
  },

  deleteUser: function(response) {
    AppDispatcher.dispatch({
      actionType: UserConstants.DELETE_USER,
      user_id : response.user_id,
    });
  },

  recieveAdminState: function(response) {
    AppDispatcher.dispatch({
      actionType: UserConstants.GET_ADMIN_STATE,
      response: response,
    });
  },

  verifyUser: function(response) {
    AppDispatcher.dispatch({
      actionType: UserConstants.VERIFY_USER,
      response : response,
    });
  },

  getAdminCarousalFiles: function(response) {
    AppDispatcher.dispatch({
      actionType: UserConstants.GET_ADMIN_CAROUSAL_FILES,
      response : response,
    });
  },

  addAdminCarousalFile: function(response) {    
    AppDispatcher.dispatch({
      actionType: UserConstants.ADD_ADMIN_CAROUSAL_FILE,
      response : response,
    });
  },

  deleteCarousalFile: function(response) {    
    AppDispatcher.dispatch({
      actionType: UserConstants.DELETE_ADMIN_CAROUSAL_FILE,
      response : response,
    });
  },

  getUserPostedTraks: function(response) {
    AppDispatcher.dispatch({
      actionType: UserConstants.GET_USER_POSTED_TRAKS,
      response : response,
    });
  },

  getUserUpvotedTraks: function(response) {
    AppDispatcher.dispatch({
        actionType: UserConstants.GET_USER_UPVOTED_TRAKS,
        response : response,
    });
  },

  getUserRequestInvites: function(response) {
    AppDispatcher.dispatch({
      actionType: UserConstants.GET_USER_REQUEST_INVITES,
      response : response,
    });
  },

  deleteRequest: function(response) {
    AppDispatcher.dispatch({
      actionType: UserConstants.DEL_USER_REQUEST_INVITES,
      response : response,
    });
  },

  addUserToWhiteList: function(response) {
    AppDispatcher.dispatch({
      actionType: UserConstants.ADD_USER_TO_WHITELIST,
      response : response,
    });
  },

  getAllWhiteListUsers: function(response) {
    AppDispatcher.dispatch({
      actionType: UserConstants.GET_WHITELIST_USERS,
      response : response,
    });
  },

  deleteWhiteListUser: function(response) {
    AppDispatcher.dispatch({
      actionType: UserConstants.DEL_WHITELIST_USERS,
      response : response,
    });
  }, 

  getPending: function(response) {
    AppDispatcher.dispatch({
      actionType: UserConstants.GET_PENDING,
      response : response,
    });    
  }, 

  getBotUsers: function(response) {
    AppDispatcher.dispatch({
      actionType: UserConstants.GET_BOT_USERS,
      response: response
    });
  }, 

  recieveTopUsers: function(response) {
    AppDispatcher.dispatch({
      actionType: UserConstants.RECIEVE_TOP_USERS,
      response: response
    });   
  }
};