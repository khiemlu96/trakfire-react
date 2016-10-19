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
var Carousel = require('react-bootstrap').Carousel;
var CarouselItem = require('react-bootstrap').CarouselItem;
var Moment = require('moment');
var PostActions = require('../actions/PostActions');
var PostListItem = require('./PostListItem.jsx');
var PostListDateHeader = require('./PostListDateHeader.jsx');
var PostListHeader = require('./PostListHeader.jsx');
var PostListFeatureHeader = require('./PostListFeatureHeader.jsx');
var FilterBar = require('./FilterBar.jsx');
var PostStore = require('../stores/PostStore');
var UserStore = require('../stores/UserStore');
var SongActions = require('../actions/SongActions');
var UserActions = require('../actions/UserActions.js');

var LeaderBoard = require('./LeaderBoard.jsx');
var moment = require('moment');
var _postListItems = [];
var _dayCount = 0;
var _init = false;
var _songList = {};
var _songsSet = false;
var _firstSong = null;
var postCountByDates = [];

var Firebase = require("firebase");
var TfFirebaseRef = new Firebase("https://trakfire.firebaseio.com/");

var imagesInfoRef = TfFirebaseRef.child("carousal-images");
var originalImgRef = TfFirebaseRef.child("original-carousal-images");

var classNames = require('classnames');

var isPlaying = classNames("tf-media-thumbnail-overlay playing");
var isPaused = classNames("tf-media-thumbnail-overlay paused");
var isNotPlaying = classNames("tf-media-thumbnail-overlay");

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
    postsByDate: PostStore.getPostsByDate(),
    sortedPosts : PostStore.getSortedPosts(),
    getCurrentSong : PostStore.getCurrentSong(),
    carousal_images : UserStore.getAdminCarousalFiles(),
    botUsers : UserStore.getBotUsers()
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

function getCarousalImageArray(images) {
  var keys = [];

  for (var key in images) {
    keys.push(key);
  }
  return [keys, images];
}

function isToday(momentDate) {
    var ref = moment();
    var today = ref.clone().startOf('day');
    return momentDate.isSame(today, 'd');
}

function isYesterday(momentDate) {
    var ref = moment();
    var yesterday = ref.clone().subtract(1, 'days').startOf('day');
    return momentDate.isSame(yesterday, 'd');
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
    origin: ReactPropTypes.string,
    filterPosts: ReactPropTypes.func
  },

  getInitialState: function() {
    var storedState = getComponentState();
    storedState.currentTrack = null;
    storedState["hasSetSongList"] = false;
    return storedState;
  },

  getFile: function(key, fileKey) {
      var self = this;

      originalImgRef.child( fileKey ).on('value', function(snapshot) {
          var file = snapshot.val();
          carousal_images[key].file = file.file;

          self.setState({
              carousal_images: carousal_images
          });
      });
  },

  getCarousalFilesFromIds: function() {
    var self = this;
    carousal_images = toArray(this.state.carousal_images);

    if( carousal_images !== null || carousal_images !== undefined ) {
      for(key in carousal_images ) {
          var fileKey = carousal_images[key].file_firebase_key;
          self.getFile(key, fileKey);
      }
    }
  },

  getAdminCarousalFiles: function() {
    var data = {
        limit: 3,
        offset: 0,
        page: 1
    };
    UserActions.getAdminCarousalFiles(this.props.origin + '/tf_files', data);
  },

  componentDidMount: function() {
    var self = this;
    var carousal_images = [];

    this.getAdminCarousalFiles();
    //console.log("POSTS IN POST LIST", this.props.posts);
    //var posts = getSongList(p);
    //this.props.setSongList(this.state.posts);
    PostStore.addChangeListener(this._onChange);
    UserStore.addChangeListener(this._onChange);
    UserActions.getBotUsers(this.props.origin + '/bots');
    //this.setParentState();
  },

  componentWillUnmount: function() {
    PostStore.removeChangeListener(this._onChange);
    UserStore.removeChangeListener(this._onChange);
  },

  componentWillMount: function() {
    //UserStore.addChangeListener(this._onChange);
    //PostStore.addChangeListener(this._onChange);
    //console.log('Posts to be displayed ', posts);
  },

  componentDidUpdate: function(prevProps, prevState) {
    //console.log("WILL RECIEVE PROPS", prevState.posts, this.state.posts);
    //console.log("HAS SET SONG LIST", this.state.hasSetSongList);
    if(Object.keys(prevProps.posts).length > 0 && !this.state.hasSetSongList) {
      //console.log("SETTING THE SONG LIST", this.state.hasSetSongList);
      this.setState({hasSetSongList:true});
      //this.setParentState(prevProps.posts);
    }
  },

  setParentState: function(posts) {
    var sl = getSongList(posts);
    if(Object.keys(sl).length > 0) {
      this.props.setSongList(sl);
    }
  },

  upvote: function(postid) {
    console.log("in post list upvote");
    this.props.onPostUpvote(postid);
  },

    updateIcons: function(track, isPlaying) {
    console.log("night tracking", track, isPlaying); //argument list is shifted right one
    if( typeof isPlaying === 'object') {
      track = isPlaying.next;
      isPlaying = isPlaying.isPlaying;
    }
    if(this.state.currentTrack != null) {
      var pli = this.refs[track.id].refs.overlay;
      if(pli != null){
        // if state isPlaying is true then show pause icon in square,
        // else show 'play' icon
        console.log('inside the dms');
        for(idx in this.props.posts) {
          var post = this.props.posts[idx];
          var p = this.refs[post.id];
          if(p) {
            p.refs.overlay.getDOMNode().className = "icon icon-controller-play";
            p.refs.overlaybg.getDOMNode().className = "tf-media-thumbnail-overlay";
          }
        }

        console.log("TOGGLE THE TRACK", isPlaying, pli);
        if( isPlaying === true ) {
          pli.getDOMNode().className = "icon icon-controller-paus";
          this.refs[track.id].refs.overlaybg.getDOMNode().className = 'tf-media-thumbnail-overlay playing';
        } else {
          pli.getDOMNode().className = "icon icon-controller-play";
          this.refs[track.id].refs.overlaybg.getDOMNode().className = 'tf-media-thumbnail-overlay';
        }
      }
    }
    this.setState({currentTrack:track.id});
  },

  playPauseItem: function(stream_url, track, idx, isPlaying) {
    console.log("playing the track");
    if(this.state.currentTrack != null) {
      var prevPli = this.state.currentTrack;
      var pli = this.refs[prevPli].refs.overlay;
      var pliBG = this.refs[prevPli].refs.overlaybg;
      console.log("managing icon state", pli);
      if(pli != null){
        pli.getDOMNode().className = "icon icon-controller-play";
        pliBG.getDOMNode().className = isNotPlaying;
      }
    }

    // deactivate other tracks

    var posts = this.state.posts;
    for(idx in posts) {
      var post = posts[idx];
      if(post.id != track.id) {
        var p = this.refs[post.id];
        if(p) {
          console.log("PPPP", p);
          p.refs.overlay.getDOMNode().classname = "icon icon-controller-play";
          p.refs.overlaybg.getDOMNode().classname = isNotPlaying;
        }
      }
    }

    var nextTrack = track.id;
    pli = this.refs[nextTrack].refs.overlay;
    pliBG = this.refs[nextTrack].refs.overlaybg;

    if(pli != null){
      if( isPlaying == true ) {
        pli.getDOMNode().className = "icon icon-controller-paus";
        pliBG.getDOMNode().className = "tf-media-thumbnail-overlay playing";
      } else {
        pli.getDOMNode().className = "icon icon-controller-play";
        pliBG.getDOMNode().className = "tf-media-thumbnail-overlay paused";
      }
    }

    this.setState({currentTrack:track.id});
    this.props.onPostListItemClick(stream_url, track, idx);
  },

  hasUpvoted: function(post, userid) {
      //console.log("has this user upvoted?", post, userid, post.votes);

      if(post.author_id == userid) {
        return true;
      }
      var exists = post.voters.indexOf(userid);
      //console.log(post.id, exists);
      return (exists != -1) ? true : false;
  },

  // load more post for each day
  loadMorePosts: function(event) {
    var testDate = new Date(event.currentTarget.id);
    var date = moment(testDate).format('MM/DD/YYYY');
    //console.log("DATER", date)
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
                  <a onClick = {this.loadMorePosts} id = {date} className = "tf-link tf-load-more-link"> {date} </a>
                  <a className = "tf-link tf-load-more-link"> &#9660; </a>
              </span>
          </div>
      );
  },

  renderPosts: function() {

    var posts = this.state.postsByDate;
    var postList = [];
    var isLoggedIn = UserStore.isSignedIn();
    var user = UserStore.getCurrentUser();
    var dates = Object.keys(posts);
    var firstPost = null;
    var count = 0;

    for(var i = 0; i < dates.length; i++){

      var date = dates[i];
      if(isToday(moment(date))) {
        var displayDate = "TODAY";
      } else if(isYesterday(moment(date))) {
        var displayDate = "YESTERDAY";
      } else {
        var displayDate = moment(date).format('dddd, MMMM Do');
      }
      //var displayDate = moment(date).format('dddd, MMMM Do');
      var postsForDate = posts[date];
      //console.log("Day", date, displayDate);
      var dateHeader = <PostListDateHeader key={'d_'+date} date={displayDate}/>
      postList.push(dateHeader);

      for(var j = 0; j < postsForDate.length; j++) {

        var idx = (j+1)*(i+1);
        //console.log("IDX", idx);
        var post = postsForDate[j];
        if(isLoggedIn){
          var isUpvotedByUser = this.hasUpvoted(post, user.id);
        }
        var item = <PostListItem
                        key={"p_"+count}
                        idx={j}
                        ref={post.id}
                        post={post}
                        onUpvote={this.upvote}
                        onClick={this.playPauseItem}
                        isLoggedIn={isLoggedIn}
                        userId={ user != null ? user.id : null }
                        isUpvoted={isUpvotedByUser}
                        rank={j}
                        currStreamUrl={this.props.currStreamUrl}
                        showModal={this.props.showModal}
                        first={ (idx == 1) ? true : false }
                        origin={this.props.origin}
                        number={j}
                        showNumber={true}
                        showAuthor={true}
                        changeIcons={this.updateIcons}
                        bot_users={this.state.botUsers}/>

        if(idx == 1) { firstPost = post; }
        postList.push(item);
        count++;
      }
    }

    return {"postList" : postList, "firstPost" : firstPost};

  },

  /**
   * @return {object}
   */
  render: function() {
    var retVal = this.renderPosts();
    var _postListItems = retVal.postList;
    var firstSong = retVal.firstPost;
    //console.log(_postListItems, firstSong);

    if(!_postListItems.length) {
      return (<div></div>);
    }
    var postListStyle = { marginTop: 20+"px" };
    var carousalItemHtml = <CarouselItem></CarouselItem>;
    var nocaro = false

    if( this.state.carousal_images !== null && nocaro) {
      carousal_items = getCarousalImageArray( this.state.carousal_images );
      var keys = carousal_items[0];
      var original_images = carousal_items[1];
      carousalItemHtml =
      <Carousel>
            <CarouselItem>
              <img width={900} height={500} alt="900x500" src={original_images[keys[0]] ? original_images[keys[0]].file : ""} alt="pure fire pic"/>
            </CarouselItem>
            <CarouselItem>
              <img width={900} height={500} alt="900x500" src={original_images[keys[1]] ? original_images[keys[1]].file : ""} alt="pure fire pic"/>
            </CarouselItem>
            <CarouselItem>
              <img width={900} height={500} alt="900x500" src={original_images[keys[2]] ? original_images[keys[2]].file : ""} alt="pure fire pic"/>
            </CarouselItem>
      </Carousel>;
    }

    return (
      <div>

      {/*<PostListHeader post={firstSong}/>*/}
      <PostListFeatureHeader post={firstSong}/>
      <div className="container p-t-md" style={postListStyle}>
        <div className="row">
          <div className="col-md-8">
            <ul className="media-list">{_postListItems}</ul>
          </div>
          <div className="col-md-4">
              {carousalItemHtml}
              <LeaderBoard origin={this.props.origin} showModal={this.props.showModal}/>
          </div>
        </div>
      </div>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getComponentState());
    this.getCarousalFilesFromIds();
  }

});

module.exports = PostsList;
