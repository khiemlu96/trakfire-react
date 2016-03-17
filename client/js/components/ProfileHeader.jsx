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
        var headerStyle = {"padding" : 100 + 'px'};
        return ( 
                <div className="profile-header text-center tf-background" style={headerStyle}>
                  <div className="container">
                    <div className="container-inner">
                      <img className="img-circle media-object" src="https://pbs.twimg.com/profile_images/647909428717449216/cMF2Qgxe.jpg"></img>
                      <div className="pull-right">
                      <h3 className="profile-header-user">Grant Collins</h3>
                      <p className="profile-header-bio">
                        This shit is 2 die 4.
                      </p>
                    </div>
                    </div>
                  </div>

                  <nav className="profile-header-nav">
                    <ul className="nav nav-tabs">
                      <li className="active">
                        <a href="#">Upvotes</a>
                      </li>
                      <li>
                        <a href="#">Posts</a>
                      </li>
                    </ul>
                  </nav>
                </div>
        );
    },

});
module.exports = ProfileHeader;