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

var CommentReplyInput = React.createClass({
	
	propTypes: {
        comment: ReactPropTypes.object,
        origin: ReactPropTypes.string,
        post_id: ReactPropTypes.number,
        currUser: ReactPropTypes.object
    },

	getInitialState: function() {
		var self = this;
		var comment_user = "@" + self.props.comment.user.username + " "
        return {
        	reply_text: comment_user,
            comment : self.props.comment,
            post_id : self.props.post_id
        };
    },

	onChange: function(event) {
        var self = this;

        self.setState({
            reply_text : event.target.value
        });
    },

	postCommentReply: function() {
		var self = this;
		var comment_id = self.props.comment.id;
		var postid = self.props.post_id;
		
		var comment_text = self.state.reply_text.trim();
		var data = {};

		if(comment_text !== "") {
		  data['comment'] = {};
		  data['comment']['post_id'] = postid;
		  data['comment']['parent_id'] = comment_id;
		  data['comment']['comment_detail'] = comment_text;
		  PostActions.postComment(self.props.origin + '/comments', data);
		  
		  self.setState({
		  	reply_text : ''
		  });
		}
	},

	render: function() {
		return (
			<div className="col-sm-12 tf-comment-add">
				<div className="tf-comment-input-box">
                    <a href={"/profile/" + this.props.currUser.id} className="tf-link">
                      <img src={this.props.currUser.img} className="tf-author-img"> </img>
                    </a>
              	</div>				
				<input
		       		id = {"reply-comment-" + this.props.comment.id} 
		       		className="col-md-7" 
		       		type="text"
		       		placeholder="Reply a Comment..."
		       		value = {this.state.reply_text}
		       		onChange = {this.onChange}>
       			</input>
   				<div className="col-md-4 button tf-comment-reply-button" onClick = {this.postCommentReply}> Add Reply 
   				</div>
   			</div>
		);
	}
});

module.exports = CommentReplyInput;
