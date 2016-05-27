var SoundCloudAudio = require('soundcloud-audio');
var _namespace = "TF_PLAYLIST::";
var Logger = require("Logger.js");
Logger.init(_namespace);

function buildReferenceTable(list) {
	var count = 0;
	var ref = {};
	for(idx in list) {
		console.log(idx, list[idx]);
		ref[idx] = count;
		count++;
	}
	return ref;
}

var Playlist = {
	/* member variables */
	current: null, 	//the current track
	list: null, 	//the playlist
	listRef: null, 	//a post_id => list idx reference table
	next: null,  	//the next track
	prev: null, 	//the previous track
	player: null,

	/* takes in a list of posts (ordered) and a sound cloud audioplayer object */
	init: function(list, player) {
		this.list = list;
		this.player = player
		this.listRef = [];
		/* create the list ref object */
		this.listRef = buildReferenceTable(this.list);
	}, 

	setCurrent: function(track_id) {
		var idx = this.listRef[track_id];
		var current = this.list[idx];
		Logger.log("current song to be set to "+current.title);
		this.current = current;
	}, 

	play: function() {
		if(this.current) {
			this.player.play({streamUrl: this.current.stream_url});
		} else {
			Logger.log("no track to play");
		}
	}, 

	next: function() {
		if(this.next) {
			this.player.stop();
			this.setCurrent(this.next);
			this.play();
		} else {
			Logger.log("no track to play");
		}
	}, 

	prev: function() {
		if(this.prev) {
			this.player.stop();
			this.setCurrent(this.prev);
			this.play();
		} else {
			Logger.log("no track to play");
		}		
	}, 

	update: function(list) {
		this.list = list;
		this.listRef = buildReferenceTable(this.list);
	}
}

module.exports = Playlist;