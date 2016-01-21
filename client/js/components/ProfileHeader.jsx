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

var ProfileHeader = React.createClass({

    propTypes: {
        userName: ReactPropTypes.string,
        userTwitterLink: ReactPropTypes.string,
        userBio: ReactPropTypes.string,
        userFacebookLink: ReactPropTypes.string,
        userImg: ReactPropTypes.string,
        isVisible:  ReactPropTypes.bool,
        toggleProfileEdit: ReactPropTypes.func,
        onUserFollowClick: ReactPropTypes.func,
        onUnFollowClick: ReactPropTypes.func
    },

    getInitialState: function() {
        return {
            isVisible: this.props.isVisible
        };
    },

    componentDidMount: function() {
        //console.log(this.props);
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

        return ( 
            <div className = "tf-profile-wrapper" style={styleDisplay}>
                <ProfileBar toggleProfileEdit = {this.props.toggleProfileEdit} showEditLink = {true} />
                <div className="row col-md-12 col-sm-12 col-xs-12">
                    <div className="col-md-4 col-xs-4 col-sm-3">
                    </div>
                    <div className="col-md-4 col-xs-6 col-sm-7 tf-profile-info-wrapper">
                        <div className="col-md-4 col-xs-4 col-sm-4 tf-profile-img-wrapper" >
                            <img src = {this.props.userImg} className = "tf-profile-image"> </img>
                        </div>
                        <div className="col-md-8 col-xs-8 col-sm-8">                    
                            <h1 className = "row tf-name" > {this.props.userName} </h1>
                            <div className = "row tf-bio" > {this.props.userBio} The user profile page should open when user clicks on user image on trak row</div>
                            
                            <div className = "row tf-social-icons" > { /*<img src="assets/img/facebook_share.svg"></img>*/ } 
                                <div className="tf-btn-follow btn btn-primary" onClick={this.props.onUserFollowClick}>Follow</div>
                                    <a href = {this.props.userTwitterLink} target = "_blank" >
                                        <img src="../assets/img/facebook_share.svg"></img>
                                    </a>
                                    <a href = {this.props.userTwitterLink} target = "_blank" >
                                        <img src = "../assets/img/twitter_share.svg"> </img> 
                                    </a> 
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