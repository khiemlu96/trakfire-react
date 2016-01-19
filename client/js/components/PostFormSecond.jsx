//PostForm

var React = require('react');
var Link = require('react-router').Link;
var PostActions = require('../actions/PostActions');
var ReactPropTypes = React.PropTypes;

var PostFormSecond = React.createClass({

  propTypes: {
    onSubmit: ReactPropTypes.func,
    isSignedIn: ReactPropTypes.bool,
    advanceStep: ReactPropTypes.func,
    updateData: ReactPropTypes.func,
    data: ReactPropTypes.object,
    goBack: ReactPropTypes.func, 
    submit: ReactPropTypes.func
  }, 

  getInitialState: function() {
    return {hasGenre:false};
  }, 

  componentDidMount: function() {
    mixpanel.track("PostForm step 2");
  },

  goBack: function() {
    this.props.goBack();
  }, 

  addTagsAndGenre: function() {
    var data = this.props.data.post;
    var e = this.refs.edm.getDOMNode();
    var h = this.refs.hiphop.getDOMNode();
    var v = this.refs.vocals.getDOMNode();
    var genres = [e, h, v];
    var genre = "";
    
    if(e.checked) {
      genre += (e.value + " ");
    } 
    if(h.checked) {
      genre += (h.value + " ");
    }
    if(v.checked) {
      genre += (v.value + " ");
    }
    console.log("genre", genre);

    var tags = this.refs.tags.getDOMNode().value;

    console.log(tags);

    data["all_tags"] = tags;
    data['genre'] = genre;
    //console.log("add genre to data", data, "add tags", data.tags);

    //this.setState({hasGenre:true});
  }, 

  setGenre: function() {
    this.setState({hasGenre:true});
  },

  submit: function() {
    console.log("invoke callback to submit");
    this.addTagsAndGenre();
    var data = this.props.data;
    console.log("POST DATA TO SUBMIT", data);
    this.props.submit(JSON.stringify(data));
    mixpanel.track('Complete PostForm');
  }, 

  render: function() {
    var data = this.props.data.post;
    console.log(data);
    var disabled = "button button--big is-disabled";
    var enabled = "button button--big";
    console.log("DATA IN FORM SUBMIT=================");
    console.log(data);    
  	return (
    <div className="tf-newtrack-wrapper"> 
      <img src="/assets/img/nipple.png" className="nipple"></img>
            <div className="tf-newtrack-title tf-newtrack-title--details"> ADD DETAILS </div>
        
              <div className="align-left"> 
                <div className="tf-newtrack-img tf-newtrack-img--small"> 
                  <img src={data.img_url}></img>
                </div>
                <div className="tf-newtrack-form"> 
                  <div className="title"> 
                    {data.title}
                  </div>
                  <div className="artist"> 
                    {data.artist}
                  </div>
                </div>
                <div className="button button--edit" onClick={this.goBack}> 
                  BACK 
                </div> 
            </div>
            <div className="align-left"> 
              <div className="form-title"> GENRE </div>
              <input type="checkbox" ref="hiphop" className="tf-checkbox" name="hiphop" id="hiphop" value="HipHop"></input>
              <label className="tf-checkbox-label" htmlFor="hiphop" onClick={this.setGenre}>Rhymes</label>
              <input type="checkbox" ref="vocals" className="tf-checkbox" id="vocals" name="vocals" value="Vocals" onClick={this.setGenre}></input>
              <label className="tf-checkbox-label" htmlFor="vocals" >Vocals</label>
              <input type="checkbox" ref="edm" className="tf-checkbox" id="edm" name="edm" value="electronic" onClick={this.setGenre}></input>
              <label className="tf-checkbox-label" htmlFor="edm" >Electronic</label> <br></br> <br></br> <br></br>
              {/*<input type="checkbox" className="ownsong-checkbox" id="ownsong" name="ownsong" value="ownsong"></input> 
              <label className="ownsong-label" for="ownsong" >This is my own song</label>*/}
              <label htmlFor="tags">#TAGS (optional - comma separated)</label>
              <input type="text" name="tags" ref="tags"></input>
            </div>
            <div className={this.state.hasGenre ? enabled : disabled} ref="continue" onClick={this.submit}> POST SONG </div>
        </div>
  	);
  }
});

module.exports = PostFormSecond;



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