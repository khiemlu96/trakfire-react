//PostForm

var React = require('react');
var PostActions = require('../actions/PostActions');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router');
var PostFormFirst = require('./PostFormFirst.jsx');
var PostFormSecond = require('./PostFormSecond.jsx');;
var PostFormLast = require('./PostFormLast.jsx');
var BackBar = require('./ProfileBar.jsx');

var Link = Router.Link;
var PostForm = require('./PostForm.jsx');
var Bootstrap = require('react-bootstrap');
var Tooltip = Bootstrap.Tooltip;
var OverlayTrigger = Bootstrap.OverlayTrigger;
var Popover = Bootstrap.Popover;
var SoundCloudAudio = require('soundcloud-audio');
var PostStyle = { top:38, left:660,maxWidth:'80%', backgroundColor: '#1c1c1c', border:'1px solid #2b2b2b', position:'Fixed'};
var SpanStyle = { float:'left'};
var _submit = false;
var _data = {};

var PostForm = React.createClass({

  propTypes: {
    onSubmit: ReactPropTypes.func,
    isSignedIn: ReactPropTypes.bool,
    closeModal: ReactPropTypes.func,
    showModal: ReactPropTypes.bool
  },

  getInitialState: function() {
  	return { step : 1 };
  }, 

  getDefaultProps: function() {

    return {data:{}};
  }, 
  componentDidMount: function() {
    mixpanel.track("Arrived at PostForm");
  },
  advanceStep: function() {
    console.log("advancing step");
  	var currStep = this.state.step;
  	var nextStep;
  	if(currStep == 2) {
  		nextStep = 1;
  	} else {
  		nextStep = currStep+=1;
  	}
  	this.setState({step : nextStep})
    console.log("ADVANCING STEP");
    console.log(this.state);
  }, 

  goBack: function() {
    console.log("regressing step");
    var currStep = this.state.step;
    var nextStep;
    if(currStep == 1) {
      nextStep = 1;
    } else {
      nextStep = currStep-=1;
    }
    this.setState({step : nextStep})    
    console.log("REGRESSING STEP");
    console.log(this.state);
  }, 

  updateData: function(data) {
    this.props.data = data;
  }, 

  submit: function(data) {
    console.log("submitting");
    PostActions.writePost(this.props.origin+'/posts', data);
    console.log("pushed.............");
    this.setState({step : 4})
  }, 

  render: function() {
  	var postStep;
  	var step = this.state.step;
    console.log("HI DATA");
    console.log(this.props.data);
  	switch(this.state.step) {
  		case 1:
  			postStep = <PostFormFirst 
                      advanceStep={this.advanceStep}
                      updateData={this.updateData}
                      data={this.props.data}/>
  		break;
   		case 2:
  			postStep = <PostFormSecond 
                      advanceStep={this.advanceStep}
                      updateData={this.updateData}
                      goBack={this.goBack}
                      data={this.props.data}
                      submit={this.submit}/>
  		break;
      case 4:
        postStep = <PostFormLast 
                      advanceStep={this.advanceStep}
                      updateData={this.updateData}
                      data={_data}/>
      break;
  		default:
  	}

  	return (
  	  <span>
        <span className="tf-nav-buffer">
  	  	  
        <OverlayTrigger trigger="click" rootClose placement="bottom"
           overlay={ 
                     <Popover style={PostStyle} id="PostForm" className="tf-post-trak-popup"> 
                       <span style={SpanStyle}>
                         {postStep}
                       </span>
                     </Popover>
                   }>
           <a>POST TRAK</a>
         </OverlayTrigger>
        </span>
	   </span>
  	);
  }
});

module.exports = PostForm;



/*<!-- post/create track step 1: hide everything from align-left untill the 
    link is pasted, enable the button when all fields are filled (the class now
    has a .is-disabled class)
    <div class="tf-newtrack-wrapper"> 
      <img src="/assets/img/nipple.png" class="nipple">
        <div class="tf-newtrack-title"> ADD A SONG </div>
        <p class="tf-newtrack-description"> Post a link to a song on Soundcloud or Youtube </p>
        <input type="text" class="tf-soundcloud-link" placeholder="paste Soundcloud url here"> <div class="button button--add"> ADD </div>
        <div class="align-left"> 
          <div class="tf-newtrack-img"> 
            <img src="https://upload.wikimedia.org/wikipedia/en/f/f0/My_Beautiful_Dark_Twisted_Fantasy.jpg"> 
          </div>
          <div class="tf-newtrack-form"> 
            <label> ARTIST </label> 
            <input type="text">  
            <label> TITLE </label> 
            <input type="text"> 
          </div>
        </div>
        <div class="button button--big is-disabled"> CONTINUE TO THE LAST STEP </div>
    </div>
    --> 

<!--     
  post/create/new trac step 2 radio button logic should be added in the JS, remove .is-disabled class when are fields are filled
<div class="tf-newtrack-wrapper"> 
  <img src="/assets/img/nipple.png" class="nipple">
        <div class="tf-newtrack-title tf-newtrack-title--details"> ADD DETAILS </div>
    
          <div class="align-left"> 
          <div class="tf-newtrack-img tf-newtrack-img--small"> 
            <img src="https://upload.wikimedia.org/wikipedia/en/f/f0/My_Beautiful_Dark_Twisted_Fantasy.jpg"> 
          </div>
          <div class="tf-newtrack-form"> 
            <div class="title"> 
              MARIBOU STATE 
            </div>
            <div class="artist"> 
              Wallflowers 
            </div>
          </div>
          <div class="button button--edit"> 
            EDIT 
          </div> 
        </div>
        <div class="align-left"> 
          <div class="form-title"> GENRE </div>
          <input type="checkbox" class="tf-checkbox" name="hiphop" id="hiphop" value="hiphop">
          <label class="tf-checkbox-label" for="hiphop">Hip-hop</label>
          <input type="checkbox" class="tf-checkbox" id="edm" name="edm" value="edm">
          <label class="tf-checkbox-label" for="edm" >EDM</label> <br> <br> <br>
          <input type="checkbox" class="ownsong-checkbox" id="ownsong" name="ownsong" value="ownsong"> 
          <label class="ownsong-label" for="ownsong" >This is my own song</label>
        </div>
        <div class="button button--big is-disabled"> POST SONG </div
    </div>
 -->

 <!--   post/create/new trac step 3
 <div class="tf-newtrack-wrapper"> 
    <img src="/assets/img/nipple.png" class="nipple">
     <div class="tf-newtrack-title"> SONG POSTED WITH SUCCES </div>
     <p class="tf-newtrack-description"> Now go ahead and be the first one to upvote your posted song </p>
     <div class="tf-post-grid">
       <div class="tf-post-item-content">
         <div class="tf-post-item--votes">
         1
         </div>
         <div class="tf-post-item--img">
           <a href="#!" class="tf-post-play" onClick={this.playPauseTrack}>
             <img class="tf-thumbnail" src="https://upload.wikimedia.org/wikipedia/en/f/f0/My_Beautiful_Dark_Twisted_Fantasy.jpg" />
           </a>
         </div>
         <div class="tf-post-item--rank">1</div>
         <div class="tf-post-item--info">
           <h5> MARIBOU STATE </h5>
           <small> Wallflowers </small>
         </div>
         <div class="tf-post-item--tags">
           <div class="tf-tag"> 
             HIP-HOP
           </div> 
           <div class="tf-tag"> 
             REMIX
           </div> 
           <div class="tf-tag"> 
             O
           </div> 
         </div>
     </div>
     </div>
     <div class="button button--big"> GO TO YOUR PROFILE </div>
 </div> -->*/