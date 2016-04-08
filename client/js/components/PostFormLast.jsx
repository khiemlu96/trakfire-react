//PostForm

var React = require('react');
var PostActions = require('../actions/PostActions');
var SongStore = require('../stores/SongStore.js');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router');
var PostStore = require('../stores/PostStore');
var Link = Router.Link;
var isInitialLoad = false;

var SearchContentStyle = {
  border: '1px solid #2b2b2b'
};

function getAppState() {
  return {
    error: null,
    post: null,
    loading: true
  };
}
var PostFormLast = React.createClass({

  propTypes: {
    onSubmit: ReactPropTypes.func,
    isSignedIn: ReactPropTypes.bool,
    advanceStep: ReactPropTypes.func,
    updateData: ReactPropTypes.func,
    data: ReactPropTypes.object,
    reset: ReactPropTypes.func,
    isInitialLoad: ReactPropTypes.bool
  }, 

  getInitialState: function() {
    var obj = getAppState();
    return obj;
  },
  componentWillMount: function() {
    if(this.props.isInitialLoad === false) {
      this.props.reset();
    }
  },

  showError: function() {
    this.props.isInitialLoad = false;
    this.setState({
      loading: false,
      error: PostStore.getError()
    });
    console.log("Test 1 showError");
  },

  showTrackData: function() {
    this.props.isInitialLoad = false;
    this.setState({ 
      loading: false, 
      post : PostStore.getNewPost()
    });
  },

  componentDidMount: function() {
    //PostStore.addChangeListener(this._onChange);
    var postid = this.props;
    $(document).on("ReactComponent:PostFormLast:showTrackData", this.showTrackData);
    $(document).on("ReactComponent:PostFormLast:showError", this.showError);
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
      tags = [];
      for(tag in t) {
          var tag = <div className="tf-tag tf-uppercase"> {t[tag].name} </div> 
          tags.push(tag);
      }

      return tags;
  },

  hide: function() {
      document.getElementById("PostForm").style.display = 'none';
      this.props.reset();
      return true;
  },

  render: function() {
      var post = this.state.post; 
      if (post != null && this.state.loading !== true)
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
                  <Link to={ '/post/' + post.id} onClick={this.hide}>
                    <div className="button button--big"> Check out you live post </div>
                  </Link>
                </div>
              </div>
          );
      } else if(this.state.loading == true){
          return (
              <div className="tf-newtrack-loader">
                  <center>
                    <div className ="loader-img-container">
                      <img className ="loader-img" src = "/assets/img/loading_spinner.gif"></img>
                    </div>
                  </center>
              </div>
          );
      } else if(this.state.error !== null){
          var error = this.state.error;
          var errorMsg = error.response;

          if(error.status === 422 && error.statusText === "Unprocessable Entity") {
              errorMsg = "This url has already been taken";
          }
          return (
              <div className="tf-newtrack-error">
                  <div className="tf-newtrack-error-header">
                      <center><h2>Error!!!</h2></center>
                  </div>
                  <div className="tf-newtrack-error-content">
                      <center><h4>{errorMsg}</h4></center>
                  </div>
              </div>
          );
      }
  },

  /*_onChange: function() {   

  }
*/
});

module.exports = PostFormLast;