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

var styleDisplay = {
    display: 'none'
};

var followBtnStyle = {
    display: 'none'
};

var ProfileHeader = React.createClass({

    propTypes: {
        userId: ReactPropTypes.number,
        userName: ReactPropTypes.string,
        userTwitterLink: ReactPropTypes.string,
        userBio: ReactPropTypes.string,
        userFacebookLink: ReactPropTypes.string,
        userScloudLink:  ReactPropTypes.string,
        userImg: ReactPropTypes.string,
        isVisible:  ReactPropTypes.bool,
        toggleProfileEdit: ReactPropTypes.func,
        onUserFollowClick: ReactPropTypes.func,
        onUnFollowClick: ReactPropTypes.func,
        isFollowing: ReactPropTypes.bool,
        currentUserId: ReactPropTypes.number,
        isUserVerified: ReactPropTypes.bool
    },

    getInitialState: function() {
        return {
            isVisible: this.props.isVisible,
            isFollowing: this.props.isFollowing
        };
    },

    componentDidMount: function() {
        //console.log(this.props);
    },

    follow_click: function() {
        if(!this.props.currUser) {
            $(document).trigger("ReactComponent:TrakfireApp:showModal");
        } 
        else {
            if(this.state.isFollowing === true) {
                this.props.onUnFollowClick();
            } else {
                this.props.onUserFollowClick();            
            }
            this.setState({
                isFollowing: !this.state.isFollowing
            });
        }  
    },

    openEditProfile: function() {
        this.props.toggleProfileEdit(true);
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

        if(this.state.isFollowing === true) {
            var follow_text = "Following";
            followBtnStyle.backgroundColor = "#ff0d60";
        } else {
            var follow_text = "Follow";
            followBtnStyle.backgroundColor = "#1C1C1C";
        }
        var showEditLink = true;        
        followBtnStyle.display = 'none';
        var editLink = <div></div>;
        if(this.props.userId == this.props.currentUserId) {
            showEditLink = false;
            followBtnStyle.display = 'block';            
            editLink = <a onClick={this.openEditProfile}><div className="is-active right btn btn-primary">Edit</div></a>;
        }
        console.log("FOILLOW STYLE", followBtnStyle, this.props.currentUserId, this.props.userId);
        var headerStyle = {"padding" : 100 + 'px'};

        if( this.props.isUserVerified !== null && this.props.isUserVerified !== false ) {
            var verifiedIcon =  <img className="tf-verified-symbol" src={"assets/img/Twitter-Verified.png"}></img>;
        } else {
            var verifiedIcon = "";
        }

        return ( 
                <div className="profile-header text-center tf-background" style={headerStyle}>
                  <div className="container">
                    <div className="container-inner">
                      <img className="img-circle media-object" src={this.props.userImg}></img>
                        {editLink}
                    </div>
                      <div >
                      <h3 className="profile-header-user">{this.props.userName}&nbsp;&nbsp;{verifiedIcon}
                        
                      </h3>
                      <p className="profile-header-bio">
                        {this.props.userBio}
                      </p>
                    </div>
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

});
module.exports = ProfileHeader;