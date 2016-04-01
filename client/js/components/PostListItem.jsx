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
var UserFlyOver = require('./UserFlyOver.jsx');

var isPlaying = classNames("tf-post-item is-playing");
var isNotPlaying = classNames("tf-post-item");
var isFirstPlaying = classNames("tf-post-item--first is-playing");
var isFirstNotPlaying = classNames("tf-post-item--first");
var isUpvoted = classNames("tf-post-item--votes is-upvoted");
var isNotUpvoted = classNames("tf-post-item--votes");
var playing = classNames("icon icon-controller-paus");
var paused = classNames("icon icon-controller-play");
var _localVoteCount = 0;

var PostListItem = React.createClass({

  propTypes: {
   key: ReactPropTypes.string,
   post: ReactPropTypes.object,
   idx: ReactPropTypes.number,
   onClick: ReactPropTypes.func,
   onUpvote: ReactPropTypes.func,
   isLoggedIn: ReactPropTypes.bool, 
   userId: ReactPropTypes.number,
   isUpvoted: ReactPropTypes.bool,
   rank: ReactPropTypes.string,
   currStreamUrl: ReactPropTypes.string, 
   showModal: ReactPropTypes.func, 
   isFirst: ReactPropTypes.bool,
   origin: ReactPropTypes.string, 
   first: ReactPropTypes.bool, 
   number: ReactPropTypes.number, 
   showNumber: ReactPropTypes.bool, 
   showAuthor : ReactPropTypes.bool,
  },

  getInitialState: function() {
    return {isPlaying:false, isUpvoted:false, hasUpvoted:false};
  }, 

  componentDidMount: function() {
    console.log("POST LIST ITEM PROPS", this.props);
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
      var count = this.refs.count.getDOMNode();
      //var upvotes = this.refs.upvotes.getDOMNode();
      //upvotes.className=isUpvoted ;
      //count.className = "";
      //var count_old = count.innerHTML;
      //count.innerHTML = parseInt(count_old) + 1;

      this.setState({hasUpvoted:true});
    } else if(!this.props.isLoggedIn) {
      this.props.showModal(true);
    }
  },


  playPauseTrack: function(e) {
    e.preventDefault();
    //var key = this.props.key;
    var idx = this.props.idx;
    //idx = idx[1];
    //if(!this.state.isPlaying)
      this.props.onClick(this.props.post.stream_url, this.props.post, idx);

    var overlay = this.refs.overlay.getDOMNode();
    console.log("OVERLAY", overlay);
    if(!this.state.isPlaying) {
      overlay.className = playing;
      this.setState({isPlaying:true});
    } else {
      overlay.className = paused;
      this.setState({isPlaying:false});
    }

    /*var post = this.refs.post.getDOMNode();
    //console.log("POST STATUS", this.state.isPlaying);
    if(!this.props.first) {
      if(!this.state.isPlaying) {
        post.className = isPlaying;
        this.setState({isPlaying:true});
      }
      else {
        post.className = isNotPlaying;
        this.setState({isPlaying:false});
      }
    } 
    else if(this.props.first) {
      if(!this.state.isPlaying) {
        post.className = isFirstPlaying;
        this.setState({isPlaying:true});
      }
      else {
        post.className = isFirstNotPlaying;
        this.setState({isPlaying:false});
      }      
    }*/
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
      if(tags.length > 3){
          break;
      }
    }

    return tags;
  },

  renderAuthor: function() {
    var aId = this.props.post.author_id;
    var aImg = this.props.post.author_img;
    var aName = this.props.post.author_name;

    return(<div><UserFlyOver user = {this.props.post.user} origin={this.props.origin} /></div>);
  },

  /**
   * @return {object}
   */
  render: function() {
    var post = this.props.post;
    var key = this.props.key;
    var upvoted = (this.state.isUpvoted || this.props.isUpvoted || this.state.hasUpvoted);
    var localUpvote = this.state.hasUpvoted; //pre refresh we upvoted this
    _localVoteCount = post.vote_count;
    var img = post.img_url;
    /*if(this.props.first) {
      img = post.img_url_lg;
      console.log("LARGE IMG", img);
    } else {
      img = post.img_url;
    }*/
    var profileLink = "/profile/"+post.author_id;
    var postLink = "/post/"+post.id;
    var isNumbered = this.props.showNumber;
    //var first = (this.props.first) ? isFirstNotPlaying : isNotPlaying;
    var voteStyle = { color: "#ff0d60 !important;" };
    return (
        <li className="media tf-media">
          <div className="media-left">
            <span className="tf-media-number">
              { isNumbered ? this.props.number + 1 : "" }
            </span>
            <a href="#" className="tf-media-wrap" onClick={this.playPauseTrack}>
              <img className="media-object tf-media-thumbnail" width="64" src={post.img_url} alt="..."></img>
              <div className="tf-media-thumbnail-overlay"><span className={paused} ref="overlay"></span></div>
            </a>
          </div>
          <div className="media-body">
            <h4 className="tf-media-title">
              <span className="pull-right"><a href="#" onClick={this.upvote}><span className="icon icon-chevron-up" style={voteStyle}></span></a> <small ref="count">{(post.vote_count !== null) ? post.vote_count : 0}</small> </span>
              <Link to={postLink} className="no-decor">{post.title}</Link>
            </h4>
            <h6 className="tf-media-artist">{post.artist}
              { this.props.showAuthor ? <small className="pull-right"> posted by: <Link to={profileLink} className="tf-media-poster">{post.author_name}</Link> </small> : "" }
            </h6> 
          </div>
        </li>
    );
  }

});

module.exports = PostListItem;


