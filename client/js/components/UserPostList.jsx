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
var PostListItem = require('./PostListItem.jsx');
var Link = require('react-router').Link;
var UserStore = require('../stores/UserStore.js');
var UserActions = require('../actions/UserActions.js');

var page_num_of_posted_tracks = 1, page_num_of_voted_tracks = 1;

var UserPostList = React.createClass({

    getInitialState: function() {
        return {
            postedTracks: UserStore.getUserPostedTraks(),
            upvotedTracks: UserStore.getUserUpvotedTraks(),
        };
    },

    propTypes: {        
        onPostItemClick: ReactPropTypes.func,
        user: ReactPropTypes.object,
        origin: ReactPropTypes.string
    },

    componentDidMount: function() {
        var data1 = {
            limit: 10,
            page: 1,
            action_type:'posted_trak'
        };
        var data2 = {
            limit: 10,
            page: 1,
            action_type:'upvoted_trak'
        };

        this.loadPostedTracks(data1, this.props.user.id);
        this.loadUpvotedTracks(data2, this.props.user.id);

        UserStore.addChangeListener(this._onChange);
    },

    loadMorePostedTracks: function() {
        page_num_of_posted_tracks++;
        var data = {
            limit: 10,
            page: page_num_of_posted_tracks,
            action_type:'posted_trak'
        };
        this.loadPostedTracks(data, this.props.user.id);
    },

    loadMoreUpvotedTracks: function() {
        page_num_of_voted_tracks++;
        var data = {
            limit: 10,
            page: page_num_of_voted_tracks,
            action_type:'upvoted_trak'
        };
        this.loadUpvotedTracks(data, this.props.user.id);
    },

    loadPostedTracks: function(data, user_id) {        
        UserActions.getUserPostedTraks(this.props.origin + "/users/" + user_id + "/posts", data);
    },

    loadUpvotedTracks: function(data, user_id) {        
        UserActions.getUserUpvotedTraks(this.props.origin + "/users/" + user_id + "/posts", data);
    },

    componentWillReceiveProps: function(nextProps) {            
        if(this.props.user.id !== nextProps.user.id) {
            // Check if the new user id is not equals to old user id,
            // then reset the posted and upvoted treks
            UserStore.resetPostedTraks();
            UserStore.resetUpvotedTraks();

            var data1 = {
                limit: 10,
                page: 1,
                action_type:'posted_trak'
            };
            var data2 = {
                limit: 10,
                page: 1,
                action_type:'upvoted_trak'
            };

            this.loadPostedTracks(data1, nextProps.user.id);
            this.loadUpvotedTracks(data2, nextProps.user.id);
        }
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        if(this.props.user.id !== nextProps.user.id) {
            return false;
        }
        return true;
    },

    /**
     * @return {object}
     */
    render: function() {
        var upvoted = this.state.upvotedTracks;
        var postedTracksStats = UserStore.getUserPostedTraksStats();
        var upvotedTracksStats = UserStore.getUserUpvotedTraksStats();

        var posted = this.state.postedTracks;
        var upvotedPosts = [];
        var postedPosts = [];
        
        var i = 0;        
        for (key in upvoted) {
            var post = upvoted[key];
            var item = <PostListItem onClick = {this.props.onPostItemClick}
                        key = {post.key}
                        trackIdx = {i}
                        post = {post}
                        currStreamUrl = {this.props.currStreamUrl}
                        showAuthor = {true}
                        showNumber = {false}
                        isLoggedIn={this.props.isLoggedIn}
                        onUpvote = {this.props.upvote} />
            
            upvotedPosts.push(item);
            i += 1;
        }

        i = 0;
        for (key in posted) {
            var post = posted[key];
            var item = <PostListItem onClick = {this.props.onPostItemClick}
                        key = {post.key}
                        trackIdx = {i}
                        post = {post}
                        currStreamUrl = {this.props.currStreamUrl}
                        showAuthor = {false}
                        showNumber = {false}
                        isLoggedIn={this.props.isLoggedIn}
                        onUpvote = {this.props.upvote} />

            postedPosts.push(item);
            i += 1;
        }

        var noPosts = <div className = "tf-no-posts">This user hasnt posted anything yet</div>;
        var noUpvotes = <div className = "tf-no-posts">This user hasnt upvoted anything yet</div>;

        upvotedPosts.length ? upvotedPosts : upvotedPosts = noUpvotes;
        postedPosts.length ? postedPosts : postedPosts = noPosts;

        if(postedTracksStats !== null && (postedPosts.length < postedTracksStats.total_count)) {
            var loadMorePostLinkHtml = <div className = "row tf-load-more-link">
                            <a className = "" onClick = {this.loadMorePostedTracks} > Load More... </a> 
                        </div>;
        } else {
            var loadMorePostLinkHtml = "";
        }

        if(upvotedTracksStats !== null && (upvotedPosts.length < upvotedTracksStats.total_count)) {
            var loadMoreUpvoteLinkHtml = <div className = "row tf-load-more-link">
                          <a className = "" onClick = {this.loadMoreUpvotedTracks}> Load More... </a> 
                        </div> 
        } else {
            var loadMoreUpvoteLinkHtml = "";
        }

        return ( 
            <div className = "tab-content">
                <div role = "tabpanel" className = "tab-pane" id = "posted">
                    <div className = "container p-t-md tf-background">
                        <div className = "row">
                            <div className = "col-md-8 col-md-offset-2">
                                <ul className = "media-list"> {postedPosts} </ul> 
                            </div> 
                        </div> 
                        {loadMorePostLinkHtml}
                    </div>
                </div>

                <div role = "tabpanel" className = "tab-pane active" id = "upvoted">
                    <div className = "container p-t-md tf-background">
                        <div className = "row">
                            <div className = "col-md-8 col-md-offset-2">
                                <ul className = "media-list"> {upvotedPosts} </ul> 
                            </div> 
                        </div> 
                        {loadMoreUpvoteLinkHtml}
                    </div> 
                </div>
            </div>
        );
    },

    _onChange: function() {
        this.setState({
            postedTracks: UserStore.getUserPostedTraks(),
            upvotedTracks: UserStore.getUserUpvotedTraks()
        });
    }
});

module.exports = UserPostList;