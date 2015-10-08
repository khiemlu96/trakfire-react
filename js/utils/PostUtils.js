//PostUtils

module.exports = {

  convertRawPost: function(rawPost) {
    return {
      id: rawPost.id,
      title: rawPost.title,
      date: rawPost.date,
      artist: rawPost.artist,
      author: rawPost.user.id,
      author_img: rawPost.user.img,
      stream_url: rawPost.song.stream_url,
      thumbnail_url: rawPost.song.thumbnail_url
    };
  }

};