var React = require('react');
var ReactPropTypes = React.PropTypes;
var UserActions = require('../actions/UserActions.js');
var UserStore = require('../stores/UserStore.js');
var UserPostList = require('./UserPostList.jsx');
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
            var initailStates = getAppState();
            
            //If the user is not null and previous user value stored in Dispatcher
            // is not same as new user, then set to null
            if( initailStates.user && (initailStates.user.id !== parseInt(this.props.params.id)) ) {
                initailStates.user = null;
            }

            return initailStates;
        },
        componentDidMount: function() {
            UserStore.addChangeListener(this._onChange);
            var userid = this.props.params.id;
            this.getUser(userid);
            var user = this.state.user;
            this.setState({userid:userid, user:user});
            if (user) {
                mixpanel.identify(userid);
                mixpanel.track("Arrived on profile " + user.handle + "'s page {" + userid + "}");
            }
            window.scrollTo(0,0);
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
                    if(this.props.currUser && user.followers[key].id === this.props.currUser.id) {
                        isFollowing = true;                        
                    }
                }
            }

            if(!user) { return (<div className='tf-loader'> </div>); }

            var scloudurl =  "https://soundcloud.com/" + user.handle;
            
                
            return (
                <div>
                    
                    <ProfileHeader
                        userId={user.id}
                        userName={user.name}
                        userBio={user.bio}
                        userImg={user.img}
                        userTwitterLink={user.twturl}
                        userScloudLink = {scloudurl}
                        isVisible= {!this.state.showEditProfileWrapper}
                        toggleProfileEdit={this.toggleProfileEdit} 
                        onUserFollowClick={this.followUser}
                        onUnFollowClick={this.unFollowUser}
                        isFollowing={isFollowing}
                        currentUserId={this.props.currUser.id}
                        isUserVerified={user.isVerified} />                    
                    
                    <ProfileEditPage
                        user= {user} 
                        isVisible = {this.state.showEditProfileWrapper} 
                        toggleProfileEdit= {this.toggleProfileEdit} 
                        origin= {this.props.origin} />

                    <UserPostList                        
                        onPostItemClick={this.props.onPostItemClick}
                        currStreamUrl={this.props.currStreamUrl}   
                        user= {user} 
                        origin={this.props.origin} />
                </div>
            );
        },

        _onChange: function() {
            this.setState(getAppState());
        }
    });

    module.exports = ProfilePage;