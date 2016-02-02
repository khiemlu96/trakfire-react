var React = require('react');
var ReactPropTypes = React.PropTypes;
var PostActions = require('../actions/PostActions.js');
var PostStore = require('../stores/PostStore.js');
var UserStore = require('../stores/UserStore.js');
var UserPostGrid = require('./UserPostGrid.jsx');
var ProfileHeader = require('./ProfileHeader.jsx');
var ProfileBar = require('./ProfileBar.jsx');
var Bootstrap = require('react-bootstrap');
var PostComment = require('./PostComment.jsx');

var OverlayTrigger = Bootstrap.OverlayTrigger;
var Popover = Bootstrap.Popover;
var UserStyle = { maxWidth:480, backgroundColor: '#1c1c1c', border:'1px solid #2b2b2b'};

function getAppState() {
  return {
    post: PostStore.getSinglePost(),
    currUser: UserStore.getCurrentUser(),
    isPlaying: false
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

var ProfilePage = React.createClass({

  propTypes : {
    onPostItemClick: ReactPropTypes.func, //Playability
    currStreamUrl: ReactPropTypes.string, 
    origin: ReactPropTypes.string,
    currUser: ReactPropTypes.object
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

  onPostListItemClick:function(pid) {
    this.props.onPostItemClick(this.state.post.stream_url, this.state.post, pid);
  },

  renderTags: function(post) {
    t = post.tags;
    tags = [];
    for(tag in t) {
      var tag = <div className="tf-post-category">{t[tag].name}</div> 
      tags.push(tag);
    }

    return tags;
  },

  renderPost: function(){

    var post = this.state.post;

    return <div className='tf-current-trak-top-panel container'>
            <div className="tf-current-trak col-md-12">
              <div className="tf-current-trak-content">
                <a className="tf-trak-detail-vote" href="/post/11">
                  <div className="tf-post-item--votes" >
                    <span className="tf-hide" >1</span>
                  </div>
                </a>
                <div className='' ref="upvotes" >
                  <span className= '' ref="count"> </span>
                </div>
                <div className="tf-post-item--img"> 
                  <div className="tf-trak-img">
                    <a href="#!" className="tf-post-play" onClick={this.onPostListItemClick} >
                      <img className="tf-trak-detail-thumbnail" src={post.img_url} />
                    </a>
                    <div className = "tf-overlay"  onClick={this.onPostListItemClick} >
                    </div>  
                    <div className = "tpf-play-button"  onClick={this.onPostListItemClick} >
                        <img src = {'../assets/img/player-play-white.svg'}/>  
                    </div>  
                    <div className = "tpf-pause-button"  onClick={this.onPostListItemClick} >
                         <img src = {'../assets/img/player-pause-white.svg'}/>  
                    </div>
                  </div>
                  <div className="col-md-3"></div>
                  <div className="col-md-6">
                    <div className="tf-post-title">
                      <div><b>{post.title}</b></div>
                      <div><small>{post.artist}</small></div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="col-md-6">
                      <div className="tf-post-category">{this.renderTags(post)}</div>
                    </div>
                  </div>
                </div>
                <div className="tf-post-item--rank"></div>
                <hr></hr>
                <div className="col-md-12">
                    <div className="col-md-3">
                      <div className="col-md-2">
                        <div className="tf-auther-panel">
                          <a className="tf-link" href="/profile/2" >
                            <img className="tf-author-img" src={post.author_img} />
                          </a>
                        </div>
                      </div>
                      <div className="col-md-10">
                        <div>
                          <h6 > <b>Song</b> posted By </h6>
                          <a className="tf-profile-link">{post.author_name}</a>
                        </div>
                        <div className="tf-current-trak-first-panel">
                          <div >
                            <span><b>Share</b></span>
                            <span>&nbsp;&nbsp;this song</span>
                          </div>
                          <div className="tf-trak-detail-wrapper">
                            <img className="tf-social-icons" src={'/assets/img/twitter_footer.svg'} /> 
                            <img className="tf-social-icons" src={'/assets/img/facebook_footer.svg'} /> 
                            <img className="tf-social-icons tumbler-logo" src={'/assets/img/tumbler.png'} /> 
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="col-md-10">
                        <div className="tf-current-trak-second-panel">
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
                      <div className="col-md-12">
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
                      </div>
                    </div>
                  </div>
                <div className="tf-post-item--author">     </div>
                <div className="tf-post-item--tags">       </div>

              </div>

            </div>
          </div>;
  },

  renderVotes: function(post) {
    var votes = post.votes;
    var voteHtml = [];
    for(key in votes) {
      voteHtml.push(
        <a className="tf-link" href={"/profile/" + votes[key].user.id} >
          <img className="tf-author-img" src={votes[key].user.img} />
        </a>
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
    return <div className='container'>
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
          <ProfileBar/>
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

