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

function compareCreatedAt(a, b) {
  if(a.created_at < b.created_at) return 1;
  else if(a.created_at > b.created_at) return -1;
  return 0;
}

var PostComment = React.createClass({
	propTypes: {
        comment: ReactPropTypes.object,
        origin: ReactPropTypes.string,
        post_id: ReactPropTypes.number,
        currUser: ReactPropTypes.object
    },

	getInitialState: function() {
        return {
            comment : this.props.comment,
            post_id : this.props.post_id
        };
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

    renderCommentReplyInput: function() {
    	var self = this;
		var comment_id = self.props.comment.id;		

		React.render(
					<CommentReplyInput 
						comment = {this.props.comment}
						origin = {this.props.origin}
						post_id = {this.props.post_id} 
						currUser = {this.props.currUser} />,
	       			document.getElementById("comment-reply-input-" + comment_id)
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

    render: function() {
    	var comment = this.props.comment;

		return (
			<div className="col-md-12 tf-parent-comment-profile">
				<div className = "row tf-comment-profile col-md-12">
					<div className="col-md-0 tf-comment-auther-panel left">
						<a className="tf-link" href={"/profile/"+comment.user.id} >
							<img className="tf-author-img" src={comment.user.img} />
						</a>
					</div>	
					<div className="col-md-8">
						<a className="tf-profile-link"> {comment.user.username}</a> - Trakfire Founder.
					</div>				
					<div className="col-md-3 tf-comment-time right">
						<span className="tf-reply-btn" onClick = {this.renderCommentReplyInput}>
							<img ref="replyBtn" src="../assets/img/reply-comment-icon.png"></img>
						</span>						
						<span className="">{moment(comment.created_at).fromNow()}</span>
					</div>
				</div>
				
				<div className="row tf-comment-text col-md-12">					
					<div className="tf-comment-detail">{comment.comment_detail}</div>
				</div>				

				<div id = {"comment-reply-container-" + comment.id} className={"tf-comment-reply-container"}>
					<div id={"comment-reply-input-" + comment.id} className="reply-comment-input-box col-md-12">
						
					</div>
					{this.renderCommentReplies(comment)}
				</div>			
			</div>
		);
    }
});

module.exports = PostComment;