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

var PostServerActionCreators = require('../actions/PostServerActionCreators');
var UserServerActionCreators = require('../actions/UserServerActions');
var Reqwest = require('reqwest');

module.exports = {
  //example dat loaded from localStorage
  getAllPosts: function() {
    // simulate retrieving data from a database
    var rawPost = JSON.parse(localStorage.getItem('posts'));
	// simulate success callback
    PostServerActionCreators.receiveAll(rawPost);
  },

  getPostBatch: function(url) {
    console.log("geting a recieveBatch");
  	Reqwest({
      url: url,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      headers: {'Authorization': sessionStorage.getItem('jwt')},
      success: function(resp) { 
      	console.log(resp);
      	rawPosts = resp;
      	PostServerActionCreators.recieveBatch(rawPosts); 
      },
      error: function(error) {
        console.error(url, error['response']);
        //location = '/';
      }
    });

  },

  getCurrentUser: function(url) {
    console.log(url);
    Reqwest({
      url: url,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      headers: {'Authorization': sessionStorage.getItem('jwt')},
      success: function(resp) { 
        console.log("SERVER RESPONSE", resp);
        user = resp;
        UserServerActionCreators.recieveCurrentUser(user); 
      },
      error: function(error) {
        console.error(url, error);
        //console.error(url, error['response']);
        //location = '/';
      }
    });    
  },

  writePost: function(url, data) {
    Reqwest({
      url: url,
      data: data,
      type: 'json',
      method: 'POST',
      contentType: 'application/json',
      headers: {'Authorization': sessionStorage.getItem('jwt')},
      success: function(resp) {
        console.log("SERVER RESPONSE", resp);
        newPost = resp;
        PostServerActionCreators.recieveCreatedPost(newPost); 
      },
      error: function(error) {
        console.error(url, error['response']);
        //location = '/';
      }
    });
  },

  getPostsForUser: function(url, userid) {
    console.log("POSTS FOR USER GETTING");
    Reqwest({
      url: url,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      headers: {'Authorization': sessionStorage.getItem('jwt')},
      success: function(resp) { 
        console.log("SERVER RESPONSE FOR USER", resp);
        userPosts = resp;
        PostServerActionCreators.recieveUserPosts(userPosts); 
      },
      error: function(error) {
        console.error(url, error);
        //console.error(url, error['response']);
        //location = '/';
      }
    });    
  }, 

  upvotePostFromUser: function(url, post_id) {
    console.log('UPVOTING POST '+post_id+' BY CURR USER');
    var data = { vote : {post_id : post_id} };
    console.log(data);
    Reqwest({
      url: url,
      data: JSON.stringify(data),
      type: 'json',
      method: 'POST',
      contentType: 'application/json',
      headers: {'Authorization': sessionStorage.getItem('jwt')},
      success: function(resp) {
        console.log("SERVER RESPONSE", resp);
        newVote = resp;
        PostServerActionCreators.recieveNewVote(newVote); 
      },
      error: function(error) {
        console.error(url, error['response']);
        //location = '/';
      }
    });  
  },

  unvotePostFromUser: function(url, post_id) {
    console.log('UNVOTING POST '+post_id+' BY CURR USER');
    var data = { vote : {post_id : post_id} };
    console.log(data);
    Reqwest({
      url: url,
      data: JSON.stringify(data),
      type: 'json',
      method: 'DELETE',
      contentType: 'application/json',
      headers: {'Authorization': sessionStorage.getItem('jwt')},
      success: function(resp) {
        console.log("SERVER RESPONSE", resp);
        //newVote = resp;
        //PostServerActionCreators.recieveNewVote(newVote); 
      },
      error: function(error) {
        console.error(url, error['response']);
        //location = '/';
      }
    });    
  }, 

  updateUserWithEmail: function(url, email) {
    var data = { user : {email : email} };
    console.log("USER EMAIL UPDATE", data);
    Reqwest({
      url: url,
      data: JSON.stringify(data),
      type: 'json',
      method: 'PUT',
      contentType: 'application/json',
      headers: {'Authorization': sessionStorage.getItem('jwt')},
      success: function(resp) {
        console.log("SERVER RESPONSE", resp);
        //newVote = resp;
        //UserServerActionCreators.recieveNewVote(newVote); 
      },
      error: function(error) {
        console.error(url, error['response']);
        //location = '/';
      }
    });    
  }, 

  getUser: function(url, userid) {
    var data = { user : { id : userid } }
    console.log(data);

    Reqwest({
      url: url,
      data: JSON.stringify(data),
      type: 'json',
      method: 'GET',
      contentType: 'application/json',
      headers: {'Authorization': sessionStorage.getItem('jwt')},
      success: function(resp) {
        console.log("SERVER RESPONSE", resp);
        newUser = resp;
        UserServerActionCreators.recieveNewUser(newUser); 
      },
      error: function(error) {
        console.error(url, error['response']);
        //location = '/';
      }
    });  
  }

};

