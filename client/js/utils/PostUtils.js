//PostUtils
module.exports = {

  convertRawPost: function(rawPost) {
    //console.log("vote_count",rawPost.vote_count);
    //console.log("user", rawPost.user);
    console.log("RAWPOST", rawPost);
    //console.log("TAGS", rawPost.tags);
    return {
      id: rawPost.id,
      title: rawPost.title,
      date: new Date(rawPost.created_at),
      artist: rawPost.artist,
      genre: rawPost.genre,
      author: rawPost.user.handle,
      author_img: rawPost.user.img,
      author_name: rawPost.user.username,
      stream_url: rawPost.stream_url,
      img_url: rawPost.img_url, 
      duration: rawPost.duration,
      vote_count: rawPost.vote_count,
      voters: this.getUserIds(rawPost.votes),
      score: rawPost.hot_score, 
      tags: rawPost.tags
    };
  },

  getUserIds: function(voteObj) {
    var ids = [];
    for(idx in voteObj) {
      console.log()
      var voter = voteObj[idx].user_id;
      ids.push(voter);
    }
    return ids;
  }
};

