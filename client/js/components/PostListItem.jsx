/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var PostActions = require('../actions/PostActions');

var Link = require('react-router').Link;

var classNames = require('classnames');

var isPlaying = classNames("tf-post-item is-playing");
var isNotPlaying = classNames("tf-post-item");
var isUpvoted = classNames("tf-post-item--votes is-upvoted");
var isNotUpvoted = classNames("tf-post-item--votes");
var _localVoteCount = 0;

var PostListItem = React.createClass({

  propTypes: {
   key: ReactPropTypes.string,
   post: ReactPropTypes.object,
   trackIdx: ReactPropTypes.number,
   onClick: ReactPropTypes.func,
   onUpvote: ReactPropTypes.func,
   isLoggedIn: ReactPropTypes.bool, 
   userId: ReactPropTypes.number,
   isUpvoted: ReactPropTypes.bool,
   rank: ReactPropTypes.string,
   currStreamUrl: ReactPropTypes.string, 
   showModal: ReactPropTypes.func
  },

  getInitialState: function() {
    return {isPlaying:false, isUpvoted:false, hasUpvoted:false};
  }, 

  componentDidMount: function() {
    //console.log("POST LIST ITEM ", this.props);
    this.state.isUpvoted = this.props.isUpvoted;
  },

  componentWillMount: function() {
    //this.hasUpvoted("WILL MOUNT", this.props.post);

  }, 

  upvote: function(e) {
    e.preventDefault();
    var post = this.props.post;
    //console.log('upvoting '+this.props.key);
    //PostActions.upvote('http://localhost:3000'+'/votes', this.props.post.id);
    mixpanel.identify(this.props.userid);
    mixpanel.track("Upvote", {
      "Title" : post.title,
      "id" : post.id,
      "artist" : post.artist,
      "vote count" : post.vote_count
    });
    if(this.props.isLoggedIn && !this.hasUpvoted(this.props.post)){
      this.props.onUpvote(this.props.post.id);
      this.setState({hasUpvoted:true});
    } else if(!this.props.isLoggedIn) {
      this.props.showModal(true);
    }
  },

  playPauseTrack: function(e) {
    e.preventDefault();
    this.props.onClick(this.props.post.stream_url, this.props.post);
    var post = this.refs.post.getDOMNode();
    //console.log("POST STATUS", this.state.isPlaying);
    if(!this.state.isPlaying) {
      post.className = isPlaying;
      this.setState({isPlaying:true});
    }
    else {
      post.className = isNotPlaying;
      this.setState({isPlaying:false});
    }
    //console.log("POST STATUS POST", this.props.rank, this.state.isPlaying);
  },

  hasUpvoted: function(post) {
    if(this.props.isLoggedIn){
      //console.log("POST TO UPVOTE", post);
      var exists = post.voters.indexOf(this.props.userId);
      //console.log(post.id, exists);
      return (exists != -1) ? true : false;
    }
  }, 

  renderTags: function() {
    t = this.props.post.tags;
    tags = [];
    for(tag in t) {
      var tag = <div className="tf-tag tf-uppercase"> {t[tag].name} </div> 
      tags.push(tag);
    }

    return tags;
  },

  renderAuthor: function() {
    var aId = this.props.post.author_id;
    var aImg = this.props.post.author_img;
    var aName = this.props.post.author_name;

    return <div><Link to={'/profile/'+aId} className="tf-link"><img className="tf-author-img" src={aImg}></img></Link></div>;
  }, 

  /**
   * @return {object}
   */
  render: function() {
    var post = this.props.post;
    var key = this.props.key;
    var upvoted = (this.state.isUpvoted || this.props.isUpvoted || this.state.hasUpvoted);
    var localUpvote = this.state.hasUpvoted; //pre refresh we upvoted this
    _localVoteCount = post.vote_count + 1;
    return (
      <li className={isNotPlaying} ref="post">
        <div className="tf-post-item-content">
          <div className={ upvoted ? isUpvoted : isNotUpvoted} ref="upvotes" onClick={this.upvote}>
          { localUpvote ? _localVoteCount : post.vote_count }
          </div>
          <div className="tf-post-item--img"> 
            <a href="#!" className="tf-post-play" onClick={this.playPauseTrack}>
              <img className="tf-thumbnail" src={ post.img_url ? post.img_url : "assets/img/tf_placeholder.png" }/>
            </a>
            <div className="tf-overlay" onClick={this.playPauseTrack}> 
            </div> 
            <div className="tpf-play-button" onClick={this.playPauseTrack}> 
              <img src={'assets/img/player-play-white.svg'} /> 
            </div> 
            <div className="tpf-pause-button" onClick={this.playPauseTrack}> 
              <img src={'assets/img/player-pause-white.svg'} /> 
            </div> 
          </div>
          <div className="tf-post-item--rank">{parseInt(this.props.rank) + 1}</div>
          <div className="tf-post-item--info">
            <h5> { post.title } </h5>
            <small> {post.artist } </small>
          </div>
          <div className="tf-post-item--author">
            {this.renderAuthor()}
          </div>
          <div className="tf-post-item--tags">
            {this.renderTags()}
          </div>
        </div>
      </li>
    );
  }

});

module.exports = PostListItem;


