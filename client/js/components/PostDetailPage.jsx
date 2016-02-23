var React = require('react');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router');
var PostActions = require('../actions/PostActions.js');
var PostStore = require('../stores/PostStore.js');
var UserStore = require('../stores/UserStore.js');
var UserPostGrid = require('./UserPostGrid.jsx');
var ProfileHeader = require('./ProfileHeader.jsx');
var ProfileBar = require('./ProfileBar.jsx');
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

function getAppState() {
  return {
    post: PostStore.getSinglePost(),
    currUser: UserStore.getCurrentUser(),
    isPlaying: false,
    toggle:false
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

var ProfilePage = React.createClass({

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

  componentDidUnmount: function() {
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

  renderPost: function(){

    var post = this.state.post;
    console.log("IMG URL LG", post);
    var active = this.state.isActive;
    var playing = this.state.isPlaying;
    var currTrack = this.state.currTrack;

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

    return <div className='tf-current-trak-top-panel container'>
            <div className="tf-current-trak col-md-12">
              <div className="tf-current-trak-content">
                <a className="tf-trak-detail-vote" href="/post/11">
                  <div className="tf-post-item--votes" >
                    <span className="" ref="count">{post.vote_count}</span>
                  </div>
                </a>
                <div className="tf-post-item--img col-md-3">
                  <div className="tf-trak-img">
                    <a href="#!" className="tf-post-play" onClick={this.onPlayBtnClick} >
                      <img className="tf-trak-detail-thumbnail" src={post.img_url_lg} />
                    </a>                    
                    {!this.state.isPlaying ? play : pause}
                    <div className="tf-player-controls-wrap">                        
                        {active ? tfPlayer : ''}
                    </div>
                  </div>                  
                </div>
                <div className="tf-post-title col-md-6">
                  <div className="tf-title"><b>{post.title}</b></div>
                  <div className="tf-author"><small>{post.artist}</small></div>
                </div>
                <div className="col-md-3 tf-key-container">
                  <div className="col-md-6 tf-post-genre-container">{this.renderGenre(post)}</div>
                  <div className="col-md-6 tf-post-tag-container">{this.renderTags(post)}</div>
                </div>
              </div>
              <div className="tf-current-trak-vote-section col-md-12">
                <div className="col-md-3">
                  <div className="col-md-2"></div>
                  <div className="col-md-2">
                    <div className="tf-auther-panel">
                      {/*<a className="tf-link" href="/profile/2" >*/}
                      <Link to={'/profile/'+post.author_id}>  
                        <img className="tf-author-img" src={post.author_img}></img>
                      </Link>
                    </div>
                  </div>
                  <div className="col-md-8">
                      <b>Song</b> posted By <br/>
                      <a className="tf-profile-link">{post.author_name}</a>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="col-md-10">
                    <div className="">
                      <div >
                        <i className="glyphicon glyphicon-fire tf-social-icons"></i> 
                        <span><b>{voteCount = getLength(post.votes)} &nbsp;friends</b></span>
                        <span>&nbsp;&nbsp;upvoted</span>
                      </div>
                      <div>
                        <div className="tf-auther-panel">         
                          {this.renderVotes(post)}                     
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  {/*<div className="col-md-12">
                    <div className="tf-current-trak-second-panel">
                      <div >
                        <i className="glyphicon glyphicon-fire tf-social-icons"></i> 
                        <span><b>3 &nbsp;Firestarters</b></span>
                        <span>&nbsp;&nbsp;upvoted</span>
                      </div>
                      <div>
                        <div className="tf-auther-panel">
                          <a className="tf-link" href="/profile/2" >
                            <img className="tf-author-img" src="https://pbs.twimg.com/profile_images/668573362738696193/g0-CxwLx_400x400.png" />
                          </a>
                          <a className="tf-link" href="/profile/2" >
                            <img className="tf-author-img" src="https://pbs.twimg.com/profile_images/668573362738696193/g0-CxwLx_400x400.png" />
                          </a>
                          <a className="tf-link" href="/profile/2" >
                            <img className="tf-author-img" src="https://pbs.twimg.com/profile_images/668573362738696193/g0-CxwLx_400x400.png" />
                          </a>
                          
                          <OverlayTrigger trigger="click" rootClose placement="bottom" 
                            overlay={ 
                                      <Popover className="tf-user-list-popup" id="tf-post-detail-popup" style={UserStyle}>
                                        <div>
                                          <div className="">
                                            <a className="tf-profile-link"> Arjun Mehta</a> - Trakfire Founder.
                                            <span className="tf-comment-time">4 hours ago</span>
                                          </div>
                                        </div>
                                        <hr></hr>
                                        <div>
                                          <div className="">
                                            <a className="tf-profile-link"> Arjun Mehta</a> - Trakfire Founder.
                                            <span className="tf-comment-time">4 hours ago</span>
                                          </div>
                                        </div>
                                      </Popover>
                                    }>
                            <span className="tf-firestarters-upvotes-count"><b>123+</b></span>
                          </OverlayTrigger>
                        </div>
                      </div>
                    </div>
                  </div>*/}
                </div>
                <div className="col-md-2 right">
                  {/*<div>
                                      <span><b>Share</b></span>
                                      <span>&nbsp;&nbsp;this song</span>
                                    </div>
                                    <div className="tf-trak-detail-wrapper">
                                      <img className="tf-social-icons" src={'/assets/img/twitter_footer.svg'} /> 
                                      <img className="tf-social-icons" src={'/assets/img/facebook_footer.svg'} /> 
                                      <img className="tf-social-icons tumbler-logo" src={'/assets/img/tumbler.png'} /> 
                                    </div>*/}
                  <a href={this.buildTweet(post)}><div className="button btn-share-song"><img className="tf-social-icons" src={'/assets/img/twitter_footer.svg'} /> Tweet This Song</div></a>
                </div>
              </div>

            </div>
          </div>;
  },

  renderVotes: function(post) {
    var votes = post.votes;
    var voteHtml = [];
    for(key in votes) {
      voteHtml.push(
        /*<a className="tf-link" href={"/profile/" + votes[key].user.id} >
          <img className="tf-author-img" src={votes[key].user.img} />
        </a>*/
        <Link to={'/profile/'+votes[key].user.id}> 
          <UserFlyOver user = {votes[key].user} origin={this.props.origin} />
        </Link>
      );                              
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
            <div className="col-md-12">
              <span><h3><b>{count.comment_count} Comments, {count.reply_count} Replies</b></h3></span>
            </div>
          </div>;
  },
  /**
   * @return {object}
   */
  render: function() {
   
    var post = this.state.post;
    <div> Loading 
    
    </div>
    return (
      <div>
        <div> 
          <ProfileBar showEditLink={false}/>
        </div>
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

module.exports = ProfilePage;

