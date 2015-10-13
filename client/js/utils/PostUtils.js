//PostUtils

module.exports = {

  convertRawPost: function(rawPost) {
    return {
      id: rawPost.id,
      title: rawPost.title,
      date: new Date(rawPost.created_at),
      artist: rawPost.artist,
      genre: rawPost.genre,
      author: rawPost.user.handle,
      author_img: rawPost.user.img,
      stream_url: rawPost.stream_url,
      thumbnail_url: rawPost.img_url, 
      duration: rawPost.duration
    };
  }

};