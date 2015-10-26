var React = require('react');
var ReactPropTypes = React.PropTypes;
var UserStore = require('../stores/UserStore.js');
var UserPostGrid = require('./UserPostGrid.jsx');
var ProfileHeader = require('./ProfileHeader.jsx');
var ProfileBar = require('./ProfileBar.jsx');

function getAppState() {
  return {
    user: UserStore.getCurrentUser()
  };
}
var ProfilePage = React.createClass({

  propTypes : {
    onPostItemClick: ReactPropTypes.func, //Playability
    currStreamUrl: ReactPropTypes.string
  }, 

  getInitialState: function() {
    return getAppState();
  }, 

  componentDidMount: function() {
    mixpanel.track("Arrived on profile page");
  },

  onPostListItemClick:function(pid) {
    this.props.onPostItemClick(pid);
  },
  /**
   * @return {object}
   */
  render: function() {
    console.log("USER TO RENDER", this.state.user)
    var user = this.state.user;
    return (
      <div>
      <ProfileBar/>
      <ProfileHeader
        userName={user.name}
        userBio={user.bio}
        userImg={user.img}
        userTwitterLink={user.twturl}
      />
      <div className="tf-profile-posts-wrapper"> 
        <UserPostGrid 
          upvotedTracks={user.posts} 
          postedTracks={user.posts}
          onPostItemClick={this.props.onPostItemClick}
          currStreamUrl={this.props.currStreamUrl}
        />
      </div>
      </div>
    );
  },


});

module.exports = ProfilePage;
