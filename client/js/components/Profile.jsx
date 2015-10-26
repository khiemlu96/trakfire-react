var React = require('react');
var PostActions = require('../actions/PostActions');
var UserPostGrid = require('./UserPostGrid.jsx');
var ProfileHeader = require('./ProfileHeader.jsx');
var ReactPropTypes = React.PropTypes;
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
          userName={user.name}
          userBio={user.bio}
          userImg={user.img}
          userTwitterLink={user.twitterLink}
        />
        <div className="tf-profile-posts-wrapper"> 
          <UserPostGrid 
            upvotedTracks={user.posts.posted} 
            postedTracks={user.posts.upvoted}
            onPostItemClick={ this.props.onPostListItemClick }
          />
        </div>
      </div>
    );
  },


});

module.exports = Profile;