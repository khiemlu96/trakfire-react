//PostForm

var React = require('react');
var PostActions = require('../actions/PostActions');
var ReactPropTypes = React.PropTypes;
var SoundCloudAudio = require('soundcloud-audio');
var _submit = false;
var _data = {};

var PostForm = React.createClass({

  propTypes: {
    onSubmit: ReactPropTypes.func.isRequired,
    isSignedIn: ReactPropTypes.bool.isRequired,
    closeModal: ReactPropTypes.func.isRequired,
    showModal: ReactPropTypes.bool.isRequired
  },

  handleClick: function() {
  	console.log('handling a users click!');
  	if(this.props.isSignedIn) {
	  	if(!_submit) {
	  		this.fetchScData();
	  	} else {
	  		_data['post']['title'] = this.refs.title_field.getDOMNode().value;
	  		_data['post']['artist'] = this.refs.artist_field.getDOMNode().value;
	  		console.log(_data)
	  		this.props.onSubmit(JSON.stringify(_data));
	  	}
	}
  }, 

  fetchScData: function() {
  	var url = this.refs.url_field.getDOMNode().value.trim();
  	var sc = new SoundCloudAudio('9999309763ba9d5f60b28660a5813440');

  	console.log("FETCHING SC DATA FROM ", url);

  	var title = this.refs.title_field.getDOMNode();
  	var artist = this.refs.artist_field.getDOMNode();
  	var genreE = this.refs.electronic.getDOMNode();
  	var genreH = this.refs.hiphop.getDOMNode();
  	var genre = genreH.checked ? genreH.value : genreE.value;
  	console.log("THIS POST IS "+genre, genreH, genreE);
  	//var img = this.refs.img_field.getDOMNode();

  	sc.resolve(url, 
  				function(track){
  					if(!!track ){

	  					console.log(track.title, track.artist, track.stream_url);
	  					console.log(title);
	  					title.value = track.title;
	  					artist.value = track.user.username;
	  					//this.refs.img_field.getDOMNode().src = track.artwork_url;

	  					_data = {
	  						post : {
		  						url: url,
		  						title: track.title,
		  						artist: track.artist,
		  						img_url: track.artwork_url,
		  						stream_url: track.stream_url,
		  						duration: track.duration,
		  						waveform_url: track.waveform_url,
		  						genre: genre,
		  						vote_count: 1
	  						}
	  					}

	  					_submit = true;
  					} else {
  						console.log('ERROR FETCHING SC DATA');
  						_submit = false;
  					}
  				});
  }, 

  closeModal: function(){
  	this.props.closeModal(false);
  },

  render: function() {
  	return (
  	  	<div>
  	{/*<Modal show={this.props.showModal} onHide={this.closeModal}>
	  <Modal.Header closeButton>
	    <Modal.Title>Post some flame</Modal.Title>
	  </Modal.Header>
	  <Modal.Body>
		<form>
		  <div className="form-group">
		    <label for="url_field">Url</label>
		    <input type="text" className="form-control" id="url_field" placeholder="Url" ref={'url_field'}></input>
		  </div>
		  <div className="form-group">
		    <label for="title_field">Title</label>
		    <input type="text" className="form-control" id="title_field" placeholder="Title" ref={'title_field'}></input>
		  </div>
		  <div className="form-group">
		    <label for="artist_field">Artist</label>
		    <input type="text" className="form-control" id="artist_field" placeholder="Artist" ref={'artist_field'}></input>
		  </div>
		  <label className="radio-inline">
			<input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="Electronic" ref="electronic"> Electronic </input>
		  </label>
		  <label className="radio-inline">
			<input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="Hip Hop / R&B" ref="hiphop"> Hip Hop / R&B </input>
		  </label>
		</form>
	  </Modal.Body>
	  <Modal.Footer>
	  	<button onClick={this.handleClick} ref="submit_btn">Continue</button>
	    <button onClick={this.closeModal}>Close</button>
	  </Modal.Footer>
	</Modal>*/}
	</div>
  	);
  }
});

module.exports = PostForm;