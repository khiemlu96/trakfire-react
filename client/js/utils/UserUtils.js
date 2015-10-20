
module.exports = {

  convertRawUser: function(rawUser) {
    console.log('USER ', rawUser);
    return {
      id: rawUser.id,
      name: rawUser.username,
      uid: rawUser.uid,
      handle: rawUser.handle, 
      img: rawUser.img,
      bio: rawUser.tbio,
      twturl: rawUser.twitterUrl,
      canPost: rawUser.canPost,
      posts: rawUser.posts
    };
  }

};