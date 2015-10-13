//TrakfireApp.js

var React = require('react');
//var Router = require('react-router');
//var RouteHandler = Router.RouteHandler;
var Uri = require('jsuri');
var ReactPropTypes = React.PropTypes;

var NavBar = require('./NavBar.jsx');
var FilterBar = require('./FilterBar.jsx');
var PostsList = require('./PostsList.jsx');
var TrakfirePlayer = require('./TrakfirePlayer.jsx');
var PostForm = require('./PostForm.jsx');
var PostStore = require('../stores/PostStore');
var PostActions = require('../actions/PostActions');
var Howl = require('howler').Howl;
var clientId = "9999309763ba9d5f60b28660a5813440";

/**
 * Retrieve the current post and user data from the PostStore
 */
function getAppState() {
  return {
    allPosts: PostStore.getAll(),
    currentUser: PostStore.getCurrentUser(),
    isLoggedIn: PostStore.isSignedIn(),
    playlist: [],
    currentSongIdx: -1,
    sort: "",
    genre: "",
    isPlaying: false,
    isLoading: false,
    isPaused: true,
    seek: 0,
    volume: 1.0,
    duration: 0,
    currTrack: {},
    showModal: false
  };
}

function formatStreamUrl(url) {
  return url+'?client_id='+clientId;
}

var TrakfireApp = React.createClass({

  getInitialState: function() {
    return getAppState();
  },

  getDefaultProps: function() {
    return {origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''};
  },

  componentWillMount: function() {
    var jwt = new Uri(location.search).getQueryParamValue('jwt');
    console.log('JWT: ', jwt, !!jwt);
    if (!!jwt) {
      console.log('SET SESSION W JWT');
      sessionStorage.setItem('jwt', jwt);
    }
  },

  componentDidMount: function() {
    PostStore.addChangeListener(this._onChange);
    this.readPostsFromApi();
    if (!!sessionStorage.getItem('jwt')) {
      console.log('FETCHING USER');
      this.currentUserFromAPI();
    }
    var allPosts = this.state.allPosts;
    var playlist = this.state.playlist;
    for (var id in allPosts) {
      playlist.push(allPosts[id]);
    }
    console.log(playlist)
    i = 0;
    if(playlist.length > 0) {
      if(playlist[i].stream_url) var track = playlist[i];
      else while( !playlist[i].stream_url && i < playlist.length ){i++;}
    }

    this.setState({currTrack: track});
    this.setState(function(previousState, currentProps) {
      return { currentSongIdx: previousState.currentSongIdx + 1 };
    }, function(){console.log('UPDATED STATE FROM MOUNT ', this.state)});
  },

  componentWillUnmount: function() {
    PostStore.removeChangeListener(this._onChange);
  },

  componentDidUpdate: function(prevProps, prevState, prevContext) {
    console.log('UPDATE');
    console.log(this.state.playlist, prevState.playlist);
    console.log('DIFF', this.state.playlist !== prevState.playlist);
    if(this.state.playlist !== prevState.playlist) {
      var allPosts = this.state.allPosts;
      var playlist = this.state.playlist;
      for (var id in allPosts) {
        playlist.push(allPosts[id]);
      }
      console.log(playlist)
      i = 0;
      if(playlist.length > 0) {
        if(playlist[i].stream_url) var track = playlist[i];
        else while( !playlist[i].stream_url && i < playlist.length ){i++;}
      }
      console.log("DID UPDATE WITH NEW LIST ", playlist);
      this.setState({currTrack: track});
      this.setState(function(previousState, currentProps) {
        return { currentSongIdx: previousState.currentSongIdx + 1 };
      }, function(){console.log('UPDATED STATE FROM MOUNT ', this.state)});

      this.forceUpdate();
    }

    if (this.state.isPlaying && this.state.currentSongIdx != prevState.currentSongIdx) {
      console.log('THE COMPONENT DID UPDATE');
      this.initSoundObject();
    }
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    var s = this.state.playlist !== nextState.playlist;
    var i = this.state.currentSongIdx != nextState.currentSongIdx;
    var m = this.state.showModal != nextState.showModal;
    var c = this.state.genre != nextState.genre || this.state.sort != nextState.sort;
    //var t = !this.state.isPlaying;
    console.log('ROOT SHOULD UPDATE', s+i+m+c);
    return s+i+m+c;
  }, 

  handleUserNavigation: function() {
    //irrelevant rn
  },

  readPostsFromApi: function(){
    console.log('FETCHING POST BATCH', this.props.origin);
    PostActions.getPostBatch(this.props.origin+'/posts');
  },

  currentUserFromAPI: function() {
    console.log('GET CURRENT USER');
    PostActions.getCurrentUser(this.props.origin+'/current_user');
  },

  writePostsToApi: function(data){
    console.log('WRITING POSTS TO THE API');
    PostActions.writePost(this.props.origin+'/posts', data);
  },

  handleUserSelection: function(genre, sort) {
    var currGenre = this.state.genre;
    var currSort = this.state.sort;
    console.log('filter to '+genre+' from '+currGenre+', sort by '+sort+' from '+currSort );
    this.setState({
      genre: genre ? genre : currGenre,
      sort: sort ? sort : currSort
    }); 
  },

  showModal: function(isOpen) {
    this.setState({showModal: isOpen});
  },

  /**
   * @return {object}
   */
  render: function() {
    //var audio = this.state.currTrack ? new Audio(this.state.currTrack.stream_url) : null; 
    var currTrack = this.state.currTrack;
    console.log('rendering all', this.state.allPosts);
    return (
      <div>
        <div className="container">
          <NavBar 
            isLoggedIn={this.state.isLoggedIn}
            origin={this.props.origin}
            showModal={this.showModal}
          />
          <FilterBar 
            onClick={this.handleUserSelection}
          />
          <PostsList
            allPosts={this.state.allPosts}
            genre={this.state.genre}
            sort={this.state.sort}
            onPostListItemClick={this.onSongItemClick}
            loadSortedPlaylist={this.loadSortedPlaylist}
            playlist={this.state.playlist}
          />
        </div>
        <div>
        <TrakfirePlayer 
          currTrack={this.state.currTrack}
          isPlaying={this.state.isPlaying}
          scClientId={clientId}
          onNextClick={this.onNextBtnClick}
          onPrevClick={this.onPrevBtnClick}
          onPlayPauseClick={this.onPlayBtnClick}
        />
        <PostForm
          isSignedIn={this.state.isLoggedIn}
          onSubmit={this.writePostsToApi}
          closeModal={this.showModal}
          showModal={this.state.showModal}
        />
        </div>
      </div>
    );
  },

  loadSortedPlaylist: function(playlist, idx) {
    this.setState({ playlist: playlist, currentSongIdx : idx});
  },

  onPlayBtnClick: function() {
    console.log('clicked play', this.state);
    if (this.state.isPlaying && !this.state.isPaused) {
      var isPaused = !this.state.isPaused;
      this.setState({ isPaused: isPaused, isPlaying : false });
      this.pause();
      //return;
    } 
    else if(this.state.isPaused && !this.state.isPlaying){
      console.log('playing');
      this.play();
    }
    else {return;}
  },

  onPauseBtnClick: function() {
    var isPaused = !this.state.isPaused;
    this.setState({ isPaused: isPaused });
    isPaused ? this.pause() : this._play();
  },

  onPrevBtnClick: function() {
    this.prev();
  },

  onNextBtnClick: function() {
    this.next();
  },

  onSongItemClick: function(songIndex) {
    // handle pause/playing state.
    console.log(songIndex, this.state.currentSongIdx);
    if (this.state.currentSongIdx == songIndex) {
      if (this.state.isPaused) {
        this.onPauseBtnClick();
        //this.refs.songList.hideDropdownMenu();
      } else if (!this.state.isPlaying) {
        this.onPlayBtnClick();
        //this.refs.songList.hideDropdownMenu();
      }
      return;
    }

    // handle index change state, it must change to play.
    //this.stop();
    this.clearSoundObject();
    this.setState({ 
                    currentSongIdx: songIndex,
                    duration: 0,
                    isPlaying: true,
                    isPaused: false
                  });
   // this.refs.songList.hideDropdownMenu();
  },

  play: function() {
    
    this.setState({ isPlaying: true, isPaused: false });

    if (!this.howler) {
      this.initSoundObject();
    } else {
      var songUrl = formatStreamUrl(this.state.playlist[this.state.currentSongIdx].stream_url);
      console.log("SONG URL", songUrl);
      if (songUrl != this.howler._src) {
        this.initSoundObject();
      } else {
        this._play();
      }
    }
  },

  initSoundObject: function() {
    console.log('INIT');
    this.clearSoundObject();
    this.setState({ isLoading: true });

    var playlist = this.state.playlist;
    var cIdx = this.state.currentSongIdx;
    var song = playlist[cIdx];

    this.setState({currTrack : song});

    this.howler = new Howl({
      src: formatStreamUrl(song.stream_url),
      urls: [formatStreamUrl(song.stream_url)],
      format: 'mp3',
      volume: this.state.volume,
      onload: this.initSoundObjectCompleted,
      onloaderror: this.initLoadFailure,
      onend: this.playEnd
    });
    console.log(this.howler, this.state.isLoading);
  },

  clearSoundObject: function() {
    if (this.howler) {
      this.howler.stop();
      this.howler.unload();
    }
  },

  initLoadFailure: function(){
    alert("FAILURE Loading track");
  },

  initSoundObjectCompleted: function() {
    console.log('INIT COMPLETE WITH ', this.state);
    this._play();
    this.setState({ 
      duration: 0,
      isLoading: false
    });
  },

  _play: function() {
    this.howler.play();
    this.stopUpdateCurrentDuration();
    this.updateCurrentDuration();
    this.interval = setInterval(this.updateCurrentDuration, 1000);
  },

  playEnd: function() {
    if(this.state.currentSongIdx == this.state.playlist.length - 1) {
      this.stop();
    } else {
      this.next();
    }
  },

  stop: function() {
    this.stopUpdateCurrentDuration();
    this.setState({ seek: 0, isPlaying: false });
  },

  pause: function() {
    this.howler.pause();
    this.stopUpdateCurrentDuration();
  },

  prev: function() {
    if (this.state.seek > 1 || this.state.currentSongIdx == 0) {
      this.seekTo(0);
    } else {
      this.updateSongIndex(this.state.currentSongIdx - 1);
    }
  },

  next: function() {
    //console.log('UPDATING FROM NEXT', this.state.currentSongIdx + 1);
    this.updateSongIndex(this.state.currentSongIdx + 1);
  },

  updateSongIndex: function(index) {
//    console.log("UPDATING", index);
    /*this.setState({ 
      currentSongIdx: index,
      duration: 0
    });*/
    this.setState(function(previousState, currentProps) {
      return {currentSongIdx: index};
    }, function(){console.log('UPDATED STATE FROM updateSongIndex', this.state)});
    //console.log("UPDATED STATE", this.state);
    if (this.state.isPaused) {
      this.stop();
      this.clearSoundObject();
    } else {
      this.stopUpdateCurrentDuration();
    }
  },

  updateCurrentDuration: function() {
    //this.setState({ seek: this.howler.pos(0) });
  },

  stopUpdateCurrentDuration: function() {
    clearInterval(this.interval);
  },

  seekTo: function(percent) {
    var seek = this.state.duration * percent;
    this.howler.pos(seek);
    this.setState({ seek: seek });
  },

  adjustVolumeTo: function(percent) {
    this.setState({ volume: percent });
    if (this.howler) {
      this.howler.volume(percent);
    }
  },

  songCount: function() {
    return this.state.playlist ? this.state.playlist.length : 0;
  },

  getCurrentSongName: function() {
    if (this.state.currentSongIdx < 0) {
      return "";
    }
    var song = this.state.playlist[this.state.currentSongIdx];
    return song.title;
  },

  /**
   * Event handler for 'change' events coming from the PostStore
   */
  _onChange: function() {
    this.setState(getAppState());
  }

});

module.exports = TrakfireApp;
