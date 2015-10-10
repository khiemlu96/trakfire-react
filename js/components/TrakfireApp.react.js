//TrakfireApp.js

//var Footer = require('./Footer.react');
//var Header = require('./Header.react');
var FilterBar = require('./FilterBar.react');
var PostsList = require('./PostsList.react');
var TrakfirePlayer = require('./TrakfirePlayer.react');
var React = require('react');
var PostStore = require('../stores/PostStore');

var Howl = require('howler').Howl;
var clientId = "9999309763ba9d5f60b28660a5813440";

/**
 * Retrieve the current TODO data from the TodoStore
 */
function getAppState() {
  return {
    allPosts: PostStore.getAll(),
    playlist: [],
    currentSongIdx: 0,
    sort: "TOP",
    genre: "ALL",
    isPlaying: false,
    isLoading: false,
    isPaused: true,
    seek: 0,
    volume: 0.75,
    duration: 0,
    currTrack: {},
  };
}

function formatStreamUrl(url) {
  return url+'?client_id='+clientId;
}

var TrakfireApp = React.createClass({

  getInitialState: function() {
    return getAppState();
  },

  componentDidMount: function() {
    var allPosts = this.state.allPosts;
    var playlist = this.state.playlist;
    PostStore.addChangeListener(this._onChange);
    for (var id in allPosts) {
      playlist.push(allPosts[id]);
    }
    var track = playlist[0];
    var currentSongIdx = 0;
    this.setState({
      currTrack: track,
      currentSongIdx: currentSongIdx
    });
  },

  componentWillUnmount: function() {
    PostStore.removeChangeListener(this._onChange);
  },

  componentDidUpdate: function(prevProps, prevState, prevContext) {
    if (this.state.isPlaying && this.state.currentSongIdx != prevState.currentSongIdx) {
      this.initSoundObject();
    }
  },

  handleUserSelection: function(genre, sort) {
    console.log('filter to '+genre+' sort by '+sort);
    var currGenre = this.state.genre;
    var currSort = this.state.sort;
    this.setState({
      genre: genre ? genre : currGenre,
      sort: sort ? sort : currSort
    }); 
  },

  /**
   * @return {object}
   */
  render: function() {
    //var audio = this.state.currTrack ? new Audio(this.state.currTrack.stream_url) : null; 
    var currTrack = this.state.currTrack;
    console.log('rendering all');
    return (
      <div>
      <div className="container">
        <FilterBar 
          onClick={this.handleUserSelection}
        />
        <PostsList
          allPosts={this.state.allPosts}
          genre={this.state.genre}
          sort={this.state.sort}
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

      </div>
      </div>
    );
  },

  onPlayBtnClick: function() {
    console.log('clicked play', this.state);
    if (this.state.isPlaying && !this.state.isPaused) {
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
    var isPause = !this.state.isPaused;
    this.setState({ isPause: isPause });
    isPause ? this.pause() : this._play();
  },

  onPrevBtnClick: function() {
    this.prev();
  },

  onNextBtnClick: function() {
    this.next();
  },

  /*onSongItemClick: function(songIndex) {
    // handle pause/playing state.
    if (this.state.currentSongIdx == songIndex) {
      if (this.state.isPaused) {
        this.onPauseBtnClick();
        this.refs.songList.hideDropdownMenu();
      } else if (!this.state.isPlaying) {
        this.onPlayBtnClick();
        this.refs.songList.hideDropdownMenu();
      }
      return;
    }

    // handle index change state, it must change to play.
    this.stop();
    this.clearSoundObject();
    this.setState({ 
                    currentSongIndex: songIndex,
                    duration: 0,
                    isPlaying: true,
                    isPause: false
                  });
    this.refs.songList.hideDropdownMenu();

  },*/

  play: function() {
    
    this.setState({ isPlaying: true, isPause: false });

    if (!this.howler) {
      this.initSoundObject();
    } else {
      var songUrl = formatStreamurl(this.state.playlist[this.state.currentSongIdx].stream_url);
      console.log("SONG URL", songUrl);
      if (songUrl != this.howler._src) {
        this.initSoundObject();
      } else {
        this._play();
      }
    }
  },

  initSoundObject: function() {
    this.clearSoundObject();
    this.setState({ isLoading: true });

    var song = this.state.currTrack;
    console.log(formatStreamUrl(song.stream_url));
    this.howler = new Howl({
      src: formatStreamUrl(song.stream_url),
      urls: [formatStreamUrl(song.stream_url)],
      format: 'mp3',
      volume: this.state.volume,
      onload: this.initSoundObjectCompleted,
      onloaderror: this.initLoadFailure,
      onend: this.playEnd
    });
    //console.log(this.howler, this.state.isLoading);
  },

  clearSoundObject: function() {
    if (this.howler) {
      this.howler.stop();
      this.howler = null;
    }
  },
  initLoadFailure: function(){
    alert("FAILURE WITH SRC");
  },
  initSoundObjectCompleted: function() {
    console.log('init initSoundObjectCompleted');
    this._play();
    this.setState({ 
      duration: this.howler.duration(),
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
    this.updateSongIndex(this.state.currentSongIdx + 1);
  },

  updateSongIndex: function(index) {
    this.setState({ 
                    currentSongIdx: index,
                    duration: 0
                  });
    if (this.state.isPaused) {
      this.stop();
      this.clearSoundObject();
    } else {
      this.stopUpdateCurrentDuration();
    }
  },

  updateCurrentDuration: function() {
    this.setState({ seek: this.howler.seek() });
  },

  stopUpdateCurrentDuration: function() {
    clearInterval(this.interval);
  },

  seekTo: function(percent) {
    var seek = this.state.duration * percent;
    this.howler.seek(seek);
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
   * Event handler for 'change' events coming from the 
   */
  _onChange: function() {
    this.setState(getAppState());
  }

});

module.exports = TrakfireApp;
