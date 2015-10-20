var React = require('react');
var PostActions = require('../actions/PostActions');
var UserPostGrid = require('./UserPostGrid.jsx');
var ProfileHeader = require('./ProfileHeader.jsx');
var ReactPropTypes = React.PropTypes;

var _dUser = {
  name: "Grant Collins",
  img: "https://pbs.twimg.com/profile_images/618481497159417856/mqVVw79M.jpg",
  bio: "I like biscuits",
  twitterLink: "http://twitter.com/vibegordon",
  posts: {
    upvoted : [
      {
        id: 'p_1',
        date: '10 6 2015',
        title: 'One Step Closer',
        artist: 'Linkin Park',
        genre: 'Rock',
        created_at: 1,
        song : {
          stream_url : "https://api.soundcloud.com/tracks/49931/stream",
          thumbnail_url : "http://hiphop-n-more.com/wp-content/uploads/2010/11/kanye-album-cover-2.jpg"
        },
        timestamp: Date.now() - 99999
      },
      {
        id: 'p_2',
        date: '10 7 2015',        
        title: 'Numb',
        artist: 'Linkin Park',
        genre: 'Rock',
        created_at: 1,
        song : {
          stream_url : "https://api.soundcloud.com/tracks/49931/stream",
          thumbnail_url : "https://consequenceofsound.files.wordpress.com/2014/03/warondrugs_dream.jpg"
        },
        timestamp: Date.now() - 89999
      },
      {
        id: 'p_3',
        date: '10 7 2015',
        title: 'New Divide',
        artist: 'Linkin Park',
        genre: 'Rock',
        created_at: 7,
        song : {
          stream_url : "https://api.soundcloud.com/tracks/49931/stream",
          thumbnail_url : "https://upload.wikimedia.org/wikipedia/en/3/39/DJKaskade_Strobelite.jpg"
        },
        timestamp: Date.now() - 79999
      }
    ],

    posted : [
      {
        id: 'p_1',
        date: '10 6 2015',
        title: 'One Step Closer',
        artist: 'Linkin Park',
        genre: 'Rock',
        created_at: 1,
        song : {
          stream_url : "https://api.soundcloud.com/tracks/49931/stream",
          thumbnail_url : "http://hiphop-n-more.com/wp-content/uploads/2010/11/kanye-album-cover-2.jpg"
        },
        timestamp: Date.now() - 99999
      },
      {
        id: 'p_2',
        date: '10 7 2015',        
        title: 'Numb',
        artist: 'Linkin Park',
        genre: 'Rock',
        created_at: 1,
        song : {
          stream_url : "https://api.soundcloud.com/tracks/49931/stream",
          thumbnail_url : "https://consequenceofsound.files.wordpress.com/2014/03/warondrugs_dream.jpg"
        },
        timestamp: Date.now() - 89999
      },
      {
        id: 'p_3',
        date: '10 7 2015',
        title: 'New Divide',
        artist: 'Linkin Park',
        genre: 'Rock',
        created_at: 7,
        song : {
          stream_url : "https://api.soundcloud.com/tracks/49931/stream",
          thumbnail_url : "https://upload.wikimedia.org/wikipedia/en/3/39/DJKaskade_Strobelite.jpg"
        },
        timestamp: Date.now() - 79999
      }
    ]
  }
}
var Profile = React.createClass({
  propTypes: {
    user: ReactPropTypes.object, //User model from api 
    onPostListItemClick: ReactPropTypes.func //Playability
  },
  /**
   * @return {object}
   */
  render: function() {
    var user = this.props.user;
    return (
      <div>
        <ProfileHeader
          userName={_dUser.name}
          userBio={_dUser.bio}
          userImg={_dUser.img}
          userTwitterLink={_dUser.twitterLink}
        />
        <div className="tf-profile-posts-wrapper"> 
          <UserPostGrid 
            upvotedTracks={_dUser.posts.upvoted} 
            postedTracks={_dUser.posts.posted}
            onPostItemClick={ function(){ console.log('WOW'); } }
          />
        </div>
      </div>
    );
  },


});

module.exports = Profile;