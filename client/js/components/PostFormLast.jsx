//PostForm

var React = require('react');
var PostActions = require('../actions/PostActions');
var SongStore = require('../stores/SongStore.js');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router');
var Link = Router.Link;
function getAppState() {

  post = SongStore.getCurrentSong();
  console.log("IN SONGS APP STATE");
  console.log(post);
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
    console.log(obj);
    return obj;
  }, 

  componentDidMount: function() {
    SongStore.addChangeListener(this._onChange);
    var postid = this.props;
    //this.getPost(postid);
    
  },

  componentDidUnmount: function() {
    SongStore.removeChangeListener(this._onChange);
  },

  playPauseTrack: function() {
    console.log("PLAY THAT SHIT");
  }, 

  render: function() {
    console.log(this.state.post);
    var post = this.state.post;
    if (post != null)
    {
      	return (
         <div className="tf-newtrack-wrapper"> 
            <img src="/assets/img/nipple.png" className="nipple"></img>
             <div className="tf-newtrack-title"> SONG POSTED WITH SUCCES </div>
             <p className="tf-newtrack-description"> Now go ahead and be the first one to upvote your posted song </p>
             <div className="tf-post-grid">
               <div className="tf-post-item-content">
                 <div className="tf-post-item--votes">
                 1
                 </div>
                 <div className="tf-post-item--img">
                   <a href="#!" className="tf-post-play" onClick={this.playPauseTrack}>
                     <img className="tf-thumbnail" src={post.img_url} />
                   </a>
                 </div>
                 <div className="tf-post-item--rank">1</div>
                 <div className="tf-post-item--info">
                   <h5> {post.title} </h5>
                   <small> {post.artist} </small>
                 </div>
                 <div className="tf-post-item--tags">
                   <div className="tf-tag"> 
                     HIP-HOP
                   </div> 
                   <div className="tf-tag"> 
                     REMIX
                   </div> 
                   <div className="tf-tag"> 
                     O
                   </div> 
                 </div>
             </div>
             </div>
             <Link to={'/post/'+post.id}><div className="button button--big"> Check out you live post </div></Link>  
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