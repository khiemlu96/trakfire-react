var React = require('react');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router');
var PostActions = require('../actions/PostActions.js');
var PostStore = require('../stores/PostStore.js');
var UserStore = require('../stores/UserStore.js');
var UserPostGrid = require('./UserPostGrid.jsx');
var ProfileHeader = require('./ProfileHeader.jsx');
var ProfileBar = require('./ProfileBar.jsx');
var PostDetailHeader = require('./PostDetailHeader.jsx');
var Bootstrap = require('react-bootstrap');
var PostComment = require('./PostComment.jsx');
var TrakfirePlayerProgress = require('./TrakfirePlayerProgress.jsx');
var SoundCloudAudio = require('soundcloud-audio');
var scPlayer = new SoundCloudAudio('9999309763ba9d5f60b28660a5813440');
var Link = Router.Link;
var OverlayTrigger = Bootstrap.OverlayTrigger;
var Popover = Bootstrap.Popover;
var UserStyle = { maxWidth:480, backgroundColor: '#1c1c1c', border:'1px solid #2b2b2b'};
var UserFlyOver = require('./UserFlyOver.jsx');
var classNames = require('classnames');
var isUpvoted = classNames("tf-post-item--votes is-upvoted");
var isNotUpvoted = classNames("tf-post-item--votes");

function getAppState() {
  return {
    post: PostStore.getSinglePost(),
    currUser: UserStore.getCurrentUser(),
    isPlaying: false,
    toggle:false,
    hasUpvoted:false,
    isUpvoted:false,
    isLoggedIn: UserStore.isSignedIn()
  };
}

function getLength(arr) {
  var count = 0;
  for(key in arr){
    count++;
  }
  return count;
}

function getCommentLength(comments) {
  var comment_count = 0, reply_count = 0;
  for(key in comments){
    comment_count++;
    if(comments[key].replies) {
      var replies = comments[key].replies;
      for(key in replies) {
        reply_count++;
      }
    }
  }
  return {
    comment_count: comment_count, 
    reply_count: reply_count
  };
}

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

var PostDetailPage = React.createClass({

  propTypes : {
    onPostItemClick: ReactPropTypes.func, //Playability
    currStreamUrl: ReactPropTypes.string, 
    origin: ReactPropTypes.string,
    currUser: ReactPropTypes.object,
    isPlaying: false,
    isPaused: true,
    isActive: false,
    currTrack: null,
    currStreamUrl: null,
    currSongIdx: 0
  }, 

  getInitialState: function() {
    return getAppState();
  },

  componentDidMount: function() {
    PostStore.addChangeListener(this._onChange);
    var postid = this.props.params.id;
    this.getPost(postid);
    var user = this.state.user;
    if(user) {
      mixpanel.identify(postid);
      mixpanel.track("Arrived on profile "+user.handle+"'s page {"+postid+"}");
    }
  },

  componentWillUnmount: function() {
    PostStore.removeChangeListener(this._onChange);
  }, 

  getPost: function(postid) {
    PostActions.getPost(this.props.origin+'/post/'+postid, postid);
  }, 

  onPostListItemClick:function() {
    this.props.onPostItemClick(this.state.post.stream_url, this.state.post);
  },

  handleProgressClick: function(millipos) {
      this.onProgressClick(millipos);
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

  renderTags: function(post) {
    t = post.tags;
    tags = [];
    var i = 0;
    for(tag in t) {
      if(i === 4) {
        break;
      }
      var tag = <div className="tf-post-category">{"#" + t[tag].name}</div> 
      tags.push(tag);
      i++
    }
    return tags;
  },

  renderGenre: function(post) {
    var genres = post.genre;
    var html = [];
    for(g in genres) {
      var genre = <div className="tf-post-genre">{genres[g]}</div> 
      html.push(genre);
    }
    return html;
  },

  /* Function triggered by item thumbnail click */
  onPlayBtnClick: function() {
    var isPlaying = this.state.isPlaying;
    var isPaused = this.state.isPaused;
    var stream_url = this.state.post.stream_url;
    var track = this.state.post;
    if(!this.state.isActive) { this.setState({isActive:true}); }
    if(this.state.currTrack == null) {
      this.setState({
        currTrack : track,
        currSongIdx : track.id
      });
      //PostActions.setCurrentPost(idx);
    }
    if(!isPlaying) {
      scPlayer.play({streamUrl: stream_url});
      isPlaying = true;
      //SongActions.play();
      this.setState({
        isPlaying : isPlaying, 
        isPaused : isPaused, 
        currStreamUrl : stream_url, 
        currTrack : track,
        currSongIdx : track.id
      });
      //PostActions.setCurrentPost(track.id);
    } else if(isPlaying && stream_url == this.state.currStreamUrl) {
        scPlayer.pause();
        isPlaying = false;
        isPaused = true;
        //SongActions.pause();
        this.setState({isPlaying : isPlaying, isPaused : isPaused});     
    } else if(isPlaying && stream_url != this.state.currStreamUrl) {
        scPlayer.pause();
        scPlayer.play({streamUrl : stream_url});
        isPlaying = true;
        isPaused = false;  
        //SongActions.play();
        this.setState({
          isPlaying : isPlaying, 
          isPaused : isPaused, 
          currStreamUrl : stream_url, 
          currTrack : track,
          currSongIdx : track.id
        }); 
        //PostActions.setCurrentPost(track.id);    
    }
    
    if(isPlaying){
      mixpanel.track('Playing track', {
      'title': track.title,
      'id': track.id,
      'artist' : track.artist, 
      'filter' : this.state.genre,
      'sort' : this.state.sort
      });
    } else if(isPaused) {
      mixpanel.track('Paused track', {
      'title': track.title,
      'id': track.id,
      'artist' : track.artist, 
      'filter' : this.state.genre, 
      'sort' : this.state.sort 
      });      
    }
  },

  onPlayCtrlClick: function() {
    var isPlaying = this.state.isPlaying;
    var isPaused = this.state.isPaused;
    var stream_url = this.state.currStreamUrl;
    if(!isPlaying) {
      //console.log('playing');
      scPlayer.play({streamUrl: stream_url});
      isPlaying = true;
      isPaused = false;
      this.setState({isPlaying : isPlaying, isPaused : isPaused});
    } else if(isPlaying && !isPaused || isPlaying) {
      //console.log('pausing');
      scPlayer.pause();
      isPlaying = false;
      isPaused = true;
      this.setState({isPlaying : isPlaying, isPaused : isPaused});
    }    
  },

  onProgressClick: function(millipos) {
    scPlayer.seekTo(millipos);
  },
  
  hasUpvoted: function(post) {
    if(this.state.isLoggedIn && post.id !== undefined){
      //console.log("POST TO UPVOTE", post);
      var exists = post.voters.indexOf(this.props.currUser.id);
      //console.log(post.id, exists);
      return (exists != -1) ? true : false;
    }
  },

  upvote: function() {
    var post = this.state.post;
    mixpanel.identify(this.state.currUser.id);
    mixpanel.track("Upvote", {
      "Title" : post.title,
      "id" : post.id,
      "artist" : post.artist,
      "vote count" : post.vote_count
    });

    if(this.state.isLoggedIn && !this.hasUpvoted(post)){
      PostActions.upvote(this.props.origin+'/votes', post.id);
      var count = this.refs.count.getDOMNode();
      var upvotes = this.refs.upvotes.getDOMNode();
      upvotes.className = isUpvoted;
      count.className = "";

      this.setState({hasUpvoted:true});
    } else if(!this.state.isLoggedIn) {
      this.props.showModal(true);
    }
  },

  renderPost: function(){

    var post = this.state.post;
    var active = this.state.isActive;
    var playing = this.state.isPlaying;
    var currTrack = this.state.currTrack;
    var upvoted = this.hasUpvoted(post);
    var postDetailImage = post.img_url_lg;
    var postAuthorImage = post.author_img;

    var tfPlayer = <TrakfirePlayerProgress
                            duration={ post ? parseInt(post.duration) : 0 }
                            isPlaying={this.state.isPlaying}
                            onProgressClick={this.handleProgressClick}
                            toggle={this.state.toggle} 
                            showTrackDuration={true} />;

    var play =  <div className = "tpf-play-button"  onClick={this.onPlayBtnClick} >
                    <img src = {'../assets/img/player-play-white.svg'}/>  
                </div>;
    var pause = <div className = "tpf-pause-button"  onClick={this.onPlayBtnClick} >
                     <img src = {'../assets/img/player-pause-white.svg'}/>  
                </div>;

    return (
      <PostDetailHeader post={post}/>
    );
  },

  renderVotes: function(post) {
    var votes = post.votes;
    var voteHtml = [];
    for(key in votes) {
      if(votes[key].user.id != post.author_id) {
        voteHtml.push(
          /*<a className="tf-link" href={"/profile/" + votes[key].user.id} >
            <img className="tf-author-img" src={votes[key].user.img} />
          </a>*/
          <Link to={'/profile/'+votes[key].user.id}> 
            <UserFlyOver user = {votes[key].user} origin={this.props.origin} />
          </Link>
        );
      }                              
    }
    return (voteHtml);
  },

  renderComments: function(post){
    if(post.id !== undefined && post !== null) {
      return (
        <PostComment 
          post = {post} 
          post_id = {post.id}
          origin = {this.props.origin} 
          currUser = {this.state.currUser} />
        );
    } else {
      return (<div></div>);
    }    
  },

  renderCommentCount: function(post){
    var count = getCommentLength(post.comments);
    return <div className='container tf-comment-count-section'>
              <span><h3><b>{count.comment_count} Comments, {count.reply_count} Replies</b></h3></span>
          </div>;
  },
  /**
   * @return {object}
   */
  render: function() {
   
    var post = this.state.post;
    <div> Loading </div>
    return (
      <div>
        <div>
         {this.renderPost()}
        </div>
        <div>
          {this.renderCommentCount(post)}
        </div>
        <div>
         {this.renderComments(post)}
        </div>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getAppState());
  }

});

module.exports = PostDetailPage;

