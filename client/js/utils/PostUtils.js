//PostUtils
module.exports = {

  convertRawPost: function(rawPost) {
    //console.log("vote_count",rawPost.vote_count);
    //console.log("user", rawPost.user);
    //console.log("RAWPOST USER", rawPost.user);
    //console.log("TAGS", rawPost.tags);
    return {
      id: rawPost.id,
      title: rawPost.title,
      date: new Date(rawPost.created_at),
      artist: rawPost.artist,
      genre: this.getGenres(rawPost.genre),
      author: rawPost.user.handle,
      author_id: rawPost.user.id,
      author_img: rawPost.user.img,
      author_name: rawPost.user.username,
      stream_url: rawPost.stream_url,
      img_url: rawPost.img_url,
      img_url_lg: rawPost.img_url_lg, 
      duration: rawPost.duration,
      vote_count: rawPost.vote_count,
      voters: this.getUserIds(rawPost.post_votes),
      score: rawPost.hot_score, 
      tags: rawPost.tags, 
      status: rawPost.status,
      current: false,
      sortedIdx: -1,
      comments: (rawPost.comments !== undefined) ? rawPost.comments : rawPost.post_comments,
      votes: rawPost.post_votes
    };
  },

  getGenres: function(genreStr) {
    //console.log(genreStr);
    if(!genreStr)
      return genreStr;
    var genres = genreStr.trim().split(" ");
    return genres;
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

