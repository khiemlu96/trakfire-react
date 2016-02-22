var React = require('react');
var ReactPropTypes = React.PropTypes;
var UserActions = require('../actions/UserActions.js');
var UserStore = require('../stores/UserStore.js');
var UserPostGrid = require('./UserPostGrid.jsx');
var ProfileHeader = require('./ProfileHeader.jsx');
var ProfileEditPage = require('./ProfileEditPage.jsx');


function getAppState() {
    return {
        user: UserStore.getUser(),
        showEditProfileWrapper: false,
        userid: null
    };
}

var ProfilePage = React.createClass({

        propTypes: {
            onPostItemClick: ReactPropTypes.func, //Playability
            currStreamUrl: ReactPropTypes.string,
            origin: ReactPropTypes.string,
            currUser: ReactPropTypes.object
        },

        getInitialState: function() {
            return getAppState();
        },
        componentDidMount: function() {
            UserStore.addChangeListener(this._onChange);
            var userid = this.props.params.id;
            this.setState({userid:userid});
            this.getUser(userid);
            var user = this.state.user;
            if (user) {
                mixpanel.identify(userid);
                mixpanel.track("Arrived on profile " + user.handle + "'s page {" + userid + "}");
            }
        },

        componentDidUnmount: function() {
            UserStore.removeChangeListener(this._onChange);
        },

        getUser: function(userid) {
            UserActions.getUser(this.props.origin + '/users/' + userid + '/', userid);
        },


        onPostListItemClick: function(pid) {
            this.props.onPostItemClick(pid);
        },

        toggleProfileEdit: function(flag) {
            this.setState({
                showEditProfileWrapper: flag
            });
        },

        followUser: function() {
            var follow_id = this.state.user.id;
            UserActions.followUser(this.props.origin+ '/follower', follow_id);
        },

        unFollowUser: function() {
            var follow_id = this.state.user.id;
            UserActions.unFollowUser(this.props.origin+ '/follower', follow_id);
        },   
        /**
         * @return {object}
         */
        render: function() {
            //console.log("USER TO RENDER", this.state.user)
            var user = this.state.user;
            var isFollowing = false;            
            
            if(user !== null) {
                for(var key in user.followers) {
                    if(user.followers[key].id === this.props.currUser.id) {
                        isFollowing = true;                        
                    }
                }
            }

            if(!user) { return (<div> Loading </div>); }
            return (
                <div>                   
                    
                    <ProfileHeader
                        userId={user.id}
                        userName={user.name}
                        userBio={user.bio}
                        userImg={user.img}
                        userTwitterLink={user.twturl}
                        isVisible= {!this.state.showEditProfileWrapper}
                        toggleProfileEdit={this.toggleProfileEdit} 
                        onUserFollowClick={this.followUser}
                        onUnFollowClick={this.unFollowUser}
                        isFollowing={isFollowing}
                        currentUserId={this.props.currUser.id} />                    
                    
                    <ProfileEditPage
                        user= {user} 
                        isVisible = {this.state.showEditProfileWrapper} 
                        toggleProfileEdit= {this.toggleProfileEdit} 
                        origin= {this.props.origin} />

                    <div className="tf-profile-posts-wrapper"> 
                        <UserPostGrid 
                        upvotedTracks={user.upvotes} 
                        postedTracks={user.posts}
                        onPostItemClick={this.props.onPostItemClick}
                        currStreamUrl={this.props.currStreamUrl} />                    
                    </div>
                </div>
            );
        },

        _onChange: function() {
            this.setState(getAppState());
        }
    });

    module.exports = ProfilePage;