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
        currentUserId: ReactPropTypes.number
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
        
        if(!this.props.currUser || this.props.userId !== this.props.currentUserId) {
            showEditLink = false;
            followBtnStyle.display = 'block';
        }
        console.log("FOILLOW STYLE", followBtnStyle, this.props.currentUserId, this.props.userId);
        return ( 
            <div className = "tf-profile-wrapper" style={styleDisplay}>
                <ProfileBar toggleProfileEdit = {this.props.toggleProfileEdit} showEditLink = {showEditLink} />
                <div className="row col-md-12 col-sm-12 col-xs-12">
                    <div className="col-md-4 col-xs-4 col-sm-3">
                    </div>
                    <div className="col-md-4 col-xs-6 col-sm-7 tf-profile-info-wrapper">
                        <div className="col-md-4 col-xs-4 col-sm-4 tf-profile-img-wrapper" >
                            <img src = {this.props.userImg} className = "tf-profile-image"> </img>
                        </div>
                        <div className="col-md-8 col-xs-8 col-sm-8">                    
                            <h1 className = "row tf-name" > {this.props.userName} </h1>
                            <div className = "row tf-bio" > {this.props.userBio}</div>
                            
                            <div className = "row tf-social-icons" >
                                <span>
                                    <div className="tf-btn-follow btn btn-primary col-md-6" onClick={this.follow_click} style={followBtnStyle}>{follow_text}</div>
                                    <div className="col-md-6">
                                        <a href = {this.props.userScloudLink} target = "_blank" >
                                            <img src="https://cdn2.iconfinder.com/data/icons/minimalism/512/soundcloud.png"></img>
                                        </a>
                                        <a href = {this.props.userTwitterLink} target = "_blank" >
                                            <img src = "../assets/img/twitter_share.svg"> </img> 
                                        </a>
                                    </div>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-xs-2 col-sm-2">
                    </div>                    
                </div>
            </div>
        );
    },

});
module.exports = ProfileHeader;