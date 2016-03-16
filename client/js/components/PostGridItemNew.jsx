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
var PostActions = require('../actions/PostActions');

var classNames = require('classnames');
var isPlaying = classNames("tf-post-grid is-playing");
var isNotPlaying = classNames("tf-post-grid");
var SearchContentStyle = {
    border: '1px solid #2b2b2b'
};

var PostGridItem = React.createClass({

    propTypes: {
        key: ReactPropTypes.string,
        post: ReactPropTypes.object,
        trackIdx: ReactPropTypes.number.isRequired,
        onClick: ReactPropTypes.func,
        currStreamUrl: ReactPropTypes.string,
        showAuthor: ReactPropTypes.bool
    },

    getInitialState: function() {
        return {
            isPlaying: false,
            isUpvoted: false,
            hasUpvoted: false
        };
    },

    upvote: function(e) {
        e.preventDefault();
        this.PostActions.upvote(this.props.key);
    },

    playPauseTrack: function(e) {
        e.preventDefault();
        console.log("CLICKING", this.props.post.stream_url, this.props.post, null);
        this.props.onClick(this.props.post.stream_url, this.props.post);
        if (!this.state.isPlaying) {
            //this.refs.post.className += " is-playing";
            this.setState({
                isPlaying: true
            });
            mixpanel.track("Track Play");
        } else {
            //this.refs.post.className = isNotPlaying;
            this.setState({
                isPlaying: false
            });
            mixpanel.track("Track Pause");
        }
    },
    
    renderTags: function() {
        t = this.props.post.tags;
        var tags = [];
        for(tag in t) {
            var tag = <div className="tf-tag tf-uppercase"> {t[tag].name} </div> 
            tags.push(tag);
            if(tags.length > 3){
                break;
            }
        }

        return tags;
    },
    /**
     * @return {object}
     */
    render: function() {
        var post = this.props.post;
        var thisPlaying = (this.props.currStreamUrl == null || this.props.currStreamUrl == this.props.post.stream_url);
        if(this.props.showAuthor) {
            var authorImg = <div className="tf-search-item-auth-img" ref="author_img">
                                <span className="" ref="author_img">
                                    <img className="author_img" src={ post.author_img ? post.author_img : "../assets/img/tf_placeholder.png" }/>
                                </span>
                            </div>
        }
        else { var authorImg = ''; }

        return ( 
            <li className = {(this.state.isPlaying && thisPlaying) ? isPlaying: isNotPlaying} ref = "post">
                <div className="col-xs-12 col-md-4 col-sm-6">
                    <div className="tf-search-item-content" style={SearchContentStyle}>
                        <div className="tf-post-item--votes is-upvoted" ref="upvotes">
                            <span>
                                <b>&#9650;</b>
                            </span>
                            <br/>
                            <span ref="count">
                                <b>{post.vote_count}</b>
                            </span>
                        </div>
                        <div className = "col-md-6 tf-post-item--img">
                            <a href = "#!" className = "tf-post-play" onClick = {this.playPauseTrack}>
                                <img className = "tf-thumbnail tf-search-item-img" src = { post.img_url ? post.img_url : "../assets/img/tf_placeholder.png" }/> 
                            </a> 
                            <div className = "tf-overlay" onClick = {this.playPauseTrack}>
                            </div>  
                            <div className = "tpf-play-button" onClick = {this.playPauseTrack}>
                                <img src = {'../assets/img/player-play-white.svg'}/>  
                            </div>  
                            <div className = "tpf-pause-button" onClick = {this.playPauseTrack}>
                                 <img src = {'../assets/img/player-pause-white.svg'}/>  
                            </div> 
                        </div>

                        <div className="col-md-6">
                            <div className="row tf-post-item--info">
                                <h5> { post.title } </h5>
                                <small> {post.artist } </small>
                            </div>                            
                        </div>
                        { authorImg }
                        <div className="tf-post-item--tags">
                            {this.renderTags()}
                        </div>                      
                    </div>                        
                </div>    
           </li>
        );
    }

});

module.exports = PostGridItem;