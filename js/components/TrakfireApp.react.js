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
    currentSongIdx: -1,
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
    this.setState({
      currTrack: track
      //currentSongIdx: currentSongIdx
    });
    this.setState(function(previousState, currentProps) {
      return {currentSongIdx: previousState.currentSongIdx + 1};
    }, function(){console.log('UPDATED STATE FROM MOUNT ', this.state)});
    //console.log('MOUNTED DAWG', this.state);
  },

  componentWillUnmount: function() {
    PostStore.removeChangeListener(this._onChange);
  },

  componentDidUpdate: function(prevProps, prevState, prevContext) {
    if (this.state.isPlaying && this.state.currentSongIdx != prevState.currentSongIdx) {
      console.log('THE COMPONENT DID UPDATE');
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
            onPostListItemClick={this.onSongItemClick}
            loadSortedPlaylist={this.loadSortedPlaylist}
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

  loadSortedPlaylist: function(playlist, idx) {
    this.setState({ playlist: playlist, currentSongIdx : idx);
    //show the playlist here
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
    this.setState({ isPause: isPause });
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
    this.stop();
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
    this.setState({ seek: this.howler.pos(0) });
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
   * Event handler for 'change' events coming from the 
   */
  _onChange: function() {
    this.setState(getAppState());
  }

});

module.exports = TrakfireApp;
