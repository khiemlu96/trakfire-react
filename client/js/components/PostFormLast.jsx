//PostForm

var React = require('react');
var PostActions = require('../actions/PostActions');
var ReactPropTypes = React.PropTypes;

var PostFormLast = React.createClass({

  propTypes: {
    onSubmit: ReactPropTypes.func,
    isSignedIn: ReactPropTypes.bool,
    advanceStep: ReactPropTypes.func,
    updateData: ReactPropTypes.func,
    data: ReactPropTypes.object
  }, 

  playPauseTrack: function() {
    console.log("PLAY THAT SHIT");
  }, 

  render: function() {
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
                 <img className="tf-thumbnail" src="/assets/img/trakfire_black_icon.png" />
               </a>
             </div>
             <div className="tf-post-item--rank">1</div>
             <div className="tf-post-item--info">
               <h5> MARIBOU STATE </h5>
               <small> Wallflowers </small>
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
         <div className="button button--big"> GO TO YOUR PROFILE </div>
     </div>
  	);
  }
});

module.exports = PostFormLast;