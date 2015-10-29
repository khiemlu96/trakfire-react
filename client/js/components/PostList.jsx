/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var Moment = require('moment');
var PostActions = require('../actions/PostActions');
var PostListItem = require('./PostListItem.jsx');
var PostListDateHeader = require('./PostListDateHeader.jsx'); 
var PostStore = require('../stores/PostStore');
var UserStore = require('../stores/UserStore');
var _postListItems = [];
var _dayCount = 0; 
var _init = false;

function sortPostsByDate(posts) {
  var dates = {};
  var dateKeys = [];
  for (var key in posts) {
    var dstr = posts[key].date.toDateString();
    if( !dates[dstr] ) {
      dates[dstr] = {};
      dateKeys.push(dstr);
      dates[dstr][key] = posts[key];
      _dayCount+=1;
    } 
    else {
      dates[dstr][key] = posts[key];
    }
  }
  console.log(dates, dateKeys);
  return [dateKeys, dates];
}

function sortDate(a, b) {
  if(new Date(a) < new Date(b)) { return 1; }
  if(new Date(a) > new Date(b)) { return -1; }
  return 0;
}

function sortScore(a, b) {
  if(a.score < b.score) return -1;
  else if(a.score > b.score) return 1;
  else if(a.score == b.score) return 1;
  return 0;
}

function compareCreatedAt(a, b) {
  if(a.created_at < b.created_at) return -1;
  else if(a.created_at > b.created_at) return 1;
  else if(a.created_at == b.created_at) return 1;
  return 0;
}

function getLength(a) {
  var i = 0;
  for(key in a){
    i++;
  }
  return i;
}

function toArray(obj) {
  var array = [];
  for(key in obj) {
    array.push(obj[key]);
  }
  return array.sort(compareCreatedAt);
}

function getComponentState() {
  return {
    isLoggedIn : UserStore.isSignedIn(), 
    currentUser : UserStore.getCurrentUser(),
    currentTrack : null
  };
}

var PostsList = React.createClass({

  propTypes: {
    posts: ReactPropTypes.object.isRequired,
    sort: ReactPropTypes.string,
    genre: ReactPropTypes.string,
    onPostListItemClick: ReactPropTypes.func,
    loadSortedPlaylist: ReactPropTypes.func,
    onPostUpvote:ReactPropTypes.func,
    isLoggedIn: ReactPropTypes.bool,
    userId: ReactPropTypes.number, 
    currStreamUrl: ReactPropTypes.string,
    currUser: ReactPropTypes.object
  },

  getInitialState: function() {
    return getComponentState();
  }, 

  componentDidMount: function() {
    console.log("POST LIST PROPS", this.props);
    //console.log('Posts to be displayed ', posts);
    //console.log("PROPS PASSED ", this.props)
    console.log("STATE OF PLAY", this.state);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  componentWillMount: function() {
    var posts = this.props.posts;
    UserStore.addChangeListener(this._onChange);
    //console.log('Posts to be displayed ', posts);
  },
  upvote: function(postid) {
    this.props.onPostUpvote(postid);
  },

  playPauseItem: function(stream_url, track) {
    if(this.state.currentTrack != null) {
      var prevPli = this.state.currentTrack;
      var pli = this.refs[prevPli].getDOMNode();
      console.log(pli);
      pli.className = "tf-post-item";
    }
    this.state.currentTrack = track.id;
    this.props.onPostListItemClick(stream_url, track);
  },

  hasUpvoted: function(post, userid) {
      //console.log(post);
      var exists = post.voters.indexOf(userid);
      //console.log(post.id, exists);
      return (exists != -1) ? true : false;
  },

  renderPostsByDate: function(dates, posts) {
    console.log(posts, dates);
    //console.log("USER", UserStore.isSignedIn(), UserStore.getCurrentUser());
    var isLoggedIn = UserStore.isSignedIn();
    var user = UserStore.getCurrentUser();
    var container = [];
    var count = 0;
    for(date in dates) {

        var d;
        var today = new Date();
        var yesterday = new Date();
        yesterday.setDate(today.getDate()-1);

        //console.log("TODAY IS", today.toDateString(), "YESTERDAY IS", yesterday.toDateString());

        if(dates[date] == today.toDateString()) {
          d = "Today";
          count+=1;
        } else if(dates[date] == yesterday.toDateString()) {
          d = "Yesterday";
          count+=1;
        } else {
          d = dates[date].toString();
        }
        var dateHeader = <PostListDateHeader key={'d_'+date} date={d}/>
        container.push(dateHeader);
        var array = toArray(posts[dates[date]]).sort(sortScore);
        //console.log("THE ARRAY", array);
        for(key in array) {
          if(isLoggedIn){
            var isUpvotedByUser = this.hasUpvoted(array[key], user.id);
            //console.log("IS UPVOTED BY USER", isUpvotedByUser);
          }

          var post = <PostListItem 
                        key={"p_"+array[key].id} 
                        ref={array[key].id}
                        post={array[key]}
                        onUpvote={this.upvote}
                        onClick={this.playPauseItem} 
                        isLoggedIn={isLoggedIn}
                        userId={ user != null ? user.id : null }
                        isUpvoted={isUpvotedByUser}
                        rank={key}
                        currStreamUrl={this.props.currStreamUrl}/>
          container.push(post);           
        }
      }
    return container;
  },

  /**
   * @return {object}
   */
  render: function() {
    var posts = this.props.posts;
    var postsByDate = sortPostsByDate(posts); //sort posts into date keyed dict + array of date str for the headers
    var dates = postsByDate[0].sort(sortDate); //sort dates in decending order
  
    var posts = postsByDate[1] //date keyed dict

    _postListItems = [];
    _postListItems = this.renderPostsByDate(dates, posts); // return a list of <PostListDateHeader/> <PostListItems/>

    return (
      <div className="container tf-content-container" >
      <section id="main">
        <ul id="Post-list" className="tf-post-list" >{_postListItems}</ul>
      </section>
      </div>
    );
  },

  _onChange: function() {
    console.log("A CHANGE OCCURED");
    return getComponentState();
  }

});

module.exports = PostsList;
