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
    data: ReactPropTypes.object, 
    submit: ReactPropTypes.func
  }, 

  getInitialState: function() {
    return {dataDidLoad:false, isLoading:false, user:UserStore.getCurrentUser(), hasGenre:false};
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
  		console.log("data", _data)
  		//this.props.onSubmit(JSON.stringify(_data));
      this.props.updateData(_data);
      //this.props.data = _data;
      //this.props.advanceStep();
      this.submit();

  	}
  }, 

  fillFields: function() {
    var title = this.refs.title_field.getDOMNode();
    var artist = this.refs.artist_field.getDOMNode();  
  }, 

  fetchScData: function(url) {
    var url = this.refs.url_field.getDOMNode().value.trim();
    
    if(url !== "" && !this.state.isLoading) {
      this.addLoading();
      console.log("FORM STATE", this.state);
    	
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
      var resolved = false;
    	sc.resolve(url, 
    				function(track, error){
              if(error) {console.log("e from sc", error)}
    					if(!!track){
                resolved = true;
                console.log("RECIEVED DATA FOR: ", track);
  	  					//console.log(track.title, track.artist, track.stream_url);
  	  					//console.log(title);
  	  					title.value = track.title;
  	  					artist.value = track.user.username;
  	  					img.src = track.artwork_url;

                if(track.artwork_url)
                  var img_url_lg = track.artwork_url.replace("large", "crop"); //get the 300x300 version
                else
                  var img_url_lg = ""; //should replace with placeholder asset

  	  					_data = {
  	  						post : {
  		  						url: url,
  		  						title: track.title,
  		  						artist: track.artist,
  		  						img_url: track.artwork_url,
                    img_url_lg: img_url_lg,
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
      console.log("RESOLVED?",resolved);
      if(!resolved) {
        console.log("PROBABLY THE 403");
        this.props.showGrowl("Soundcloud has restricted this song. THEY DONT WANT YOU TO POST HEAT");
      }
      this.rmLoading();
      this.dataDidLoad();
    } else {
      var url_field = this.refs.url_field.getDOMNode();
      url_field.className += " input-required";
      this.setState({isLoading:false});
    }
  },

  addTagsAndGenre: function() {
    var data = _data.post;
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

    //var tags = this.refs.tags.getDOMNode().value;

    //console.log(tags);

    
    //data["all_tags"] = tags;
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
    var data = _data;
    console.log("POST DATA TO SUBMIT", data);
    this.props.submit(JSON.stringify(data));
    mixpanel.track('Complete PostForm');
  }, 

  onUrlInputChange: function(e) {
      var url_field = this.refs.url_field.getDOMNode();
      url_field.className = "tf-soundcloud-link";
      
      if( url_field.className.indexOf("input-required") !== -1 ){
        url_field.className = "tf-soundcloud-link";
        this.setState({isLoading:false});
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
    this.refs.genres.getDOMNode().className = "align-left tf-show";
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
          <div className="tf-newtrack-title"> ADD A SONG </div>
          <p className="tf-newtrack-description"> Post a link to a song on Soundcloud </p>
          <input onChange={this.onUrlInputChange} type="text" ref="url_field" className="tf-soundcloud-link" placeholder="paste a soundcloud link">
            <div className={isLoading ? hide : show} ref="add" onClick={this.fetchScData}> ADD </div> 
          </input>
          <div className="align-left"> 
            <div className="tf-newtrack-img"> 
              <img src="/assets/img/tf_placeholder.png" ref="img_field"></img>
            </div>
            <div className="tf-newtrack-form"> 
              <label> ARTIST </label> 
              <input type="text" ref="artist_field"></input>  
              <label> TITLE </label> 
              <input type="text" ref="title_field"></input>  
            </div>
          </div>
          <div className="align-left tf-hide" ref="genres"> 
            <input type="checkbox" ref="hiphop" className="tf-checkbox" name="hiphop" id="hiphop" value="HIPHOP"></input>
            <label className="tf-checkbox-label" htmlFor="hiphop" onClick={this.setGenre}>Rhymes</label>
            <input type="checkbox" ref="vocals" className="tf-checkbox" id="vocals" name="vocals" value="VOCALS" onClick={this.setGenre}></input>
            <label className="tf-checkbox-label" htmlFor="vocals" >Vocals</label>
            <input type="checkbox" ref="edm" className="tf-checkbox" id="edm" name="edm" value="ELECTRONIC" onClick={this.setGenre}></input>
            <label className="tf-checkbox-label" htmlFor="edm" >Electronic</label> <br></br> <br></br> <br></br>
            {/*<input type="checkbox" className="ownsong-checkbox" id="ownsong" name="ownsong" value="ownsong"></input> 
            <label className="ownsong-label" for="ownsong" >This is my own song</label>
            <label htmlFor="tags">#TAGS (optional - comma separated)</label>
            <input type="text" name="tags" ref="tags"></input>*/}
          </div>
          <div className={this.state.dataDidLoad && this.state.hasGenre ? enabled : disabled} onClick={this.handleClick}> CONTINUE </div>
        </div>
     </div>

  	);
  }
});

module.exports = PostFormFirst;