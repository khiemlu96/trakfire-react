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
var SongActions = require('../actions/SongActions');
var moment = require('moment');
var _postListItems = [];
var _dayCount = 0; 
var _init = false;
var _songList = {};
var _songsSet = false;
var postCountByDates = [];

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
  //console.log(dates, dateKeys);
  return [dateKeys, dates];
}

function sortDate(a, b) {
  if(new Date(a) < new Date(b)) { return 1; }
  if(new Date(a) > new Date(b)) { return -1; }
  return 0;
}

function sortScore(a, b) {
  if(a.score > b.score) return -1;
  else if(a.score < b.score) return 1;
  else if(a.score == b.score){
    return sortDate(a, b);
  }
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
    posts : PostStore.getAll(), 
    sortedPosts : PostStore.getSortedPosts(), 
    getCurrentSong : PostStore.getCurrentSong()
  };
}

function getSongList(posts) {
    var postsByDate = sortPostsByDate(posts); //sort posts into date keyed dict + array of date str for the headers
    //console.log("PBD", postsByDate, posts);
    var dates = postsByDate[0].sort(sortDate); //sort dates in decending order
    var posts = postsByDate[1] //date keyed dict
    var songList = {};
    var songCount = 0;
    for(date in dates) {
      var array = toArray(posts[dates[date]]).sort(sortScore);
      //console.log("ARRAY BOI", array);
      for(key in array) {
        songList[songCount] = array[key];
        songCount += 1;          
      }
    }
    return songList;
}

function getPostCountByDates(posts) {
    var count_arr = [];
    for(key in posts) {
        count_arr[key] = getLength(posts[key]);
    }
    return count_arr;
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
    currUser: ReactPropTypes.object, 
    showModal: ReactPropTypes.func,
    setSongList: ReactPropTypes.func,
    origin: ReactPropTypes.string
  },

  getInitialState: function() {
    var storedState = getComponentState();
    storedState.currentTrack = null;
    storedState["hasSetSongList"] = false;
    return storedState;
  }, 

  componentDidMount: function() {
    //var posts = getSongList(p);
    //this.props.setSongList(this.state.posts);
    PostStore.addChangeListener(this._onChange);
    UserStore.addChangeListener(this._onChange);
    this.setParentState();
  },

  componentWillUnmount: function() {
    PostStore.removeChangeListener(this._onChange);
    UserStore.removeChangeListener(this._onChange);
  },

  componentWillMount: function() {
    UserStore.addChangeListener(this._onChange);
    PostStore.addChangeListener(this._onChange);
    //console.log('Posts to be displayed ', posts);
  },

  componentDidUpdate: function(prevProps, prevState) {
    //console.log("WILL RECIEVE PROPS", prevProps.posts);
    //console.log("HAS SET SONG LIST", this.state.hasSetSongList);
    if(Object.keys(prevProps.posts).length > 0 && !this.state.hasSetSongList) {
      //console.log("SETTING THE SONG LIST", this.state.hasSetSongList);
      this.setState({hasSetSongList:true});
      this.setParentState(prevProps.posts);
    }
  }, 

  setParentState: function(posts) {
    var sl = getSongList(posts);
    if(Object.keys(sl).length > 0) {
      this.props.setSongList(sl);
    }
  }, 

  upvote: function(postid) {
    this.props.onPostUpvote(postid);
  },

  playPauseItem: function(stream_url, track, idx) {
    if(this.state.currentTrack != null) {
      var prevPli = this.state.currentTrack;
      var pli = this.refs[prevPli];
      if(pli != null){ 
        pli.getDOMNode().className = "tf-post-item";
      } 
    }
    this.setState({currentTrack:track.id});
    this.props.onPostListItemClick(stream_url, track, idx);
  },

  hasUpvoted: function(post, userid) {
      //console.log(post);
      var exists = post.voters.indexOf(userid);
      //console.log(post.id, exists);
      return (exists != -1) ? true : false;
  },

  // load more post for each day
  loadMorePosts: function(event) {
    var testDate = new Date(event.currentTarget.id);
    var date = moment(testDate).format('MM/DD/YYYY');
    
    // get total count of posts for that day 
    // to get next subsequent post
    var count = postCountByDates[event.currentTarget.id];

    var url = this.props.origin + '/posts';

    //get next subsequent posts for that day
    var data = {
        offset: count,
        limit: 10,
        date: date
    };

    //load the posts
    PostActions.loadMorePosts(url, data);
  },

  //render load more link below each day
  renderPostLoadMoreLink: function(date) {
      return ( 
          <div className = "row tf-posts-load-more-section">
              <span>LOAD MORE FOR &nbsp;
                  <a onClick = {this.loadMorePosts} id = {date} className = "tf-link tf-load-more-link"> TODAY </a>  
                  <a className = "tf-link tf-load-more-link"> &#9660; </a>
              </span>
          </div>
      );
  },

  renderPostsByDate: function(dates, posts) {
    //console.log(posts, dates);
    //console.log("USER", UserStore.isSignedIn(), UserStore.getCurrentUser());
    var isLoggedIn = UserStore.isSignedIn();
    var user = UserStore.getCurrentUser();
    var container = [];
    var songList = {};
    var count = 0;
    var songCount = 0;
    var first = 1;
    for(date in dates) {

        var d;
        var today = new Date();
        var yesterday = new Date();
        yesterday.setDate(today.getDate()-1);

        //console.log("TODAY IS", today.toDateString(), "YESTERDAY IS", yesterday.toDateString());
        d = moment(dates[date]).format('dddd, MMMM Do');
        /*if(dates[date] == today.toDateString()) {
          d = "Today";
          count+=1;
        } else if(dates[date] == yesterday.toDateString()) {
          d = "Yesterday";
          count+=1;
        } else {
          d = dates[date].toString();
        }*/
        var dateHeader = <PostListDateHeader key={'d_'+date} date={d}/>
        container.push(dateHeader);
        
        var array = toArray(posts[dates[date]]).sort(sortScore);
        //console.log("THE ARRAY", array);
        for(key in array) {
          if(isLoggedIn){
            var isUpvotedByUser = this.hasUpvoted(array[key], user.id);
            //console.log("IS UPVOTED BY USER", isUpvotedByUser);
          }
          // console.log("ID: ", array[key].id);
          songList[array[key].id] = array[key];
          var f = false;
          if(first == 1) {
            first = -1;
            f = true;
          } else {
            f = false;
          }
          var post = <PostListItem 
                        key={"p_"+songCount}
                        idx={songCount} 
                        ref={array[key].id}
                        post={array[key]}
                        onUpvote={this.upvote}
                        onClick={this.playPauseItem} 
                        isLoggedIn={isLoggedIn}
                        userId={ user != null ? user.id : null }
                        isUpvoted={isUpvotedByUser}
                        rank={key}
                        currStreamUrl={this.props.currStreamUrl}
                        showModal={this.props.showModal}
                        first={f}
                        origin={this.props.origin}/>
          container.push(post); 
          //console.log("HEYYA", songCount, array[key]);
          songList[songCount] = array[key];
          songCount+=1;          
        }
        container.push(this.renderPostLoadMoreLink(dates[date]));
      }
    /*console.log("setting the song list breh", songList);
    if(songCount > 0 && !_songsSet) {
      SongActions.setSongList(songList);
      _songsSet = true;
    }*/
    //console.log("setting the song list breh", songList);

    //this.props.setSongList(songList);
    //_songList = songList;
    return container;
  },

  /**
   * @return {object}
   */
  render: function() {
    var posts = this.props.posts;
    
    var postsByDate = sortPostsByDate(posts); //sort posts into date keyed dict + array of date str for the headers
    //console.log("PDBD", postsByDate, posts);
    var dates = postsByDate[0].sort(sortDate); //sort dates in decending order
  
    var posts = postsByDate[1] //date keyed dict

    postCountByDates = getPostCountByDates( postsByDate[1] );

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
    this.setState(getComponentState());
  }

});

module.exports = PostsList;
