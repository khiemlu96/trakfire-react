var React = require('react');
var ReactPropTypes = React.PropTypes;
var UserActions = require('../actions/UserActions.js');
var UserStore = require('../stores/UserStore.js');
var UserPostList = require('./UserPostList.jsx');
var ProfileHeader = require('./ProfileHeader.jsx');
var ProfileEditPage = require('./ProfileEditPage.jsx');
var NProgress = require('nprogress-npm');

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
            var initailStates = getAppState();
            
            // If the user is not null and previous user value stored in Dispatcher
            // is not same as new user, then set to null
            //console.log("FINDING THE USER", this.props.params.id, initailStates.user);
            if( initailStates.user && (initailStates.user.id !== parseInt(this.props.params.id)) ) {
                //console.log("USERSBRUH", initailStates.user);
                initailStates.user = null;
            }

            return initailStates;
        },

        componentDidMount: function() {
            UserStore.addChangeListener(this._onChange);
            console.log("Mounting");
            var userid = this.props.params.id;
            this.getUser(userid);
            var user = this.state.user;
            console.log("USER", user, "USERID", userid);
            this.setState({userid:userid});
            if (user) {
                mixpanel.identify(userid);
                mixpanel.track("Arrived on profile " + user.handle + "'s page {" + userid + "}");
            }
            window.scrollTo(0,0);
        },

        componentWillUnmount: function() {
            UserStore.removeChangeListener(this._onChange);
        },

        getUser: function(userid) {
            NProgress.start();
            console.log("GETTING THE USER");
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

        componentWillReceiveProps: function(nextProps) {            
            var user = this.state.user;
            // Atfer changing props param's id value,
            // Get the new user object from user ids
            if( user !== null && parseInt(nextProps.params.id) !== user.id ) {
                this.getUser(parseInt(nextProps.params.id));
            }
        },

        shouldComponentUpdate: function(nextProps, nextState) {
            var user = this.state.user;
            if( user !== null && parseInt(nextProps.params.id) !== user.id ) {
                return false;
            }
            return true;
        },

        upvote: function(postid) {
            console.log("in post page upvote");
            this.props.upvote(postid);
            //PostActions.upvote(this.props.origin+'/votes', postid);
        },
        /**
         * @return {object}
         */
        render: function() {
            //console.log("USER TO RENDER", this.state.user)
            var user = this.state.user;
            var isFollowing = false;
            var isLoggedIn = UserStore.isSignedIn();

            if(user !== null) {
                for(var key in user.followers) {
                    if(this.props.currUser && user.followers[key].id === this.props.currUser.id) {
                        isFollowing = true;                        
                    }
                }
            }

            if(!user) { NProgress.start(); return (<div></div>); }
            if(user)
                var scloudurl =  "https://soundcloud.com/" + user.handle;            

            // Get the follower and following count of an user
            if( user !== null && user !== undefined) {
                var follow_count = user.followers.length ? user.followers.length : 0;
                var following_count = user.followings.length ? user.followings.length : 0;
            }

            return (
                <div>                    
                    <ProfileHeader
                        userId={user.id}
                        userName={user.name}
                        userBio={user.bio}
                        userOriginalImg={user.original_profile_img}
                        userTwitterLink={user.twturl}
                        userScloudLink = {scloudurl}
                        isVisible = {!this.state.showEditProfileWrapper}
                        toggleProfileEdit={this.toggleProfileEdit} 
                        onUserFollowClick={this.followUser}
                        onUnFollowClick={this.unFollowUser}
                        isFollowing={isFollowing}
                        currUser={this.props.currUser}
                        isUserVerified={user.isVerified} 
                        user_follow_count = {follow_count}
                        user_following_count = {following_count} />                    
                    
                    <ProfileEditPage
                        user= {user} 
                        isVisible = {this.state.showEditProfileWrapper} 
                        toggleProfileEdit= {this.toggleProfileEdit} 
                        origin= {this.props.origin} />

                   <UserPostList                        
                        onPostItemClick={this.props.onPostItemClick}
                        currStreamUrl={this.props.currStreamUrl}   
                        user= {user} 
                        origin={this.props.origin}
                        isLoggedIn={isLoggedIn}
                        upvote = {this.upvote} />
                </div>
            );
        },

        _onChange: function() {
            this.setState(getAppState());
        }
    });

    module.exports = ProfilePage;