// ranking algorithm 

module.exports = {

	//get the time in seconds from the date
	epoch_seconds: function(date) {
		var diff = date.getTime(); // from a default epoch of jan 1 1970
		return diff/1000; //to return seconds not milliseconds
	},

	//generate a hot score value for a post
	scorePost: function (score, created_at) {
		var launch_epoch = 1451609200; //in seconds
		var score = score;
		var order = Math.log10(Math.max(Math.abs(score), 1));
		var seconds = this.epoch_seconds(new Date(created_at)) - launch_epoch;
		var retVal = Math.round(((order + seconds) * 100000) /45000)/100000 ; // multiply by 10000 then div by the same for 4 precsision
		return retVal;
	},

	//sort the post batch by their new hotScore attr
	sortHot: function (a, b) {
		if( a.hotScore > b.hotScore ) { return -1; }
		else if( a.hotScore < b.hotScore ) { return 1; }
		else return 0;
	},

	printPosts: function (posts) {
		//console.log("RESULTS \n=======\n");
		for(var i in posts) {
			var post = posts[i];
			console.log("post "+post.id+": "+post.hotScore);
		}
	},

	//test
	scorePosts: function () {
		postsToSceonds(posts);
		var hotPosts = posts.map(scorePost);
		hotPosts = hotPosts.sort(sortHot);
		return hotPosts;
	}
	
}
