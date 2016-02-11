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
var PostActions = require('../actions/PostActions.js');
var CommentInput = require('./CommentInput.jsx');
var tagged_members = [];
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

var CommentReplyInput = React.createClass({
	
	propTypes: {
        comment: ReactPropTypes.object,
        origin: ReactPropTypes.string,
        post_id: ReactPropTypes.number,
        currUser: ReactPropTypes.object
    },

	getInitialState: function() {
		var self = this;
		self.tagged_members = [];	
        return {
        	reply_text: '',
            comment : this.props.comment,
            post_id : this.props.post_id
        };
    },

	onChange: function(event) {
        var self = this;

        self.setState({
            reply_text : event.target.value
        });
    },

    shouldComponentUpdate: function(nextProps){
        return nextProps.reply_text !== this.refs.comment.getDOMNode().innerHTML;
    },

    emitChange: function(event){
		this.setState({reply_text: event.target.innerHTML});
        this.lastHtml = this.state.reply_text;
    },

    handleChange: function(event){
	    this.setState({reply_text: event.target.innerHTML});
	},

	postCommentReply: function() {
		var self = this;
		var comment_id = self.props.comment.id;
		var postid = self.props.post_id;
		
		var comment_text = convertHtmlToText(self.state.reply_text.trim());
		var data = {};

		if(comment_text !== "") {
		  	data['comment'] = {};
			data['comment']['post_id'] = postid;
			data['comment']['parent_id'] = comment_id;
			data['comment']['comment_detail'] = comment_text;
			data['comment']['tagged_members'] = self.tagged_members;
			PostActions.postComment(self.props.origin + '/comments', data);

			self.setState({
				reply_text : ''
			});

		  	React.unmountComponentAtNode(document.getElementById('comment-input-container'));
			React.render(
				<CommentInput origin={this.props.origin} post_id = {this.props.post_id} />,
				document.getElementById("comment-input-container")
			);
		}
	},

	render: function() {
		var self = this;

		var comment_user = "@" + this.props.comment.user.username + " ";

		if( self.tagged_members.indexOf(this.props.comment.user.id) === -1 ) {
			self.tagged_members.push(this.props.comment.user.id);
		}

		var user_name = <span id = {"tag_user_" + this.props.comment.user.id}
							contentEditable = "false"
							className="tf-link">{comment_user}
						</span>;
		return (
			<div className="col-md-12 tf-comment-add">
				<div className="tf-comment-input-box">
                    <a href={"/profile/" + this.props.currUser.id} className="tf-link">
                      <img src={this.props.currUser.img} className="tf-author-img"> </img>
                    </a>
              	</div>
				{/*<input
						       		id = {"reply-comment-" + this.props.comment.id} 
						       		className="col-md-7" 
						       		type="text"
						       		placeholder="Reply a Comment..."
						       		value = {this.state.reply_text}
						       		onChange = {this.onChange}>
				       			</input>*/}
				   			
       			<div id = {"reply-comment-" + this.props.comment.id}
       				className="col-md-10 tf-comment-input"
					ref="comment"
        			onInput={this.emitChange} 
        			onBlur={this.emitChange}
        			contentEditable
        			onChange={this.handleChange}>
        				{user_name}<br/>
        		</div>
   				<div className="col-md-2 button tf-comment-reply-button" onClick = {this.postCommentReply}> Add Reply 
   				</div>
   			</div>
		);
	}
});

module.exports = CommentReplyInput;
