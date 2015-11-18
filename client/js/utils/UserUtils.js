
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
      twturl: rawUser.twitterUrl,
      isAdmin: rawUser.isAdmin,
      canPost: rawUser.canPost,
      posts: rawUser.posts, 
      upvotes: rawUser.upvotes
    };
  }

};