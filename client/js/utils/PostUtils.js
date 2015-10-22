//PostUtils

module.exports = {

  convertRawPost: function(rawPost) {
    console.log("vote_count",rawPost.vote_count);
    console.log("user", rawPost.user);
    console.log("RAWPOST", rawPost);
    return {
      id: rawPost.id,
      title: rawPost.title,
      date: new Date(rawPost.created_at),
      artist: rawPost.artist,
      genre: rawPost.genre,
      author: rawPost.user.handle,
      author_img: rawPost.user.img,
      stream_url: rawPost.stream_url,
      img_url: rawPost.img_url, 
      duration: rawPost.duration,
      votes: rawPost.vote_count
    };
  }

};