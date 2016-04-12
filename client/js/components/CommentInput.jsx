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
var UserActions = require('../actions/UserActions.js');
var UserStore = require('../stores/UserStore.js');
var PostStore = require('../stores/PostStore.js');
var Reqwest = require('reqwest');

function getAppState() {
	this.tagged_members = [];
	return {
		currUser: UserStore.getCurrentUser(),
		comment_text: '',
		memberCollection: UserStore.getAllUsers()
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

var CommentInput = React.createClass({
	
	propTypes: {
        origin: ReactPropTypes.string,
        post_id: ReactPropTypes.number,
        currUser: ReactPropTypes.object        
    },

	getInitialState: function() {
        return getAppState();
    },

    addUserTagginng: function() {
    	var self = this;
    	self.tagged_members = [];
		
	    var memberData = $.map(self.state.memberCollection, function(member, i) {
	      	return {
      			'userId':member.id,
		      	'name':member.name,
		      	'email':member.email
		    };
	    });

    	var at_config = {
			at: "@",
			data: memberData,
			headerTpl: null,
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
			  	afterMatchFailed: function() {

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

    	$('#editable').atwho(at_config);
    },

    getUserCollection: function(data) {    	
    	UserActions.getAllUsers(this.props.origin+'/users',data);
    },

  	componentDidMount: function() {
		UserStore.addChangeListener(this._onChange);
		var data = {
            limit: 100
        };
        
		this.getUserCollection(data);

		currUser = this.props.currUser;
		this.addUserTagginng();
  	},

	postComment: function() {
		var self = this;
		var postid = this.props.post_id;

		var commentContent = self.refs.comment.innerHTML.replace(/[<]br[^>]*[>]/gi,"\n");
		var comment_text = commentContent.replace(/\&nbsp;/g," ");
		comment_text = comment_text.replace(/<p>&nbsp;<\/p>/gi,'\n').replace(/<p>/gi,'').replace(/<\/p>/gi,'\n');

		var $stagingDiv = $('#edit-comment-staging-div');

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
			data['comment']['comment_detail'] = comment_body;
			data['comment']['tagged_members'] = self.tagged_members;
			PostActions.postComment(this.props.origin + '/comments', data);
			this.setState({comment_text: ''});
			this.refs.comment.innerHTML = "";
		}
	},

	shouldComponentUpdate: function(nextProps){
		if(this.refs.comment)
        	return nextProps.comment_text !== this.refs.comment.innerHTML;
        else 
        	return true;
    },

    emitChange: function(event){
		this.setState({comment_text: event.target.innerHTML});
        this.lastHtml = this.state.comment_text;
    },

    handleChange: function(event){
	    this.setState({comment_text: event.target.innerHTML});
	},

	render: function() {
		if( this.state.currUser && this.state.currUser !== null) {
			
			return (
				<div>
					<div className="col-md-12 tf-comment-add">
						<div ref="comment" id="editable" className="col-md-10 inputor" contentEditable="true">				             
		  				</div>
		  				<div id="edit-comment-staging-div" className="hidden" style={{display:'none'}}></div>
	  					<div className="col-md-2 button tf-comment-button" onClick = {this.postComment}> Add Comment </div>
  					</div>
  				</div>
			);
		} else {
			return (<div></div>);
		}		
	},

	_onChange: function() {		
		this.setState(getAppState());		
		this.addUserTagginng();
	}
});

module.exports = CommentInput;
