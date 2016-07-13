/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var ProfileBar = require('./ProfileBar.jsx');
var UserActions = require('../actions/UserActions.js');
var UserStore = require('../stores/UserStore.js');
var styleDisplay = {
    display: 'none'
};

var followBtnStyle = {
    display: 'none',
    marginLeft: -15,
    marginRight: 15
};

var ProfileHeader = React.createClass({

    propTypes: {
        userId: ReactPropTypes.number,
        userName: ReactPropTypes.string,
        userTwitterLink: ReactPropTypes.string,
        userBio: ReactPropTypes.string,
        userFacebookLink: ReactPropTypes.string,
        userScloudLink:  ReactPropTypes.string,
        userOriginalImg: ReactPropTypes.string,
        isVisible:  ReactPropTypes.bool,
        toggleProfileEdit: ReactPropTypes.func,
        onUserFollowClick: ReactPropTypes.func,
        onUnFollowClick: ReactPropTypes.func,
        isFollowing: ReactPropTypes.bool,
        currUser: ReactPropTypes.object,
        isUserVerified: ReactPropTypes.bool,
        user_follow_count: ReactPropTypes.number,
        user_following_count: ReactPropTypes.number,
        showModal: ReactPropTypes.func
    },

    getInitialState: function() {
        return {
            isVisible: this.props ? this.props.isVisible : false,
            isFollowing: this.props ? this.props.isFollowing : false,
            isBot: UserStore.isBot()
        };
    },

    componentDidMount: function() {
        //console.log(this.props);
        UserStore.addChangeListener(this._onChange);
    },

    follow_click: function() {
        if(!this.props.currUser) {
            $(document).trigger("ReactComponent:TrakfireApp:showModal");
        } else {
            if(this.state.isFollowing === true) {
                this.props.onUnFollowClick();
            } else {
                this.props.onUserFollowClick();
            }
        }
    },

    openEditProfile: function() {
        this.props.toggleProfileEdit(true);
    },

    showFollowers: function() {
        this.props.showModal("followers");
    },

    showFollowings: function() {
        this.props.showModal("followings");
    },

    renderSocialLinks: function() {
        return
        ( <div className = "row tf-social-icons" >
            <a className="tf-share-link" href = {this.props.userScloudLink} target = "_blank" >
                <img src="http://d1zb20amprz33r.cloudfront.net/tf-soundcloud-icon.png" width="100"></img>
            </a>
            <a className="tf-share-link" href = {this.props.userTwitterLink} target = "_blank" >
                <img src = "../assets/img/twitter_share.svg"> </img>
            </a>
        </div>);
    },

    /**
     * @return {object}
     */
    render: function() {
        if(this.props.isVisible === true ){
            styleDisplay.display = 'block';
        } else {
            styleDisplay.display = 'none';
        }


        var showEditLink = true;
        followBtnStyle.display = 'none';
        var editLink = <a onClick={this.openEditProfile}><div className="is-active right btn btn-primary">Edit</div></a>;
        console.log("IN PROF HEADER ", this.props.currUser, this.props.userId);
        if(this.props.currUser == null || this.props.userId !== this.props.currUser.id) {
            showEditLink = false;
            followBtnStyle.display = 'block';
            editLink = "";
        }

        if( this.state.isFollowing === true ) {
            var follow_text = "Following";
            followBtnStyle.backgroundColor = "#ff0d60";
        } else {
            var follow_text = "Follow";
            followBtnStyle.backgroundColor = "#1C1C1C";
        }

        var headerStyle = {"padding" : 100 + 'px'};

        if( this.props.isUserVerified !== null && this.props.isUserVerified !== false ) {
            var verifiedIcon =  <img className="tf-verified-symbol" src={"http://d1zb20amprz33r.cloudfront.net/verified.png"}></img>;
        } else {
            var verifiedIcon = "";
        }

        return (
            <div className="profile-header tf-profile-wrapper text-center tf-background">
                <div className="container">
                    <div className="col-xs-3"></div>
                    <div className="col-xs-4 tf-profile-info-wrapper">
                        <div className="col-xs-4 tf-profile-img-wrapper" >
                            <img src = {this.props.userOriginalImg} className = "tf-profile-image"></img>
                        </div>

                        <div className="col-xs-4">
                            <h3 className = "row tf-name" > {this.props.userName}&nbsp;&nbsp;{verifiedIcon}</h3>
                            <h4 className = "row tf-bio" > {this.props.userBio} </h4>
                            <div className="tf-btn-follow btn btn-primary" onClick={this.follow_click} style={followBtnStyle}>{follow_text}</div>
                            { !this.state.isBot ? this.renderSocialLinks() : "" }

                                 <a href="#" onClick={this.showFollowers} className="no-decor tf-followers">{this.props.user_follow_count} Followers </a>
                                 <a href="#" onClick={this.showFollowings} className="no-decor tf-followers">{this.props.user_following_count} Following </a>
      
                        </div>
                    </div>
                    <div className="tf-btn">
                        {editLink}
                    </div>
                    <div className="col-xs-3"></div>
                </div>

                <nav className="profile-header-nav">
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <a href="#upvoted" data-toggle="tab">Upvotes</a>
                        </li>
                        <li>
                            <a href="#posted" data-toggle="tab">Posts</a>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    },

    _onChange: function() {
        this.setState({
            isVisible: this.props.isVisible,
            isFollowing: this.props.isFollowing
        });
    }
});
module.exports = ProfileHeader;
