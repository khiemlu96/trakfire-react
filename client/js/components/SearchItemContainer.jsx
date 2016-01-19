/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var Router = require('react-router');
var Bootstrap = require('react-bootstrap');
var ReactPropTypes = React.PropTypes;
var Link = Router.Link;

var isUpvoted = "tf-post-item--votes is-upvoted";
var isNotUpvoted = "tf-post-item--votes";
var localVoteCount = 0; 

var isPlaying = "tf-post-grid is-playing";
var isNotPlaying = "tf-post-grid";

var SearchContentStyle = {
	border: '1px solid #2b2b2b'
};

var SearchItemContainer = React.createClass({

    propTypes: {
        post: ReactPropTypes.object,
        isUpvoted: ReactPropTypes.bool,
        currStreamUrl: ReactPropTypes.string,
        onPlayBtnClick: ReactPropTypes.func
    },

    getInitialState: function() {
        return {
            post : this.props.post,
            isPlaying:false,
            isUpvoted:false,
            hasUpvoted:false
        };
    },

    renderTags: function() {
        t = this.props.post.tags;

        for(tag in t) {
            var tag = <div className="tf-tag tf-uppercase"> {t[tag].name} </div> 
            tags.push(tag);
        }

        return tags;
    },
    
    playPauseTrack: function(e) {
        e.preventDefault();
        console.log(this.props.post);
        this.props.onPlayBtnClick(this.props.post.stream_url, this.props.post);
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

    /**
     * @return {object}
     */
    render: function() {
    	var post = this.props.post;
	    var upvoted = (this.state.isUpvoted || this.props.isUpvoted || this.state.hasUpvoted);
    	var localUpvote = this.state.hasUpvoted; 
		_localVoteCount = post.vote_count;

        return (
        	<li>
                <div className="col-xs-12 col-md-4 col-sm-6">
                    <div className="tf-search-item-content" style={SearchContentStyle}>
                    	<div className="tf-post-item--votes is-upvoted" ref="upvotes">
                    		<span>
                                <b>&#9650;</b>
                            </span>
                            <br/>
                            <span ref="count">
                    			<b>{upvoted ? _localVoteCount : post.vote_count}</b>
                    		</span>
                    	</div>
                        <div className="col-sm-6 tf-post-item--img">
                            <a href = "#!" className = "tf-post-play" onClick = {this.props.playPauseTrack}>
                        	   <img className="tf-search-item-img" src={ post.img_url ? post.img_url : "../assets/img/tf_placeholder.png" }/>
                            </a>
                            <div className = "tf-overlay" onClick = {this.props.playPauseTrack}>
                            </div>  
                            <div className = "tpf-play-button" onClick = {this.props.playPauseTrack}>
                                <img src = {'../assets/img/player-play-white.svg'}/>  
                            </div>  
                            <div className = "tpf-pause-button" onClick = {this.props.playPauseTrack}>
                                 <img src = {'../assets/img/player-pause-white.svg'}/>  
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="row tf-post-item--info">
								<h5> { post.title } </h5>
								<small> {post.artist } </small>
                            </div>
                        </div>
                        <div className="tf-search-item-auth-img" ref="author_img">
                    		<span className="" ref="author_img">
                    			<img className="author_img" src={ post.author_img ? post.author_img : "../assets/img/tf_placeholder.png" }/>
                    		</span>
                    	</div> 
                        <div className="tf-post-item--tags">
                            {this.renderTags()}
                        </div>                      
                    </div>                        
                </div>    
           </li>                           
        );
    }
});

module.exports = SearchItemContainer;