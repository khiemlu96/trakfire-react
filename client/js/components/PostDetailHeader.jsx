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
var Link = require('react-router').Link;

var Bootstrap = require('react-bootstrap');
var OverlayTrigger = Bootstrap.OverlayTrigger;
var Popover = Bootstrap.Popover;
var UserStyle = { maxWidth:480, backgroundColor: '#1c1c1c', border:'1px solid #2b2b2b'};
var UserFlyOver = require('./UserFlyOver.jsx');
var classNames = require('classnames');
var playing = classNames("icon icon-controller-paus");
var paused = classNames("icon icon-controller-play");
var UserStore = require('../stores/UserStore.js');
var UserActions = require('../actions/UserActions.js');
var namespace = "PostDetailHeader::";

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function getLength(arr) {
  var count = 0;
  for(key in arr){
    count++;
  }
  return count;
}

var PostDetailHeader = React.createClass({
  propTypes: {
   post: ReactPropTypes.object,
   onClick: ReactPropTypes.func,
   origin: ReactPropTypes.string,
   currUser: ReactPropTypes.object
  },

  componentWillMount: function() {
    UserStore.addChangeListener(this._onChange);
    console.log("WILL MOUNT THE DETAIL HEADER");
  },

  componentDidMount: function() {
    console.log("MOUNTING THE DETAIL HEADER");
  },
  componentWillUnmount() {
    // Remove same function reference that was added
    UserStore.removeChangeListener(this._onChange);
  },
  buildTweet: function(post) {
    var surlines = ["premium unleaded gasoline",
                    "a tidal wave of pure fire",
                    "pure unadulterated fire",
                    "the next wave",
                    "undeniable"];
    var choice = randomIntFromInterval(0, 4);
    var text = post.title + " by " + post.artist + " is " + surlines[choice];
    var via = "trakfiremusic";
    //var url = post.url  TODO ONCE SERVER RENDERING IS COMPLETE
    var base = "https://twitter.com/intent/tweet?";
    return base + "text=" + text + "&via=" + via; // TODO ES6 TEMPLATE STRINGS
  },

  renderVotes: function(post) {
    var votes = post.votes_data;
    console.log(namespace+" votes ", votes);
    var voteHtml = [];
    for(key in votes) {
      if(votes[key].user){
      var artist_id = "tf-media-artist-" + votes[key].user.id;
      voteHtml.push(
        /*<a className="tf-link" href={"/profile/" + votes[key].user.id} >
          <img className="tf-author-img" src={votes[key].user.img} />
        </a>*/

        <Link to={'/profile/'+votes[key].user.id} className="tf-link">
            {/*onMouseEnter = {this.showFlyOver.bind(this, artist_id, votes[key].user)}*/}
            <img id = {artist_id} data-trigger = "hover" data-toggle = "popover" data-placement = "top" className='tf-author-img' src={ votes[key].user ? votes[key].user.img : "assets/img/trakfirefavicon.ico"}></img>
        </Link>
      );
      }
    }
    return (voteHtml);
  },

  personOrPeople: function(post) {
    if (getLength(post.votes) === 1) {
      return ("person");
    }
    else {
      return ("people");
    }
  },

  getInitialState: function() {
    return {isPlaying:false, isUpvoted:false, hasUpvoted:false, currentUser: UserStore.getCurrentUser()};
  },

  upvote: function(e) {
    e.preventDefault();
    this.PostActions.upvote(this.props.key);
  },

  playPauseTrack: function(e) {
    e.preventDefault();
    console.log("TRACK", this.props.trackIdx);
    this.props.onClick(this.props.post.stream_url, this.props.post);
    this.setState({isPlaying:true});
    if(!this.state.isPlaying) {
      //this.refs.post.className += " is-playing";
      this.setState({isPlaying : true});
      mixpanel.track("Track Play");
    }
    else {
      //this.refs.post.className = isNotPlaying;
      this.setState({isPlaying : false});
      mixpanel.track("Track Pause");
    }
    //console.log("POST", this.state.isPlaying, this.refs.post);
  },

  /**
   * @return {object}
   */
  render: function() {
    var post = this.props.post;
    var background_img = { backgroundImage: "url("+post.img_url_lg+")" };
    var profileLink = '/profile/' + post.author_id;
    return(
      <div className="container">
      <div className="detail-header text-center">

        <div className="tf-header-background" style={background_img}></div>
        <div className="tf-header-background-overlay">
          <img src="http://d1zb20amprz33r.cloudfront.net/polygon_overlay-min.png" alt="..."></img>
        </div>

        <div className="container">
          <div className="container-inner-home">
            <div className="row no-gutter">

              <div className="col-md-3">
                <a href="#" onClick={this.playPauseTrack}>
                  <div className="tf-header-thumbnail">
                      <img src={post.img_url_lg} alt="..."></img>
                      <div className="tf-header-thumbnail-overlay" ref="overlaybg"><span className={!this.state.isPlaying ? paused : playing} ref="overlay"></span></div>
                  </div>
                </a>
              </div>

              <div className="col-md-offset-1 col-md-8">
                <div className="tf-header-info">
                    <h4>{post.title}</h4>
                    <h6>{post.artist}</h6>
                    <hr></hr>
                    <div className="row">
                      <div className="col-xs-6">
                        <p>Posted by <b><Link to={profileLink} className="tf-profile-link nd">{post.author_name}</Link></b></p>
                        <a href={this.buildTweet(post)} className="nd"><div className="button btn-share-song"><img className="tf-social-icons" src={'/assets/img/twitter_footer.svg'} /> Tweet This Song</div></a>
                      </div>
                      <div className="col-xs-6">
                        <div >
                          <i className="glyphicon glyphicon-fire tf-social-icons"></i>
                          <span>&nbsp;<b>{voteCount = getLength(post.votes)} {this.personOrPeople(post)}</b></span>
                          <span>&nbsp;upvoted</span>
                        </div>
                        <div className="tf-auther-panel">
                          {this.renderVotes(post)}
                        </div>
                      </div>
                    </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
      </div>
    );
  },

  followUser: function(userid) {
    var follow_id = userid;
    UserActions.followUser(this.props.origin+ '/follower', follow_id);
    this.setState({isFollowing:true});
  },

  unFollowUser: function(userid) {
    var follow_id = userid;
    UserActions.unFollowUser(this.props.origin+ '/follower', follow_id);
    this.setState({isFollowing:false});
  },

  followClick: function(userid){
      event.preventDefault();
      if( this.state.currentUser !== null || sessionStorage.getItem('jwt') !== null ) {
      var currentUser_followings = [];
          for(var key in this.state.currentUser.followings) {
              currentUser_followings.push(this.state.currentUser.followings[key].id);
          }

          if(currentUser_followings.indexOf(userid) > -1) {
              this.unFollowUser(userid);
          } else {
              this.followUser(userid);
          }
      } else {
        // If user is not logged in and if he clicks on Follow User button
        // then forced user to login in to site to follow the user
        $(document).trigger("ReactComponent:TrakfireApp:showModal");
      }
  },

  showFlyOver: function(artist_id, user) {
        var self = this;
        var CurrentPost = this.props.post;
        var follow_text = "", className = "";
        var follow_btn_Html = '';

        if (sessionStorage.getItem('jwt') !== '' && ( this.state.currentUser !== undefined && this.state.currentUser !== null ) &&
            this.state.currentUser.id !== user.id) {
            if (this.state.currentUser.id !== null) {
                var currentUser_followings = [];

                for (var key in this.state.currentUser.followings) {
                    currentUser_followings.push(this.state.currentUser.followings[key].id);
                }
                if (currentUser_followings.indexOf(parseInt(user.id)) > -1) {
                    follow_text = "Following";
                    className = "button user-flyover-follow-btn tf-follow-button";
                } else {
                    follow_text = "Follow";
                    className = "button user-flyover-follow-btn btn-primary-outline tf-follow-button tf-background";
                }
                var follow_btn_Html = '<button class="btn ' + className + '">' + follow_text + '</button>'
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
                    '<img class="tf-author-img" src=' + user.img + '></img>',
                '</div>',
                '<div class = "media-object img-circle">',
                    '<div class="nd">' + user.username + '</div>',
                    '<div class="user-flyover-profile-bio">' + user.tbio + '</div>',
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
            $(".tf-follow-button").on('click', function(event) {
                //call the followClick function of current Component using 'self'
                event.stopPropagation();
                event.preventDefault();
                self.followClick(user.id);
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

    followClick: function(userid, artist_id){
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
  _onChange: function() {
    this.setState({currentUser: UserStore.getCurrentUser()});
  }
});

module.exports = PostDetailHeader;
