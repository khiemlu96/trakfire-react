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
var UserStore = require('../stores/UserStore.js');
var PostStore = require('../stores/PostStore.js');

function getAppState() {
	this.tagged_members = [];
	return {
		currUser: UserStore.getCurrentUser(),
		comment_text: ''
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

  	componentDidMount: function() {
		PostStore.addChangeListener(this._onChange);
		currUser = this.props.currUser;
		console.log("THE CURRENT USER IS", currUser, this.state.currUser);
  	},

	postComment: function() {
		var self = this;
		var postid = this.props.post_id;			
		var comment_text = convertHtmlToText( this.state.comment_text.trim() );

		var data = {};

		if(comment_text !== "") {
			data['comment'] = {};
			data['comment']['post_id'] = postid;
			data['comment']['comment_detail'] = comment_text;
			data['comment']['tagged_members'] = self.tagged_members;
			PostActions.postComment(this.props.origin + '/comments', data);
			this.setState({comment_text: ''});
			this.refs.comment.getDOMNode().innerHTML = "";
		}
	},

	shouldComponentUpdate: function(nextProps){
		if(this.refs.comment)
        	return nextProps.comment_text !== this.refs.comment.getDOMNode().innerHTML;
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
				<div className="col-md-12 tf-comment-add">
					<div className="tf-comment-input-box">
						<a href={"/profile/" + this.state.currUser.id} className="tf-link">
							<img src={this.state.currUser.img} className="tf-author-img"> </img>
						</a>
					</div>
					{/*<input ref="comment" className="tf-soundcloud-link" type="text" placeholder="Write a Comment..."></input> */}
					<div className="col-md-10 tf-comment-input"
						ref="comment"
	        			onInput={this.emitChange} 
	        			onBlur={this.emitChange}
	        			contentEditable
	        			onChange={this.handleChange}
	        			placeholder="Write a Comment...">
            		</div>
					<div className="col-md-2 button tf-comment-button" onClick = {this.postComment}> Add Comment </div>
				</div>
			);
		} else {
			return (<div></div>);
		}
		
	},

	_onChange: function() {
		this.setState(getAppState());
	}
});

module.exports = CommentInput;
