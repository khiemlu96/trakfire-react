//PostForm

var React = require('react');
var UserStore = require('../stores/UserStore');
var PostActions = require('../actions/PostActions');
var ReactPropTypes = React.PropTypes;
var SoundCloudAudio = require('soundcloud-audio');
var _submit = false;
var _data = {};
var _didLoadData = false;

var PostFormFirst = React.createClass({

  propTypes: {
    onSubmit: ReactPropTypes.func,
    isSignedIn: ReactPropTypes.bool,
    advanceStep: ReactPropTypes.func,
    updateData: ReactPropTypes.func, 
    data: ReactPropTypes.object
  }, 

  getInitialState: function() {
    return {dataDidLoad:false, isLoading:false, user:UserStore.getCurrentUser()};
  }, 
  componentDidMount: function() {
    mixpanel.track("PostForm step 1");
  },
  handleClick: function() {
  	console.log('handling a users click!');
  	if(!_submit) {
  		//this.fetchScData();
      console.log("we didnt catch the data");
  	} else {
  		_data['post']['title'] = this.refs.title_field.getDOMNode().value;
  		_data['post']['artist'] = this.refs.artist_field.getDOMNode().value;
      if(this.state.user.canPost)
        _data['post']['status'] = "approved";
      else
        _data['post']['status'] = "pending";
  		console.log(_data)
  		//this.props.onSubmit(JSON.stringify(_data));
      this.props.updateData(_data);
      //this.props.data = _data;
      this.props.advanceStep();
  	}
  }, 

  fillFields: function() {
    var title = this.refs.title_field.getDOMNode();
    var artist = this.refs.artist_field.getDOMNode();  
  }, 

  fetchScData: function(url) {
    if(!this.state.isLoading) {
      this.addLoading();
      console.log("FORM STATE", this.state);
    	var url = this.refs.url_field.getDOMNode().value.trim();
    	var sc = new SoundCloudAudio('9999309763ba9d5f60b28660a5813440');

    	console.log("FETCHING SC DATA FROM ", url);

    	var title = this.refs.title_field.getDOMNode();
    	var artist = this.refs.artist_field.getDOMNode();
    	//var genreE = this.refs.electronic.getDOMNode();
    	//var genreH = this.refs.hiphop.getDOMNode();
    	//var genre = genreH.checked ? genreH.value : genreE.value;
    	//console.log("THIS POST IS "+genre, genreH, genreE);
    	var img = this.refs.img_field.getDOMNode();
      console.log(img.src);
    	sc.resolve(url, 
    				function(track){
    					if(!!track ){

  	  					console.log(track.title, track.artist, track.stream_url);
  	  					console.log(title);
  	  					title.value = track.title;
  	  					artist.value = track.user.username;
  	  					img.src = track.artwork_url;

  	  					_data = {
  	  						post : {
  		  						url: url,
  		  						title: track.title,
  		  						artist: track.artist,
  		  						img_url: track.artwork_url,
  		  						stream_url: track.stream_url,
  		  						duration: track.duration,
  		  						waveform_url: track.waveform_url,
  		  						//genre: genre,
  		  						vote_count: 1
  	  						}
  	  					};
  	  					_submit = true;
    					} else {
    						console.log('ERROR FETCHING SC DATA');
    						_submit = false;
    					}
    				});
    this.rmLoading();
    this.dataDidLoad();
  } else {
    console.log("LOADING!");
  }
  },

  addLoading: function() {
    console.log(this.refs.add.getDOMNode());
    var addBtn = this.refs.add.getDOMNode();
    addBtn.className += " tf-hide";
    this.setState({isLoading:true});
  }, 

  rmLoading: function() {
    var addBtn = this.refs.add.getDOMNode();
    console.log("REMOVE", this.refs.add.getDOMNode());
    addBtn.className = "button button--add";    
    this.setState({isLoading:false}); 
  }, 

  dataDidLoad: function() {
    this.setState({dataDidLoad: true});
  }, 

  render: function() {
    var disabled = "button button--big is-disabled";
    var enabled = "button button--big";
    var show = "button button--add";
    var hide = "button button--add tf-hide";
    var isLoading = this.state.isLoading;
  	return (
  	 <div>
       <div className="tf-newtrack-wrapper"> 
          <img src="/assets/img/nipple.png" className="nipple"></img>
          <div className="tf-newtrack-title"> ADD A SONG </div>
          <p className="tf-newtrack-description"> Post a link to a song on Soundcloud </p>
          <input type="text" ref="url_field" className="tf-soundcloud-link" placeholder="paste a soundcloud link">
            <div className={isLoading ? hide : show} ref="add" onClick={this.fetchScData}> ADD </div> 
          </input>
          <div className="align-left"> 
            <div className="tf-newtrack-img"> 
              <img src="assets/img/tf_placeholder.png" ref="img_field"></img>
            </div>
            <div className="tf-newtrack-form"> 
              <label> ARTIST </label> 
              <input type="text" ref="artist_field"></input>  
              <label> TITLE </label> 
              <input type="text" ref="title_field"></input>  
            </div>
          </div>
          <div className={this.state.dataDidLoad ? enabled : disabled} onClick={this.handleClick}> CONTINUE </div>
        </div> 	  	
	   </div>
  	);
  }
});

module.exports = PostFormFirst;