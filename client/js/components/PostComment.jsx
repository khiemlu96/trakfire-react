/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactDOM = require('react-dom');
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
var UserFlyOver = require('./UserFlyOver.jsx');
var classNames = require('classnames');
var notLastReply = classNames("tf-comment-reply-vr-line");
var hasReply = classNames("tf-comment-reply-vr-line-first");

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

function convertHtmlToText(inputText) {
    var returnText = "" + inputText;

    //-- remove BR tags and replace them with line break
    returnText = returnText.replace(/<br>/gi, "\n");
    returnText = returnText.replace(/<br\s\/>/gi, "\n");
    returnText = returnText.replace(/<br\/>/gi, "\n");

    //-- remove P and A tags but preserve what's inside of them
    returnText = returnText.replace(/<p.*>/gi, "\n");
    returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

    //-- remove all inside SCRIPT and STYLE tags
    returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
    returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
    //-- remove all else
    returnText = returnText.replace(/<(?:.|\s)*?>/g, "");

    //-- get rid of more than 2 multiple line breaks:
    returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\n\n");

    //-- get rid of more than 2 spaces:
    returnText = returnText.replace(/ +(?= )/g,'');

    //-- get rid of html-encoded characters:
    returnText = returnText.replace(/&nbsp;/gi," ");
    returnText = returnText.replace(/&amp;/gi,"&");
    returnText = returnText.replace(/&quot;/gi,'"');
    returnText = returnText.replace(/&lt;/gi,'<');
    returnText = returnText.replace(/&gt;/gi,'>');

    //-- return
    return returnText;
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

	processTaggedMembers: function(comment, taggedMembers) {
		if(!comment && !taggedMembers)
			return comment;

		taggedMembers.forEach(function(taggedMember) {
  			var user = taggedMember;
  			var name = user.username;
  			var regex;
			var replace = "<a href = '/profile/" + user.id + "' class = 'tf-link'>" + user.username + "</a>";

			if( (comment.indexOf('@'+name) !== -1 ) || (comment.indexOf('@'+name) === 0 ) ){
				regex = new RegExp('@'+name,"gm");
				comment = comment.replace(regex, replace);
			} else {
				regex = new RegExp(name,"gm");
				comment = comment.replace(regex, replace);
			}
  		});

		comment = comment.replace(/(\r\n|\n|\r)/gm, '<br>');
		return comment;
	},

  	componentDidMount: function() {
		PostStore.addChangeListener(this._onChange);
		React.render(
			<CommentInput origin={this.props.origin} post_id = {this.props.post_id} />,
			document.getElementById("comment-input-container")
		);
  	},

    componentWillUnmount: function() {
      // Remove same function reference that was added
      PostStore.removeChangeListener(this._onChange);
    },

  	renderCommentText: function(comment) {
  		var comment_text = comment.comment_detail;
  		comment_text = this.processTaggedMembers(comment_text, comment.tagged_members);

  		return (comment_text);
  	},

    renderSingleComment: function(comment) {
    	var replies = comment.replies;
    	var vFirstLine = classNames("");

    	if(replies.length != 0){
    		vFirstLine = hasReply;
    	}

		return (
			<div className="col-md-12 tf-parent-comment-profile" id = {"comment_" + comment.id}>
				<div className = "tf-comment-profile col-md-12">
					<div className="col-md-0 tf-comment-auther-panel left">
						<UserFlyOver user = {comment.user} origin={this.props.origin} />
					</div>
					<div className="col-md-8 tf-user-profile-section">
						<a className="tf-profile-link"> {comment.user.username}</a>
						<span className="tf-user-tbio"> - {comment.user.bio} </span>
					</div>
					<div className="col-md-3 tf-comment-time right">
						<span className="tf-reply-btn" id={"reply-btn-" + comment.id} onClick = {this.renderCommentReplyInput}>
							<img ref="replyBtn" src="../assets/img/reply-comment-icon.png"></img>
						</span>
						<span className="">{moment(comment.created_at).fromNow()}</span>
					</div>
				</div>

				<div  id="comment-text" className="tf-comment-text col-md-12">
					<div className="tf-comment-detail"  dangerouslySetInnerHTML={{__html: this.renderCommentText(comment)}} />
					<div className={vFirstLine}></div>
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

		ReactDOM.unmountComponentAtNode(document.getElementById('comment-input-container'));

		ReactDOM.render(
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

		var length = replies.length;
    	var replyHtml = [];

    	for(key in replies) {
    		replyHtml.push(this.renderSingleReply(replies[key],key,length));
    	}

    	return replyHtml;
    },

    renderSingleReply: function(reply,key,length) {
    	var vLine = notLastReply;

        if(key == (length-1)){
    		vLine = classNames("");
        }

    	return (
    		<div className="col-md-12 tf-reply-comment-profile" id={"comment_"+ reply.id}>

				<div className = "tf-comment-profile col-md-12">
					<div className="tf-comment-reply-hr-line"></div>
					<div className="col-md-0 tf-comment-auther-panel left">
						<UserFlyOver user = {reply.user} origin={this.props.origin} />
					</div>
					<div className="col-md-8 tf-user-profile-section">
						<a className="tf-profile-link"> {reply.user.username}</a>
						<span className="tf-user-tbio"> {reply.user.bio} </span>
					</div>
					<div className="col-md-3 tf-comment-time right">
						<span className="">{moment(reply.created_at).fromNow()}</span>
					</div>
				</div>

				<div id="reply-comment-text" className="tf-comment-text col-md-12">
					<div className="tf-comment-detail" dangerouslySetInnerHTML={{__html: this.renderCommentText(reply)}} />
				</div>
				<div className={vLine}></div>
			</div>
    	);
    },

    render: function() {
    	post_id = this.props.post.id;
    	var comments = this.props.post.comments;
		var commentHtml = [];
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
