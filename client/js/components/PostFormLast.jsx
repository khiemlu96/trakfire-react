//PostForm

var React = require('react');
var PostActions = require('../actions/PostActions');
var SongStore = require('../stores/SongStore.js');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router');
var PostStore = require('../stores/PostStore');
var Link = Router.Link;

var SearchContentStyle = {
  border: '1px solid #2b2b2b'
};

function getAppState() {
  post = PostStore.getNewPost();
  return {
    post: post
  };
}
var PostFormLast = React.createClass({

  propTypes: {
    onSubmit: ReactPropTypes.func,
    isSignedIn: ReactPropTypes.bool,
    advanceStep: ReactPropTypes.func,
    updateData: ReactPropTypes.func,
    data: ReactPropTypes.object
  }, 

  getInitialState: function() {
    var obj = getAppState();
    return obj;
  }, 

  componentDidMount: function() {
    PostStore.addChangeListener(this._onChange);
    var postid = this.props;
    //this.getPost(postid);
  },

  componentDidUnmount: function() {
    PostStore.removeChangeListener(this._onChange);
  },

  playPauseTrack: function() {
    console.log("PLAY THAT SHIT");
  }, 
  
  renderTags: function() {
      t = this.state.post.tags;

      for(tag in t) {
          var tag = <div className="tf-tag tf-uppercase"> {t[tag].name} </div> 
          tags.push(tag);
      }

      return tags;
  },

  render: function() {
    var post = this.state.post;
    if (post != null)
    {
      	return (
            <div className="tf-newtrack-wrapper">
              <img src="/assets/img/nipple.png" className="nipple"></img>
              <div className="tf-newtrack-title"> SONG POSTED WITH SUCCESS </div>
              <p className=" tf-newtrack-description"> Be the first one to like it! </p>
              <div className="tf-new-post col-xs-12 col-md-4 col-sm-6">
                  <div className="tf-search-item-content" style={SearchContentStyle}>
                      <div className="tf-post-item--votes is-upvoted" ref="upvotes">
                          <span>
                            <b>&#9650;</b>
                          </span>
                          <br/>
                          <span ref="count">
                            <b>{post.vote_count}</b>
                          </span>
                      </div>
                      <div className="col-sm-6 tf-post-item--img">
                          <a href="#!" className="tf-post-play" onClick={ this.playPauseTrack}>
                              <img className="tf-search-item-img" src={ post.img_url ? post.img_url : "../assets/img/tf_placeholder.png" }/>
                          </a>
                          <div className="tf-overlay" onClick={ this.playPauseTrack}>
                          </div>
                          <div className="tpf-play-button" onClick={ this.playPauseTrack}>
                              <img src={ '../assets/img/player-play-white.svg'}/>
                          </div>
                          <div className="tpf-pause-button" onClick={ this.playPauseTrack}>
                              <img src={ '../assets/img/player-pause-white.svg'}/>
                          </div>
                      </div>
                      <div className="col-sm-6">
                          <div className="row tf-post-item--info">
                              <h5> { post.title } </h5>
                              <small> {post.artist } </small>
                          </div>
                      </div>
                      <div className="tf-search-item-auth-img" ref="author_img">
                          <span className="" ref="author_img">
                            <img className="author_img" src={ post.author_img ? post.author_img : "../assets/img/tf_placeholder.png" }/>
                          </span>
                      </div>
                      <div className="tf-post-item--tags">
                          {this.renderTags()}
                      </div>
                  </div>
              </div>
              <div className="tf-check-live-post">
                <Link to={ '/post/'+post.id}>
                  <div className="button button--big"> Check out you live post </div>
                </Link>
              </div>
            </div>
        );
    }
    else{
      return (<div></div>);
    }
  },

  _onChange: function() {
    this.setState(getAppState());
  }

});

module.exports = PostFormLast;