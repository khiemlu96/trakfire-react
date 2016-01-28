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

var PostComment = React.createClass({
	propTypes: {
        comment: ReactPropTypes.object,
        origin: ReactPropTypes.string,
        post_id: ReactPropTypes.number
    },

	getInitialState: function() {
        return {
            comment : this.props.comment,
            post_id : this.props.post_id
        };
    },

    renderSingleReply: function(reply) {
    	return (
    		<div className="col-md-11 tf-reply-comment-profile">
				<div className = "row tf-comment-profile col-md-12">
					<div className="col-md-0 tf-comment-auther-panel left">
						<a className="tf-link" href={"/profile/"+reply.user.id} >
							<img className="tf-author-img" src={reply.user.img} />
						</a>
					</div>	
					<div className="col-md-9">
						<a className="tf-profile-link"> {reply.user.username}</a> - Trakfire Founder.
					</div>				
					<div className="col-md-2 tf-comment-time right">					
						<span className="">{moment(reply.created_at).fromNow()}</span>
					</div>
				</div>
				
				<div className="row tf-comment-text col-md-12">					
					<div className="tf-comment-detail">{reply.comment_detail}</div>
				</div>		
			</div>
    	);
    },

    renderCommentReplyInput: function(comment_id) {
	},

	postCommentReply: function() {
		var self = this;
		var comment_id = self.props.comment.id;
		var postid = self.props.post_id;
		
		var comment_text = self.refs.replyComment.getDOMNode().value.trim();
		var data = {};

		if(comment_text !== "") {
		  data['comment'] = {};
		  data['comment']['post_id'] = postid;
		  data['comment']['parent_id'] = comment_id;
		  data['comment']['comment_detail'] = comment_text;
		  PostActions.postComment(this.props.origin + '/comments', data);
		  self.refs.replyComment.getDOMNode().value = "";
		}
	},

    renderCommentReplies: function(comment) {
    	var replies = comment.replies;
    	var replyHtml = [];
    	for(key in replies) {
    		replyHtml.push(this.renderSingleReply(replies[key]));
    	}
    	return replyHtml;
    },

    render: function() {
    	var comment = this.state.comment;
		return (
			<div className="col-md-12 tf-parent-comment-profile">
				<div className = "row tf-comment-profile col-md-12">
					<div className="col-md-0 tf-comment-auther-panel left">
						<a className="tf-link" href={"/profile/"+comment.user.id} >
							<img className="tf-author-img" src={comment.user.img} />
						</a>
					</div>	
					<div className="col-md-9">
						<a className="tf-profile-link"> {comment.user.username}</a> - Trakfire Founder.
					</div>				
					<div className="col-md-2 tf-comment-time right">
						<span className="tf-reply-btn">
							<img ref="replyBtn" src="../assets/img/reply-comment-icon.png" onClick={this.renderCommentReplyInput(comment.id)}></img>
						</span>						
						<span className="">{moment(comment.created_at).fromNow()}</span>
					</div>
				</div>
				
				<div className="row tf-comment-text col-md-12">					
					<div className="tf-comment-detail">{comment.comment_detail}</div>
				</div>				

				<div id = {"comment-reply-container-" + comment.id} className={"tf-comment-reply-container-" + comment.id}>
					<div id={"comment-reply-input-" + comment.id} className="reply-comment-input-box">
						<input ref="commentReply" 
				       		id = {"reply-comment-" + comment.id} 
				       		className="tf-comment-reply-input" 
				       		type="text" 
				       		ref="replyComment"
				       		placeholder="Reply a Comment...">
		       			</input>
		       			<div className="button tf-comment-reply-button" onClick = {this.postCommentReply}> Add Reply </div>
					</div>
					{this.renderCommentReplies(comment)}
				</div>			
			</div>
		);
    }
});

module.exports = PostComment;