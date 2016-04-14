//TrakfireApp.js

var React = require('react/addons');
var Uri = require('jsuri');
console.log("POST BB");
var ReactPropTypes = React.PropTypes;
var bootstrap = require('bootstrap');
var Bootstrap = require('react-bootstrap');
console.log("POST BS");
var Tooltip = Bootstrap.Tooltip;
var Modal = Bootstrap.Modal;
var Button = Bootstrap.Button;
var Input = Bootstrap.Input;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col; 

var NavBar = require('./NavBar.jsx');
var Footer = require('./Footer.jsx');
var FilterBar = require('./FilterBar.jsx');
var PostsList = require('./PostsList.jsx');
var TrakfirePlayer = require('./TrakfirePlayer.jsx');

var PostStore = require('../stores/PostStore');
var PostActions = require('../actions/PostActions');
var SongStore = require('../stores/SongStore');
var SongActions = require('../actions/SongActions');
var UserStore = require('../stores/UserStore.js');
var UserActions = require('../actions/UserActions.js');

var PostsGrid = require('./PostGrid.jsx');
var PostContainer = require('./PostContainer.jsx');
var PostsPage = require('./PostsPage.jsx');
var ProfilePage = require('./ProfilePage.jsx');
var EmailAcquirePage = require('./EmailAcquirePage.jsx');
var SoundCloudAudio = require('soundcloud-audio');
var scPlayer = new SoundCloudAudio('9999309763ba9d5f60b28660a5813440');
var _persist = false;
/**
 * Retrieve the current post and user data from the PostStore
 */
function getAppState() {
  console.log("A CHANGE IN USER OR POST STORE");
  return {
    allPosts: PostStore.getAll(),
    currentUser: UserStore.getCurrentUser(),
    isLoggedIn: UserStore.isSignedIn(),
    isAdmin: UserStore.isAdmin(),
    currentSongList: PostStore.getSortedPosts(),
    currentSong: PostStore.getCurrentSong()
  };
}

function mergeState(s, o) {
  var g = {};
  for (var attrname in s) { g[attrname] = s[attrname]; }
  for (var attrname in o) { g[attrname] = o[attrname]; }
  return g; 
}

function formatStreamUrl(url) {
  return url+'?client_id='+clientId;
}

var TrakfireApp = React.createClass({

  getInitialState: function() {
    var storeState = getAppState();
    var ownedState = {
        sort: "TOP",
        genre: ["HIPHOP", "ELECTRONIC", "VOCALS"],
        isPlaying: false,
        isLoading: false,
        isPaused: true,
        isActive: false,
        seek: 0,
        volume: 1.0,
        duration: 0,
        currTrack: null,
        currStreamUrl: null, 
        currSongList: {},
        currSongIdx: 0     
    }

    return mergeState(storeState, ownedState);
  },

  getDefaultProps: function() {
    return {origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''};
  },

  componentWillMount: function() {
    PostStore.addChangeListener(this._onChange);
    UserStore.addChangeListener(this._onChange);
    SongStore.addChangeListener(this._onChange);

    var jwt = new Uri(location.search).getQueryParamValue('jwt');
    //console.log('JWT: ', jwt, !!jwt);
    if (!!jwt) {
      console.log('SET SESSION W JWT');
      localStorage.setItem('jwt', jwt);
    } 
  },

  componentDidMount: function() {
    if (!!localStorage.getItem('jwt')) {
      console.log('FETCHING USER');
      this.currentUserFromAPI();
    }
    this.readPostsFromApi();
    //SongActions.setSongList({});
    scPlayer.on('ended', this.onTrackEnded);
    $(document).on("ReactComponent:TrakfireApp:showModal", this.showModal);
    //console.log("POSTS RECIEVED", this.props.allPosts);
  },
  componentWillUnmount: function() {
    PostStore.removeChangeListener(this._onChange);
    UserStore.removeChangeListener(this._onChange);
    SongStore.removeChangeListener(this._onChange);
  },

  componentWillUpdate: function() {
    //console.log("STATE OF PLAY", this.state);
    if(this.state.isPlaying && !_persist) {
      _persist = true;
    }
  },

  onTrackEnded: function() {
      //console.log(scPlayer.track.title + ' just ended!');
      // Send a two way message to the postlist to set the next song and play it
      console.log("ENDED");
      //var nextIdx = this.state.currSongIdx+1;
      var next = PostStore.getNextSong();//this.state.currentSong;//this.state.currSongList[nextIdx];
      //console.log("CURR SONG LIST IS", this.state.currentSongList, this.state.currSongIdx);
      console.log("NEXT SONG IS", next);
      this.setState({
        currTrack:next, 
        currStreamUrl:next.stream_url,
        currSongIdx: next.sortedIdx
      });
      scPlayer.play({streamUrl: next.stream_url});
      $(document).trigger("ReactComponent:PostListItem:handlePlayPauseClick", [next.id]);
  }, 

  shouldComponentUpdate: function(nextProps, nextState) {
    //console.log("NEXT: ", nextState, "CURR: ", this.state);
    return true;
  }, 

  readPostsFromApi: function(){
    //console.log('FETCHING POST BATCH', this.props.origin);
    PostActions.getPostBatch(this.props.origin+'/posts');
  },

  currentUserFromAPI: function() {
    //console.log('GET CURRENT USER');
    UserActions.getCurrentUser(this.props.origin+'/current_user');
  },

  writePostsToApi: function(data){
    //console.log('WRITING POSTS TO THE API');
    PostActions.writePost(this.props.origin+'/posts', data);
  },

  getUserPostsFromApi: function(userid) {
    PostActions.getPostsForUser(this.props.origin+'/users/'+userid+'/posts');
  },

  writeVoteToApi: function(postid) {
    PostActions.upvote(this.props.origin+'/votes', postid);
  }, 

  updateUserWithEmail: function(email) {
    UserActions.updateEmail(this.props.origin+'/users/'+userid, email);
  },

  sendUserApplication: function() {
    console.log(this.refs.artistField.getDOMNode().value);
    var name = this.refs.nameField.getValue();
    var handle = this.refs.handleField.getValue()
    var email = this.refs.emailField.getValue();
    var artists = this.refs.artistField.getDOMNode().value;
    var statement = this.refs.statementField.getDOMNode().value;


    if(!name || !email || !artists || !statement) {
      console.log("missed a field");
      return;
    }

    var data = { 
      application :  {
        name : name,
        handle : handle, 
        email : email, 
        artists : artists, 
        statement : statement
      } 
    }
    UserActions.sendUserApplication(this.props.origin+'/applications', data);
    this.closeSignupModal();
  }, 

  handleUserSelection: function(genre, sort) {
    var currGenre = this.state.genre;
    var currSort = this.state.sort;
    var exists = currGenre.indexOf(genre);
    console.log("Genre", genre, "currGenre", currGenre, "exists", exists);
    if(exists > -1) {
      currGenre.splice(exists, 1);
    } else {
      currGenre.push(genre);
    }
    this.setState({
      genre: currGenre,
      sort: sort ? sort : currSort
    }); 
    PostActions.filterPosts(currGenre, sort);
  },

  showModal: function(showState) {
    console.log("Test showModal");
    this.setState({showModal:showState});
  }, 

  closeModal: function() {
    this.setState({showModal:false});
  }, 

  showSignupModal: function(){
    this.setState({showSignupModal:true});
  }, 

  closeSignupModal: function() {
    this.setState({showSignupModal:false});
  }, 

  isCurrentTrackUpvoted: function() {
    var track = this.state.currTrack;
    var user = this.state.currentUser;
    console.log("USERRR", user, "TRACKKK", track);
    if(user && track && track.votes)
      var exists = track.votes.indexOf(user.id);
    else 
      var exists = -1;
    //console.log(post.id, exists);
    return (exists != -1) ? true : false;
  }, 

  setSongList: function(songs) {
    //console.log("SETTING THE SONG LIST WITH ", songs);
    this.setState({currSongList:songs});
  },

  onGetSongsLength: function(){
      var songsLength = PostStore.getSongsLength();
      return songsLength;
  },
  /**
   * @return {object}
   */
  render: function() {
    var active = this.state.isActive;
    var upvoted = this.isCurrentTrackUpvoted();
    var playing = this.state.isPlaying;
    var currTrack = this.state.currTrack;
    var currUserId = this.state.currentUser ? this.state.currentUser.id : -1; 

    var tfPlayer =  <TrakfirePlayer 
                      currTrack={this.state.currTrack}
                      isPlaying={this.state.isPlaying}
                      onPlayPauseClick={this.onPlayCtrlClick} 
                      onProgressClick={this.onProgressClick} 
                      onNextClick={this.onNextCtrlClick}
                      onPrevClick={this.onPrevCtrlClick}
                      isLoggedIn={this.state.isLoggedIn}
                      onUpvote={this.writeVoteToApi}
                      isUpvoted={upvoted}
                      userId={currUserId}
                      onGetSongsLength={this.onGetSongsLength}
                      />;
    //var tfEmailAcq = <EmailAcquirePage updateUserWithEmail={this.updateUserWithEmail}/>;
    var Routes =  <div>
           { React.cloneElement(this.props.children, 
              { 
                sort: this.state.sort,
                genre: this.state.genre,
                posts: {},
                showModal: this.showModal,
                togglePlay: this.onPlayBtnClick,
                upvote: this.writeVoteToApi,
                filterPosts: this.handleUserSelection,
                onPostItemClick: this.onPlayBtnClick,
                currUser: this.state.currentUser,
                origin: this.props.origin,
                value: scPlayer.audio.currentTime, 
                currStreamUrl: this.state.currStreamUrl, 
                setSongList: this.setSongList
              }) }</div>;
    
    return (
      <div className="tf-body">
        <div>
            <NavBar 
              isLoggedIn={this.state.isLoggedIn}
              origin={this.props.origin}
              isAdmin={this.state.isAdmin}
              user={this.state.currentUser}
              showSignupModal={this.showSignupModal}
              showModal={this.showModal}
              showGrowl={this.showGrowlNotification}/>
          </div>
          <div id ="main-container">
            <div ref="growl"></div>
            {Routes}
          </div>          
          <div>
          {active ? tfPlayer : ''}
          </div>
          {/*<Modal show={this.state.showModal} onHide={this.closeModal}>
            <Modal.Body closeButton className={"tf-modal-body"}>
              <p><h2 className="tf-centered tf-uppercase">Sign In</h2></p>
              <p className="tf-centered">Fill in your invite code or sign up with Twitter or Facebook to upvote, post, and save tracks to your collection</p>
              <input type="text" ref="url_field" className="tf-soundcloud-link" placeholder="fill in the invite code">
                <div className="button button--join" ref="add" onClick={this.fetchScData}> JOIN </div> 
              </input>
              <p className="tf-centered"> OR </p>
              <a href={this.props.origin+'/request_token'} className="btn btn-primary btn-block"> Sign in with Twitter </a>
            </Modal.Body>
          </Modal>*/}

          <Modal show={this.state.showModal} onHide={this.closeModal}>
            <Modal.Body closeButton className={"tf-modal-body"}>
              <p> <h2 className="tf-centered tf-uppercase">Request Invite</h2></p>
              <p className="tf-centered">Wanna become an influencer? <br></br> Request an invite and become part of the community. </p>
                <Row>
                  <Col xs={6}>
                    <Input type="text" ref="nameField" label="Full Name" placeholder="First Last" />
                  </Col>
                  <Col xs={6}>
                    <Input type="text" ref="handleField" label="Twitter Handle" placeholder="@handle" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Input type="text" ref="emailField" label="Email" placeholder="slimeszn@trakfire.com" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Input label="Five favorite emerging artists" >
                      <textarea ref="artistField" placeholder="pure fire artists here" ></textarea>
                    </Input>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Input label="Why do you deserve an invite?">
                      <textarea ref="statementField" placeholder="why you're pure fire here" ></textarea>
                    </Input>
                  </Col>
                </Row>
                <a href="#" className="btn tf-btn-rd btn-block" onClick={this.sendUserApplication}> Finish Account </a>
                <a href="#" className="btn btn-link tf-btn-link btn-block"> Already have an account? </a>
            </Modal.Body>
          </Modal>
          <div id="search-result">
          </div>
          {/*<Footer/>*/}
        </div>
    );
  },

  /* Function triggered by item thumbnail click */
  onPlayBtnClick: function(stream_url, track, idx) {
    console.log("CLICKED TRACK IDX", idx);
    var isPlaying = this.state.isPlaying;
    var isPaused = this.state.isPaused;
    if(!this.state.isActive) { this.setState({isActive:true}); }
    if(this.state.currTrack == null) {
      this.setState({
        currTrack : track,
        currSongIdx : idx
      });
      //PostActions.setCurrentPost(idx);
    }
    if(!isPlaying) {
      scPlayer.play({streamUrl: stream_url});
      isPlaying = true;
      //SongActions.play();
      this.setState({
        isPlaying : isPlaying, 
        isPaused : isPaused, 
        currStreamUrl : stream_url, 
        currTrack : track,
        currSongIdx : idx
      });
      PostActions.setCurrentPost(idx);
    } else if(isPlaying && stream_url == this.state.currStreamUrl) {
        scPlayer.pause();
        isPlaying = false;
        isPaused = true;
        //SongActions.pause();
        this.setState({isPlaying : isPlaying, isPaused : isPaused});     
    } else if(isPlaying && stream_url != this.state.currStreamUrl) {
        scPlayer.pause();
        scPlayer.play({streamUrl : stream_url});
        isPlaying = true;
        isPaused = false;  
        this.setState({
          isPlaying : isPlaying, 
          isPaused : isPaused, 
          currStreamUrl : stream_url, 
          currTrack : track,
          currSongIdx : idx
        }); 
        PostActions.setCurrentPost(idx);    
    }
    
    if(isPlaying){
      mixpanel.track('Playing track', {
      'title': track.title,
      'id': track.id,
      'artist' : track.artist, 
      'filter' : this.state.genre,
      'sort' : this.state.sort
      });
    } else if(isPaused) {
      mixpanel.track('Paused track', {
      'title': track.title,
      'id': track.id,
      'artist' : track.artist, 
      'filter' : this.state.genre, 
      'sort' : this.state.sort 
      });      
    }
  },

  onPlayCtrlClick: function() {
    //console.log("onPlayCtrlClick", this.state.isPlaying);
    var isPlaying = this.state.isPlaying;
    var isPaused = this.state.isPaused;
    var stream_url = this.state.currStreamUrl;
    if(!isPlaying) {
      //console.log('playing');
      scPlayer.play({streamUrl: stream_url});
      isPlaying = true;
      isPaused = false;
      this.setState({isPlaying : isPlaying, isPaused : isPaused});
    } else if(isPlaying && !isPaused || isPlaying) {
      //console.log('pausing');
      scPlayer.pause();
      isPlaying = false;
      isPaused = true;
      this.setState({isPlaying : isPlaying, isPaused : isPaused});
    }
    $(document).trigger("ReactComponent:PostListItem:handlePlayPauseClick", [this.state.currTrack.id]);
    //$(document).trigger("ReactComponent:PostListItem:handlePlayPauseClick", [this.state.currTrack.id]);

  },

  onNextCtrlClick: function() {
      var next = PostStore.getNextSong();
      console.log("CTRL: NEXT SONG IS", next);
      this.setState({
        currTrack:next, 
        currStreamUrl:next.stream_url,
        currSongIdx: next.sortedIdx,
        isPlaying: true
      });
      scPlayer.play({streamUrl: next.stream_url});
  }, 

  onPrevCtrlClick: function() {
      var next = PostStore.getPrevSong();
      console.log("CTRL: NEXT SONG IS", next);
      this.setState({
        currTrack:next, 
        currStreamUrl:next.stream_url,
        currSongIdx: next.sortedIdx,
        isPlaying: true
      });
      scPlayer.play({streamUrl: next.stream_url});
  }, 

  onProgressClick: function(millipos) {
    //console.log("SEEKING BOI");
    scPlayer.seekTo(millipos);
  }, 

  showGrowlNotification: function(text) {
    console.log("ATTACHING GROWL");
    var notif = '<div class="growl growl-static">'+
      '<div class="alert alert-dark alert-dismissable" role="alert">'+
       '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
          '<span aria-hidden="true">×</span>'+
        '</button>' + text +'</div></div>';
    var notifDiv = this.refs.growl.getDOMNode();
    notifDiv.innerHTML = notif;
  }, 

  /**
   * Event handler for 'change' events coming from the PostStore
   */
  _onChange: function() {
    //console.log("APP STATE", getAppState());
    this.setState(getAppState());
  }

});

module.exports = TrakfireApp;
