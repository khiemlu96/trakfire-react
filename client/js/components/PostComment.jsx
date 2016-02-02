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
var moment = require('moment');
var PostActions = require('../actions/PostActions.js');
var CommentReplyInput = require('./CommentReplyInput.jsx');
var CommentInput = require('./CommentInput.jsx');
var PostStore = require('../stores/PostStore.js');
var UserStore = require('../stores/UserStore.js');
var post_id;

function compareCreatedAt(a, b) {
  if(a.created_at < b.created_at) return 1;
  else if(a.created_at > b.created_at) return -1;
  return 0;
}

function getLength(arr) {
	var count = 0;
	for(key in arr){
		count++;
	}
	return count;
}

function getAppState() {
	return {
		currUser: UserStore.getCurrentUser(),
	};
}

var PostComment = React.createClass({
	propTypes: {
        origin: ReactPropTypes.string,
        post_id: ReactPropTypes.number,
        currUser: ReactPropTypes.object,
        post: ReactPropTypes.object
    },

	getInitialState: function() {
        return getAppState();
    },

  	componentDidMount: function() {
		PostStore.addChangeListener(this._onChange);
		React.render(
			<CommentInput origin={this.props.origin} post_id = {this.props.post_id} />,
			document.getElementById("comment-input-container")
		);
  	},

    renderSingleComment: function(comment) {
		return (
			<div className="col-md-12 tf-parent-comment-profile" id = {comment.id}>
				<div className = "row tf-comment-profile col-md-12">
					<div className="col-md-0 tf-comment-auther-panel left">
						<a className="tf-link" href={"/profile/" + comment.user.id} >
							<img className="tf-author-img" src={comment.user.img} />
						</a>
					</div>	
					<div className="col-md-8">
						<a className="tf-profile-link"> {comment.user.username}</a> 
						<span className="tf-user-tbio"> - Trakfire Founder. </span>
					</div>				
					<div className="col-md-3 tf-comment-time right">
						<span className="tf-reply-btn" id={"reply-btn-" + comment.id} onClick = {this.renderCommentReplyInput}>
							<img ref="replyBtn" src="../assets/img/reply-comment-icon.png"></img>
						</span>						
						<span className="">{moment(comment.created_at).fromNow()}</span>
					</div>
				</div>
				
				<div className="row tf-comment-text col-md-12">					
					<div className="tf-comment-detail">{comment.comment_detail}</div>
				</div>				

				<div id = {"comment-reply-container-" + comment.id} className="tf-comment-reply-container">
					<div id={"comment-reply-input-" + comment.id} className="reply-comment-input-box col-md-12">
						
					</div>
					{this.renderCommentReplies(comment)}
				</div>			
			</div>
		);
    },

	renderCommentReplyInput: function(event) {
		var id = event.target.parentNode.id;
		var comment_id = parseInt(id.substring("reply-btn-".length));
		var comment = {};
		var comments = this.props.post.comments;
		for(key in comments) {
			if(comment_id === comments[key].id) {
				comment = comments[key];
			}
		}

		React.unmountComponentAtNode(document.getElementById('comment-input-container'));
		
		React.render(
			<CommentReplyInput 
				origin={this.props.origin} 
				comment={comment} 
				currUser = {this.props.currUser}
    			post_id={this.props.post_id} />, 
			document.getElementById("comment-input-container")
		);
	},
    
    renderCommentReplies: function(comment) {
    	var replies = comment.replies;

    	if(replies !== undefined){
	      replies = replies.sort(compareCreatedAt); //sort dates in decending order
	    }

    	var replyHtml = [];
    	for(key in replies) {
    		replyHtml.push(this.renderSingleReply(replies[key]));
    	}
    	return replyHtml;
    },

    renderSingleReply: function(reply) {
    	return (
    		<div className="col-md-12 tf-reply-comment-profile">
				<div className = "row tf-comment-profile col-md-12">
					<div className="col-md-0 tf-comment-auther-panel left">
						<a className="tf-link" href={"/profile/"+reply.user.id} >
							<img className="tf-author-img" src={reply.user.img} />
						</a>
					</div>	
					<div className="col-md-8">
						<a className="tf-profile-link"> {reply.user.username}</a> - Trakfire Founder.
					</div>				
					<div className="col-md-3 tf-comment-time right">					
						<span className="">{moment(reply.created_at).fromNow()}</span>
					</div>
				</div>
				
				<div className="row tf-comment-text col-md-12">					
					<div className="tf-comment-detail">{reply.comment_detail}</div>
				</div>		
			</div>
    	);
    },

    render: function() {
    	post_id = this.props.post.id;
    	var comments = this.props.post.comments;
		var commentHtml = [];
		console.log("In render----------------");
		if( comments !== undefined && getLength(comments) > 0 ) {
			comments = comments.sort(compareCreatedAt);
			for(key in comments) {
				commentHtml.push(this.renderSingleComment(comments[key]));
			}
		}

		return (
			<div className='tf-current-trak-comment-panel container'>
				<div className="tf-current-trak-inner col-md-12">
					<div id="comment-input-container">
					</div>
					<div className="tf-comment-list-panel col-md-12">
						{commentHtml}
					</div>
				</div>  
			</div>);		
    },

	_onChange: function() {
		this.setState(getAppState());
	}
});

module.exports = PostComment;