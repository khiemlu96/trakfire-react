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
	return {
		currUser: UserStore.getCurrentUser()
	};	
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
  	},

	postComment: function() {
		console.log("In postComment");
		var postid = this.props.post_id;
		var comment_text = this.refs.comment.getDOMNode().value.trim();
		var data = {};

		if(comment_text !== "") {
			data['comment'] = {};
			data['comment']['post_id'] = postid;
			data['comment']['comment_detail'] = comment_text;
			PostActions.postComment(this.props.origin + '/comments', data);
			this.refs.comment.getDOMNode().value = "";
		}
	},

	render: function() {
		console.log("In render of comment input");
		if( this.state.currUser && this.state.currUser !== null) {
			return (
				<div className="col-sm-12 tf-comment-add">
					<div className="tf-comment-input-box">
						<a href={"/profile/" + this.state.currUser.id} className="tf-link">
							<img src={this.state.currUser.img} className="tf-author-img"> </img>
						</a>
					</div>
					<input ref="comment" className="tf-soundcloud-link" type="text" placeholder="Write a Comment..."></input>
					<div className="button tf-comment-button" onClick = {this.postComment}> Add Comment </div>
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
