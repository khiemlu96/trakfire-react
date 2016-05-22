
module.exports = {

  convertRawUser: function(rawUser) {
    console.log('RAW USER ', rawUser);
    return {
      id: rawUser.id,
      name: rawUser.username,
      uid: rawUser.uid,
      handle: rawUser.handle, 
      img: rawUser.img,
      bio: rawUser.tbio,
      twturl: "https://twitter.com/"+rawUser.handle,
      isAdmin: rawUser.isAdmin,
      canPost: rawUser.canPost,
      posts: rawUser.posts, 
      upvotes: this.getUpvotes(rawUser.upvotes),
      email: rawUser.email,
      followers: rawUser.followers,
      followings: rawUser.followings, 
      score: rawUser.score_weekly,//rawUser.score,
      score_weekly: rawUser.score_weekly,
      isVerified: rawUser.isVerified,
      original_profile_img: rawUser.original_profile_img || rawUser.img,
      unread_notifications: rawUser.unread_notifications, 
      isBot: rawUser.bot
    };
  }, 

  getUpvotes: function(rawUpvotes) {
      console.log("RAW UPVOTE ", rawUpvotes)
      var upvotes = [];
      var post, author, vote;
      for(idx in rawUpvotes) {
        console.log(vote);
        vote = rawUpvotes[idx];
        post = vote.post;
        author = vote.author;
        post.author_id = author.id;
        post.author_name = author.username;
        post.author = author.handle;
        upvotes.push(post);
      }
      console.log("UPVOTES CLEAN ", upvotes);
      return upvotes;
    }

};