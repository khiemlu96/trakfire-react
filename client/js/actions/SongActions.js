
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SongConstants = require('../constants/SongConstants');
var SongActions = {

  setCurrentSong: function(song) {
    AppDispatcher.dispatch({
      actionType: PostConstants.SET_CURR_SONG,
      song: song
    });
  },

  setSongList: function(songs) {
    //console.log("SONGS", songs);
    AppDispatcher.dispatch({
      actionType: SongConstants.SET_SONG_LIST,
      songs: songs
    });    
  }, 

  pause: function() {
     AppDispatcher.dispatch({
      actionType: SongConstants.PAUSE,
    });    
  },

  play: function() {
    AppDispatcher.dispatch({
      actionType: SongConstants.PLAY,
    });  
  },

  next: function() {
  AppDispatcher.dispatch({
      actionType: SongConstants.NEXT,
    });  
  },

  prev: function() {
    AppDispatcher.dispatch({
      actionType: SongConstants.PREV,
    });  
  },
};

module.exports = SongActions;
