//TrakfireApp.js

var React = require('react/addons');
var Uri = require('jsuri');
var ReactPropTypes = React.PropTypes;
var bootstrap = require('bootstrap');
var Bootstrap = require('react-bootstrap');
var Tooltip = Bootstrap.Tooltip;
var Modal = Bootstrap.Modal;
var Button = Bootstrap.Button;
var Input = Bootstrap.Input;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;

var NavBar = require('./NavBar.jsx');
var Footer = require('./Footer.jsx');
var FilterBar = require('./FilterBar.jsx');
var TrakfirePlayer = require('./TrakfirePlayer.jsx');

var PostStore = require('../stores/PostStore');
var PostActions = require('../actions/PostActions');
var SongStore = require('../stores/SongStore');
var SongActions = require('../actions/SongActions');
var UserStore = require('../stores/UserStore.js');
var UserActions = require('../actions/UserActions.js');

var PostContainer = require('./PostContainer.jsx');
var PostsPage = require('./PostsPage.jsx');
var ProfilePage = require('./ProfilePage.jsx');
var EmailAcquirePage = require('./EmailAcquirePage.jsx');
var NProgress = require('nprogress-npm');
var SoundCloudAudio = require('soundcloud-audio');
var scPlayer = new SoundCloudAudio('9999309763ba9d5f60b28660a5813440');
var _persist = false;
/**
 * Retrieve the current post and user data from the PostStore
 */
function getAppState() {
  //console.log("A CHANGE IN USER OR POST STORE");
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
        currSongIdx: 0,
        showDetailModal: false
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
    //$(document).on("ReactComponent:TrakfireApp:showModal", this.showModal);
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
      var next = PostStore.getNextTrack();//this.state.currentSong;//this.state.currSongList[nextIdx];
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
    NProgress.start();
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
    console.log("traps")
    if(this.state.isLoggedIn) {
      PostActions.upvote(this.props.origin+'/votes', postid);
    } else {
      console.log("TRAPIN");
      this.showSignupModal();
    }

  },

  updateUserWithEmail: function(email) {
    UserActions.updateEmail(this.props.origin+'/users/'+userid, email);
  },

  sendUserApplication: function() {
    var name = this.refs.nameField.getValue().trim();
    var handle = this.refs.handleField.getValue().trim();
    var email = this.refs.emailField.getValue().trim();
    var track1 = this.refs.sc1.getValue().trim();
    var track2 = this.refs.sc2.getValue().trim();
    var track3 = this.refs.sc3.getValue().trim();

    if(!name || !email || !handle) {
      console.log("missed a field");
      return;
    }

    var data = {
      application :  {
        name : name,
        handle : handle,
        email : email,
        sc1 : track1,
        sc2 : track2,
        sc3 : track3
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
    console.log("SHOW THE SU MODAL");
    this.setState({showSignupModal:true});
  },

  closeSignupModal: function() {
    this.setState({showSignupModal:false});
  },

  showDetailModal: function(){
    console.log("SHOW THE D MODAL");
    this.setState({showDetailModal:true});
  },

  closeDetailModal: function() {
    this.setState({showDetailModal:false});
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
      var songsLength = PostStore.getPlaylistLength();
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
                      showModal={this.showSignupModal}
                      />;
    //var tfEmailAcq = <EmailAcquirePage updateUserWithEmail={this.updateUserWithEmail}/>;
    var Routes =  <div>
           { React.cloneElement(this.props.children,
              {
                sort: this.state.sort,
                genre: this.state.genre,
                posts: {},
                showModal: this.showSignupModal,
                togglePlay: this.onPlayBtnClick,
                upvote: this.writeVoteToApi,
                filterPosts: this.handleUserSelection,
                onPostItemClick: this.onPlayBtnClick,
                currUser: this.state.currentUser,
                origin: this.props.origin,
                value: scPlayer.audio.currentTime,
                currStreamUrl: this.state.currStreamUrl,
                setSongList: this.setSongList,
                filterPosts: this.handleUserSelection
              }) }</div>;

    return (
      <div className="tf-body">
        <a href="#" className="tf-alert-static" onClick={this.showDetailModal}> Major bag alert </a>
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
            <span ref="growl"></span>
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
          <Modal show={this.state.showDetailModal} onHide={this.closeDetailModal}>
            <Modal.Body closeButton className={"tf-modal-body--detail"}>
              <p> <h2 className="tf-centered tf-uppercase">We made it</h2></p>
              <p className="tf-justify tf-info">
                Thanks to our curators we've generated a bit of respek on our name for our finds.
                The industry has been watching and now we've brought it full circle.
                We partnered with some productions, playlisters and publications we fuck with heavily and the result is a direct line that starts the moment a curator posts on trakfire and ends with real features.
              </p>
              <p className="tf-justify tf-info">
                So, from now on we'll periodically feature those tracks that made it out the trap and onto our mans' lists.
                You'll notice the badge in the header and a few other tweaks are on the way to spotlight the curators who are doing well, dog.
              </p>
              <p className="tf-justify tf-info">
                To our curators: thank you and keep building.
                <br/> To our listeners: look at god.
              </p>
              <p className="tf-justify tf-info">
                - the trakfire team.
              </p>
              <p className="tf-centered">
                <img src="https://66.media.tumblr.com/8d9d03dc87c14c421f36ab4ad54affcd/tumblr_mz2isrQere1sgwk7uo1_400.gif"/>
              </p>
            </Modal.Body>
          </Modal>

          <Modal show={this.state.showSignupModal} onHide={this.closeSignupModal}>
            <Modal.Body closeButton className={"tf-modal-body"}>
              <p> <h2 className="tf-centered tf-uppercase">Request Invite</h2></p>
              <p className="tf-centered">Join the community if you got the heat.</p>
                <Row>
                  <Col xs={6}>
                    <Input type="text" ref="nameField" label="SoundCloud" placeholder="@trakfiremusic" />
                  </Col>
                  <Col xs={6}>
                    <Input type="text" ref="handleField" label="Twitter" placeholder="@trakfiremusic" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Input type="text" ref="emailField" label="Email" placeholder="slimeszn@trakfire.com" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Input type="text" ref="sc1" label="Track 1 Link" placeholder="pure fire" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Input type="text" ref="sc2" label="Track 2 Link" placeholder="purer fire" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Input type="text" ref="sc3" label="Track 3 Link" placeholder="the purest fire" />
                  </Col>
                </Row>
                <a href="#" className="btn tf-btn-rd btn-block" onClick={this.sendUserApplication}> Submit </a>
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
      PostStore.setPlaylist(track);
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
        PostStore.setPlaylist(track);
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
      var next = PostStore.getNextTrack();
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
      var next = PostStore.getPrevTrack();
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
