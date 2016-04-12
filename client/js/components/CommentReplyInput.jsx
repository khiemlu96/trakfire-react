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
var UserStore = require('../stores/UserStore.js');
var PostActions = require('../actions/PostActions.js');
var CommentInput = require('./CommentInput.jsx');
var Reqwest = require('reqwest');

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
            post_id : this.props.post_id,
            memberCollection: UserStore.getAllUsers()
        };
    },

    addUserTagginng: function() {
        var self = this;

        var memberData = $.map(self.state.memberCollection, function(value, i) {
            return {
                'id':i,
                'userId':value.id,
                'name':value.name,
                'email':value.email
            };
        });

        var at_config = {
            at: "@",
            data: memberData,
            headerTpl: '<div className="atwho-header">Member List<small>↑&nbsp;↓&nbsp;</small></div>',
            insertTpl: "<span member_id='${userId}' data-value='${name}' class='member'>${name}</span>",
            displayTpl: "<li data-value='${name}' member_id='${userId}'>${name}  (<small>${email}</small>)</li>",
            limit: 10,
            callbacks: {
                beforeInsert: function(value, $li, e) { 
                    var sn = $li[0].attributes["data-value"].value;
                    sn = sn.replace('@', '');
                    var mem_id = $li[0].attributes.member_id.value;
                    var user = {username: sn, user_id: mem_id};

                    self.tagged_members.push(user);

                    return value;
                },
                remoteFilter: function(params, callback) {                  
                    var passback = [];                  
                    var data = {
                        limit: 20,
                        search_key: params
                    };

                    var url = self.props.origin+'/users';
                    Reqwest({
                        url: url,
                        type: 'json',
                        method: 'GET',
                        data: data,
                        contentType: 'application/json',
                        headers: {'Authorization': localStorage.getItem('jwt')},
                        success: function(resp) { 
                            if(resp.users.length > 0 ) {
                                resp.users.forEach( function(user) {
                                    passback.push({
                                        'userId':user.id,
                                        'name':user.username,
                                        'email':user.email
                                    });
                                });
                                callback(passback);
                            }
                        },
                        error: function(error) {
                            console.error(url, error['response']);
                        }
                    });
                }
            }
        };

        $('#editable_reply').atwho(at_config);
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

    componentDidMount: function() {
        currUser = this.props.currUser;
        this.addUserTagginng();
    },

	postCommentReply: function() {
        var self = this;
        var comment_id = self.props.comment.id;
        var postid = this.props.post_id;

        var commentContent = self.refs.comment_reply.innerHTML.replace(/[<]br[^>]*[>]/gi,"\n");
        var comment_text = commentContent.replace(/\&nbsp;/g," ");
        comment_text = comment_text.replace(/<p>&nbsp;<\/p>/gi,'\n').replace(/<p>/gi,'').replace(/<\/p>/gi,'\n');

        var $stagingDiv = $('#edit-comment-reply-staging-div');

        //Replace user tags with text
        $stagingDiv.html(comment_text);
        $stagingDiv.find('.atwho-inserted').each(function(){
            $(this).replaceWith('@' + $(this).find('.member').text() + " ");
        });

        var comment_body = $stagingDiv.html();
        var data = {};

		if(comment_body !== "") {
		  	data['comment'] = {};
			data['comment']['post_id'] = postid;
			data['comment']['parent_id'] = comment_id;
			data['comment']['comment_detail'] = comment_body;
			data['comment']['tagged_members'] = self.tagged_members;
			PostActions.postComment(self.props.origin + '/comments', data);

			self.setState({
				reply_text : ''
			});

		  	ReactDOM.unmountComponentAtNode(document.getElementById('comment-input-container'));
			
            React.render(
				<CommentInput origin={this.props.origin} post_id = {this.props.post_id} />,
				document.getElementById("comment-input-container")
			);
		}
	},

	render: function() {
		var self = this;
		var comment_user = "@" + this.props.comment.user.username;

        var user = {
            username: this.props.comment.user.username, 
            user_id: this.props.comment.user.id
        };
		self.tagged_members.push(user);

        var user_tag =  <span className="atwho-inserted" data-atwho-at-query="@"><span member_id={this.props.comment.user.id} data-value={this.props.comment.user.username} className = "member">
                            {this.props.comment.user.username}
                        </span></span>;

		return (
			<div className="col-md-12 tf-comment-add">
                <div ref="comment_reply" id="editable_reply" className="col-md-10 inputor" contentEditable="true">
                    {user_tag}&nbsp;
                </div>
                <div id="edit-comment-reply-staging-div" className="hidden" style={{display:'none'}}></div>			
   				<div className="col-md-2 button tf-comment-reply-button" onClick = {this.postCommentReply}> Add Reply 
   				</div>
   			</div>
		);
	}
});

module.exports = CommentReplyInput;
