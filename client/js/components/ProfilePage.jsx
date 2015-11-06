var React = require('react');
var ReactPropTypes = React.PropTypes;
var UserActions = require('../actions/UserActions.js');
var UserStore = require('../stores/UserStore.js');
var UserPostGrid = require('./UserPostGrid.jsx');
var ProfileHeader = require('./ProfileHeader.jsx');
var ProfileBar = require('./ProfileBar.jsx');

function getAppState() {
  return {
    user: UserStore.getUser()
  };
}
var ProfilePage = React.createClass({

  propTypes : {
    onPostItemClick: ReactPropTypes.func, //Playability
    currStreamUrl: ReactPropTypes.string, 
    origin: ReactPropTypes.string
  }, 

  getInitialState: function() {
    return getAppState();
  }, 

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
    var userid = this.props.params.id;
    console.log("THE GIVEN USER ID IS ", userid);
    var user = this.getUser(userid);
    mixpanel.identify(userid);
    mixpanel.track("Arrived on profile "+user.handle+"'s page {"+userid+"}");
  },

  componentDidUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  }, 

  getUser: function(userid) {
    UserActions.getUser(this.props.origin+'/users/'+userid+'/', userid);
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
    if(!user) { return (<div> Loading </div>); }
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

  _onChange: function() {
    this.setState(getAppState());
  }

});

module.exports = ProfilePage;
