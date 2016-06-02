/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactDOM = require('react-dom')
var ReactPropTypes = React.PropTypes;

var Link = require('react-router').Link;
var PostActions = require('../actions/PostActions.js');
var UserActions = require('../actions/UserActions.js');
var UserStore = require('../stores/UserStore.js');
var classNames = require('classnames');
var Bootstrap = require('react-bootstrap');
var OverlayTrigger = Bootstrap.OverlayTrigger;
var Overlay = Bootstrap.Overlay;
var Button = Bootstrap.Button;
var Popover = Bootstrap.Popover;
var isPlaying = classNames("tf-post-item is-playing");
var isNotPlaying = classNames("tf-post-item");
var isFirstPlaying = classNames("tf-post-item--first is-playing");
var isFirstNotPlaying = classNames("tf-post-item--first");
//var isUpvoted = classNames("tf-post-item--votes is-upvoted");
//var isNotUpvoted = classNames("tf-post-item--votes");
var playing = classNames("icon icon-controller-paus");
var paused = classNames("icon icon-controller-play");
var notUpvoted = classNames("icon icon-chevron-up is-not-upvoted");
var isUpvoted = classNames("icon icon-chevron-up is-upvoted");
var _localVoteCount = 0;
var hoverStyle = {
  positionLeft: '53%'
}
var hashHistory = require('react-router').hashHistory;
var PostListItem = React.createClass({

  propTypes: {
   key: ReactPropTypes.string,
   post: ReactPropTypes.object,
   idx: ReactPropTypes.number,
   onClick: ReactPropTypes.func,
   changeIcons: ReactPropTypes.func,
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
   artistId: ReactPropTypes.string 
  },

  getInitialState: function() {
    return {
              isPlaying:false, 
              isUpvoted:false, 
              hasUpvoted:false, 
              isFollowing:false,
              currentUser: UserStore.getCurrentUser(), 
              bots: UserStore.getBotUsers(), 
              isAdmin: UserStore.isAdmin(), 
              showPopover: false, 
              target: null
            };
  }, 

  componentDidMount: function() {
    this.state.isUpvoted = this.props.isUpvoted;
    $(document).on("ReactComponent:PostListItem:handlePlayPauseClick", this.updatePlayPauseState);
    $(document).on("ReactComponent:PostListItem:followClick", this.followClick);
    //$(document).on("ReactComponent:PostListItem:showFlyOver", this.showFlyOver);
    UserStore.addChangeListener(this._onChange);
    UserActions.getBotUsers(this.props.origin + '/bots');
    //console.log("AM I AN ADMIN", UserStore.isAdmin())
    /*$(".followUser").on('click', function(event){
        alert("The paragraph was clicked.");
    });*/
    this.props.artistId = "";
    var self = this;
    
    /*$(".tf-media").hover(function() {
        $(this).css('cursor', 'pointer');
    });*/

    /*$(".tf-media").on('click', function() {
        //location = '/post/' + this.props.post.id;
        //var postLink = '#/post/' + self.props.post.id;
        //hashHistory.push(postLink);
        this.playPauseTrack();
    });*/
    
    $("#tf-post-"+this.props.post.id).find(".upvote-link").click( function(e) {
        e.stopPropagation();
        e.preventDefault();
        self.upvote();
    });

    $("#tf-post-"+this.props.post.id).find(".admin").click( function(e) {
        console.log("IN ADMIN");
        e.stopPropagation();
        e.preventDefault();
        //console.log("TARGET", e.target);
        self.setState({ target: e.target, showPopover: !self.state.showPopover });
        //e.preventDefault();
        //self.upvote();
    });

    /*$("#tf-admin-vote-"+this.props.post.id).click( function(e) {
        console.log("IN POPOVER");
        e.stopPropagation();
        e.preventDefault();
        self.batchUpvote();
        //self.setState({ target: e.target, showPopover: !self.state.showPopover });
        //e.preventDefault();
        //self.upvote();
    });*/
  },

  updatePlayPauseState: function(e, track_id) {    
    if(this.props.post.id === track_id) {
      var overlay = this.refs.overlay;

      if(!this.state.isPlaying) {
        this.setState({isPlaying:true});
      } else {
        this.setState({isPlaying:false});
      }

      // Call the function to update the icons on album square
      // and pass stream_url, Post, id and State of playing as a arguments
      this.props.changeIcons(this.props.post.stream_url, this.props.post, idx, this.state.isPlaying);
    }
  },

  componentWillMount: function() {
    //this.hasUpvoted("WILL MOUNT", this.props.post);
  }, 

  upvote: function() {
    var post = this.props.post;
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
      var u = this.refs.upvotebtn.getDOMNode();
      u.className = isUpvoted;
      this.setState({hasUpvoted:true});
    } else if(!this.props.isLoggedIn) {
      this.props.showModal(true);
    }
  },


  playPauseTrack: function(e) {
    e.preventDefault();
    e.stopPropagation();
    //var key = this.props.key;
    var idx = this.props.idx;
    //idx = idx[1];
    //if(!this.state.isPlaying)
    this.props.onClick(this.props.post.stream_url, this.props.post, idx);

    var overlay = this.refs.overlay.getDOMNode();

    if(!this.state.isPlaying) {
      overlay.className = playing;
      this.setState({isPlaying:true});
    } else {
      overlay.className = paused;
      this.setState({isPlaying:false});
    }
  },

  hasUpvoted: function() {
    var post = this.props.post;
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

  renderAdminVoteList: function() {
    var self = this;
    var currentUser = UserStore.getCurrentUser();
    //console.log("CURRENT", currentUser);
    var bots = this.state.bots;
    var botItems = [];
    var item = ( <div className="checkbox">
                    <label>
                      <input type="checkbox" value="me" className="chkbx"> Myself </input>
                    </label>
                  </div>);
    botItems.push(item);
    for(bot in bots) {
      b = bots[bot]
      //console.log("BOTS", b, bots)
      item = ( <div className="checkbox">
                    <label>
                      <input type="checkbox" value={b.handle} className="chkbx"> {b.name}</input>
                    </label>
                  </div>);
      botItems.push(item);
    }
    return (
      <div>
        <ul className="list-group" ref="botlist">
          <li className="list-group-item">
            {botItems}
          </li>
        </ul>
        <a href="#" onClick = { function(e) { e.preventDefault(); self.batchUpvote(); } }> UPVOTE </a>
      </div>
    );
  }, 

  renderVoteButton: function() {
    var isAdmin = UserStore.isAdmin();
    var upvoted = (this.props.isUpvoted || this.state.hasUpvoted);
    //console.log("render vb", isAdmin);
    if(isAdmin) {
      console.log("RENDER VOTE BUTTON");
      var voteButton = (
             <a className = "admin">
                <span className={ !upvoted ? notUpvoted : isUpvoted } ref="upvotebtn"> 
            </span>
            </a>);
    } else {
      var voteButton = (<a href = "#"  className = "upvote-link" onClick = {this.upvote}>
                            <span className={ !upvoted ? notUpvoted : isUpvoted } ref="upvotebtn"> 
                            </span>
                        </a>);
    }/**/
    //console.log("vb",voteButton);
    return voteButton;
    /*          */
  }, 

  batchUpvote: function() {
    var data = {};
    var votingBots = [];
    var botList = this.refs.botlist.getDOMNode();
    var items = botList.getElementsByTagName('input');
    for(item in items) {
      console.log(items[item]);
      i = items[item];
      if(i.value && i.checked) { votingBots.push(i.value); };
    }
    data['voters'] = votingBots;
    data['post'] = this.props.post.id;
    //console.log("DATAAA", data);
    PostActions.batchUpvote(this.props.origin+'/votes/batch_create', data);
    this.setState({showPopover:false});
  }, 

  showPopover: function(e) {
    this.setState({showPopover : true});
  }, 

  followUser: function(userid,artist_id) {
    var follow_id = userid;
    UserActions.followUser(this.props.origin+ '/follower', follow_id);
    //this.showFlyOver(artist_id);
    this.setState({isFollowing:true});
  },
  
  unFollowUser: function(userid,artist_id) {
    var follow_id = userid;
    UserActions.unFollowUser(this.props.origin+ '/follower', follow_id);
    //this.showFlyOver(artist_id);
    this.setState({isFollowing:false});
  },

  followClick: function(userid,artist_id){
    event.preventDefault();
      if( this.state.currentUser !== null || sessionStorage.getItem('jwt') !== null ) {
      var currentUser_followings = [];
          for(var key in this.state.currentUser.followings) {
              currentUser_followings.push(this.state.currentUser.followings[key].id);
          }

          if(currentUser_followings.indexOf(userid) > -1) {
              this.unFollowUser(userid,artist_id);
          } else {
              this.followUser(userid,artist_id); 
          }
      } else {
        // If user is not logged in and if he clicks on Follow User button
        // then forced user to login in to site to follow the user
        $(document).trigger("ReactComponent:TrakfireApp:showModal");
      }
    /*if(!this.state.isFollowing){
      this.followUser(userid,artist_id);
      this.state.isFollowing = true;
    }
    else{
      this.unFollowUser(userid);
      this.state.isFollowing = false;
    }*/
  },

  handle_follow_click: function(event) {
    event.preventDefault();
      if( this.state.currentUser !== null || sessionStorage.getItem('jwt') !== null ) {
      var currentUser_followings = [];
          for(var key in this.state.currentUser.followings) {
              currentUser_followings.push(this.state.currentUser.followings[key].id);
          }

          if(currentUser_followings.indexOf(this.state.user.id) > -1) {
              this.unFollowUser(this.state.user.id);
          } else {
              this.followUser(this.state.user.id); 
          }
      } else {
        // If user is not logged in and if he clicks on Follow User button
        // then forced user to login in to site to follow the user
        $(document).trigger("ReactComponent:TrakfireApp:showModal");
      }
    },

    showFlyOver: function(artist_id) {
        var self = this;
        artist_id = artist_id.replace(".", "");
        var CurrentPost = this.props.post;
        var follow_text = "", className = "";
        var follow_btn_Html = '';

        if (sessionStorage.getItem('jwt') !== '' && this.state.currentUser !== null && 
            this.state.currentUser.id !== this.props.post.user.id) {
            if (this.state.currentUser.id !== null) {
                var currentUser_followings = [];
                var follow_id = "followUser" + artist_id;

                for (var key in this.state.currentUser.followings) {
                    currentUser_followings.push(this.state.currentUser.followings[key].id);
                }

                if (currentUser_followings.indexOf(parseInt(this.props.post.user.id)) > -1) {
                    follow_text = "Following";
                    className = "button user-flyover-follow-btn tf-follow-button";
                } else {
                    follow_text = "Follow";
                    className = "button user-flyover-follow-btn btn-primary-outline tf-follow-button tf-background";
                }
                var follow_btn_Html = '<button class="btn ' + className + '" id=' + follow_id + '>' + follow_text + '</button>'          
            }
        }
        
        var popoverTemplate = ['<div class="popover">',
            '<div class="arrow"></div>',
                '<div class="popover-content">',
                '</div>',
            '</div>'
        ].join('');

        var content = [
            '<div class = "col-md-12 user-flyover-content">',
                '<div class = "user-flyover-profile-image">',
                    '<img class="tf-author-img" src=' + CurrentPost.user.img + '></img>',
                '</div>',
                '<div class = "media-object img-circle">',
                    '<div class="nd">' + CurrentPost.author_name + '</div>',
                    '<div class="user-flyover-profile-bio">' + CurrentPost.user.tbio + '</div>',
                '</div>'
                + follow_btn_Html +
            '</div>',
        ].join('');        

        $("#" + artist_id).popover({
            selector: '[rel=popover]',
            trigger: 'hover',
            content: content,
            template: popoverTemplate,
            placement: "top",
            html: true
        }).on("hover", function(e) {
            e.preventDefault();
        }).on("mouseenter", function() {
            var _this = this;
            $(this).popover("show");
            $("#" + follow_id).on('click', function(event) {
                //call the followClick function of current Component using 'self'
                event.stopPropagation();
                event.preventDefault();
                self.followClick(CurrentPost.author_id, artist_id);
            });
            $(this).siblings(".popover").on("mouseleave", function() {
                $(_this).popover('destroy');
            });
        }).on("mouseleave", function() {
            var _this = this;
            setTimeout(function() {
                if (!$(".popover:hover").length) {
                    $(_this).popover("destroy");
                }
            }, 100);
        });
    },

  /**
   * @return {object}
   */
  render: function() {
    var post = this.props.post;
    var key = this.props.key;
    var upvoted = (this.props.isUpvoted || this.state.hasUpvoted);
    var localUpvote = this.state.hasUpvoted; //pre refresh we upvoted this
    _localVoteCount = post.vote_count;
    var img = post.img_url;
    var followBtnStyle = {
        border: '1px solid #ff0d60'
    };
    var userImgLink = post.user.img;
    var autherName = post.author_name;
    var profileLink = "/profile/"+post.author_id;
    var postLink = "/post/"+post.id;
    var isNumbered = this.props.showNumber;
    
    var artist_id = "tf-media-artist-" + post.id;
    
    var voteStyle = { color: "#ff0d60 !important;" };
    var voteStyleUpvoted = { color: "#777 !important;" };
    var postId = "tf-post-"+ post.id;

    //console.log("UPVOTED",this.state.isAdmin);
    /*onClick = {this.toDetail} */
    return (
        <li className = "media tf-media" id={postId} >
            <div className = "media-left">
                <span className = "tf-media-number">{isNumbered ? this.props.number + 1 : ""} </span> 
                <a href = "#" className = "tf-media-wrap" onClick = {this.playPauseTrack}>
                    <img className = "media-object tf-media-thumbnail" width = "64" src = {post.img_url} alt = "..." ></img> 
                    <div className = "tf-media-thumbnail-overlay" ref = "overlaybg">
                        <span className = {paused} ref = "overlay"></span>
                    </div>
                </a>
            </div>
            <div className = "media-body">
                <h4 className = "tf-media-title">
                    <span className = "pull-right"> 
                        {this.renderVoteButton()}
                        <small ref = "count"> {(post.vote_count !== null) ? post.vote_count : 0} </small>
                    </span>
                    <Link className = "no-decor" to={postLink} onClick={this.stopPropagation}> { post.title } </Link>
                </h4>
                <h6 className = "tf-media-artist">
                    {post.artist} 
                    {this.props.showAuthor ?
                        <small className = "pull-right" > 
                        {/* FOR FLYOVER onMouseEnter = {this.showFlyOver.bind(this, artist_id)}*/}
                            posted by: <Link to = {profileLink} onClick={this.stopPropagation} className = "tf-media-poster nd">
                            <span id = {artist_id} data-trigger = "hover" data-toggle = "popover" data-placement = "top">
                                <small className = "tf-media-artist-name">{post.author_name}</small> 
                            </span></Link>  
                        </small> : "" 
                    } </h6>
            </div>
            <Overlay
              show={this.state.showPopover}
              container={this}
              placement="right"
            >
            <Popover id={"tf-post-popover-" + post.id}>
              {this.renderAdminVoteList()}
            </Popover>
            </Overlay>
        </li>
    );
  },

    _onChange: function() {
        this.setState({
          currentUser: UserStore.getCurrentUser()
        });
    }, 

    toDetail: function(e) {
      e.stopPropagation();
      var postLink = "/post/"+this.props.post.id;
      browserHistory.push(postLink);
    }, 

    stopPropagation: function(e) {
      e.stopPropagation();
      //this.handleClick(e);
    }
});

module.exports = PostListItem;
