var React = require('react');
var ReactPropTypes = React.PropTypes;
var PostActions = require('../actions/PostActions.js');
var PostStore = require('../stores/PostStore.js');
var UserStore = require('../stores/UserStore.js');
var UserPostGrid = require('./UserPostGrid.jsx');
var ProfileHeader = require('./ProfileHeader.jsx');
var ProfileBar = require('./ProfileBar.jsx');
var Bootstrap = require('react-bootstrap');
var moment = require('moment');

var OverlayTrigger = Bootstrap.OverlayTrigger;
var Popover = Bootstrap.Popover;
var UserStyle = { maxWidth:480, backgroundColor: '#1c1c1c', border:'1px solid #2b2b2b'};

function getAppState() {
  return {
    post: PostStore.getSinglePost(),
    isPlaying: false
  };
}

function getLength(a) {
  var i = 0;
  for(key in a){
    i++;
  }
  return i;
}

var ProfilePage = React.createClass({

  propTypes : {
    onPostItemClick: ReactPropTypes.func, //Playability
    currStreamUrl: ReactPropTypes.string, 
    origin: ReactPropTypes.string
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

  postComment: function() {
    var postid = this.props.params.id;
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
                          <h6 > Posted By </h6>
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
                            <span><b>3 &nbsp;friends</b></span>
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

  renderSingleComment: function(comment) {
    return <div className="row tf-parent-comment-profile">
              <div className="tf-comment-auther-panel">
                <a className="tf-link" href={"/profile/"+comment.user.id} >
                  <img className="tf-author-img" src={comment.user.img} />
                </a>
              </div>
              <div>
                <div className="">
                  <a className="tf-profile-link"> {comment.user.username}</a> - Trakfire Founder.
                </div>
                <div className="col-md-8 tf-comment-detail">{comment.comment_detail}</div>
              </div>
              <div className="tf-comment-time">{moment(comment.created_at).fromNow()}</div>
            </div>;
  },

  renderComments: function(post){
    var comments = post.comments;
    var commentHtml = [];
    if( getLength(comments) > 0 ) {
      for(key in comments) {
        commentHtml.push(this.renderSingleComment(comments[key]));
      }
    }

    return  <div className='tf-current-trak-comment-panel container'>
              <div className="tf-current-trak-inner col-md-12">
                <div className="col-sm-12 tf-comment-add" >
                  <div className="tf-comment-profile">
                    <a href="/profile/2" className="tf-link">
                      <img src="https://pbs.twimg.com/profile_images/668573362738696193/g0-CxwLx_400x400.png" className="tf-author-img"> </img>
                    </a>
                  </div>
                  <input ref="comment" className="tf-soundcloud-link" type="text" placeholder="Write a Comment..."></input>
                  <div className="button tf-comment-button" onClick = {this.postComment}> Add Comment </div>
                </div>
                <div className="tf-comment-list-panel col-md-12">
                  {commentHtml}
                </div>    
              </div>  
            </div>;
  },

  renderCommentCount: function(post){
    return <div className='container'>
            <div className="col-md-12">
              <span><h3><b>{getLength(post.comments)} Comments, 2 Replies</b></h3></span>
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

