// ranking algorithm 
"use strict"
var count = -1;

class Post {
	constructor(score, created_at) {
		this.id = count += 1;
		this.score = score;
		this.created_at = created_at;
		this.hotScore = 0;
	}
}

var launch_epoch = 1462487592; //in seconds
var posts = [
				new Post(1, new Date("October 13, 2016 11:13:00")), 
				new Post(5, new Date("October 13, 2016 11:13:02")),
				new Post(10, new Date("October 13, 2016 11:13:20")),
				new Post(14, new Date("October 13, 2016 12:13:00")),
				new Post(5, new Date("October 13, 2016 01:13:10")),
				new Post(25, new Date("October 13, 2016 11:20:00")),
				new Post(2, new Date("October 13, 2016 11:01:00")),
				new Post(1, new Date("October 13, 2016 10:13:00"))
			];

//get the time in seconds from the date
function epoch_seconds(date) {
	var diff = date.getTime(); // from a default epoch of jan 1 1970
	return diff/1000; //to return seconds not milliseconds
}

//convert post.created_at to seconds
function postsToSceonds(posts) {
	//clean up the created_at value
	for(var i in posts) {
		var post = posts[i];
		post.created_at = epoch_seconds(post.created_at);
	}
}

//generate a hot score value for a post
function scorePost(post) {
	var score = post.score;
	var order = Math.log10(Math.max(Math.abs(score), 1));
	var seconds = post.created_at - launch_epoch;
	var retVal = Math.round(((order + seconds) * 100000) /45000)/100000 ; // multiply by 10000 then div by the same for 4 precsision
	post.hotScore = retVal;
	return post;
}

//sort the post batch by their new hotScore attr
function sortHot(a, b) {
	if( a.hotScore > b.hotScore ) { return -1; }
	else if( a.hotScore < b.hotScore ) { return 1; }
	else return 0;
}

function printPosts(posts) {
	console.log("RESULTS \n=======\n");
	for(var i in posts) {
		var post = posts[i];
		console.log("post "+post.id+": "+post.hotScore);
	}
}

//test
function __scorePosts() {
	console.log("starting test \n");
	postsToSceonds(posts);
	var hotPosts = posts.map(scorePost);
	hotPosts = hotPosts.sort(sortHot);
	printPosts(hotPosts);
}

