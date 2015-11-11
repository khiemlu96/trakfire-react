//TrakfireApp.js

var React = require('react/addons');
var Uri = require('jsuri');
var ReactPropTypes = React.PropTypes;

var NavBar = require('./NavBar.jsx');
var Footer = require('./Footer.jsx');
var FilterBar = require('./FilterBar.jsx');
var PostsList = require('./PostsList.jsx');
var TrakfirePlayer = require('./TrakfirePlayer.jsx');
var PostStore = require('../stores/PostStore');
var PostActions = require('../actions/PostActions');
var PostsGrid = require('./PostGrid.jsx');
var PostContainer = require('./PostContainer.jsx');
var PostsPage = require('./PostsPage.jsx');
var ProfilePage = require('./ProfilePage.jsx');
var EmailAcquirePage = require('./EmailAcquirePage.jsx');
var UserStore = require('../stores/UserStore.js');
var UserActions = require('../actions/UserActions.js');
var SoundCloudAudio = require('soundcloud-audio');
var scPlayer = new SoundCloudAudio('9999309763ba9d5f60b28660a5813440');
/**
 * Retrieve the current post and user data from the PostStore
 */
function getAppState() {
  return {
    //allPosts: PostStore.getAll(),
    currentUser: UserStore.getCurrentUser(),
    isLoggedIn: UserStore.isSignedIn(),
    isAdmin: UserStore.isAdmin(),
    sort: "TOP",
    genre: "ALL",
    isPlaying: false,
    isLoading: false,
    isPaused: true,
    seek: 0,
    volume: 1.0,
    duration: 0,
    currTrack: null,
    currStreamUrl: null,
  };
}

function formatStreamUrl(url) {
  return url+'?client_id='+clientId;
}

var TrakfireApp = React.createClass({

  getInitialState: function() {
    return getAppState();
  },

  getDefaultProps: function() {
    return {origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''};
  },

  componentWillMount: function() {
    PostStore.addChangeListener(this._onChange);
    UserStore.addChangeListener(this._onChange);
    var jwt = new Uri(location.search).getQueryParamValue('jwt');
    //console.log('JWT: ', jwt, !!jwt);
    if (!!jwt) {
      //console.log('SET SESSION W JWT');
      sessionStorage.setItem('jwt', jwt);
    }
  },

  componentDidMount: function() {
    if (!!sessionStorage.getItem('jwt')) {
      //console.log('FETCHING USER');
      this.currentUserFromAPI();
    }
    this.readPostsFromApi();
    //console.log("POSTS RECIEVED", this.props.allPosts);
  },
  componentWillUnmount: function() {
    PostStore.removeChangeListener(this._onChange);
    UserStore.removeChangeListener(this._onChange);
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    console.log("NEXT: ", nextState, "CURR: ", this.state);
    if(nextState.currStreamUrl == null && this.state.currStreamUrl) { return false; }
    if(nextState.currStreamUrl && this.state.currStreamUrl == null && this.state.isPlaying) { return false; }
    if(nextState.currStreamUrl == this.state.currStreamUrl) { return false; }
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

  handleUserSelection: function(genre, sort) {
    var currGenre = this.state.genre;
    var currSort = this.state.sort;
    console.log('filter to '+genre+' from '+currGenre+', sort by '+sort+' from '+currSort );
    this.setState({
      genre: genre ? genre : currGenre,
      sort: sort ? sort : currSort
    }); 
    PostActions.filterPosts(genre, sort);
  },

  scrollToTop: function() {
      console.log('scrolling');
      window.scrollTo(0,-252);
  },

  /**
   * @return {object}
   */
  render: function() {
    var playing = this.state.isPlaying;
    var currTrack = this.state.currTrack;
    var tfPlayer =  <TrakfirePlayer 
                      currTrack={this.state.currTrack}
                      isPlaying={this.state.isPlaying}
                      onPlayPauseClick={this.onPlayCtrlClick} />;
    //var tfEmailAcq = <EmailAcquirePage updateUserWithEmail={this.updateUserWithEmail}/>;
    var Routes =  <div>
           { React.cloneElement(this.props.children, 
              { 
                sort: this.state.sort,
                genre: this.state.genre,
                posts: {},
                togglePlay: this.onPlayBtnClick,
                upvote: this.writeVoteToApi,
                filterPosts: this.handleUserSelection,
                onPostItemClick: this.onPlayBtnClick,
                currUser: this.state.currentUser,
                origin: this.props.origin,
                value: scPlayer.audio.currentTime, 
                currStreamUrl: this.state.currStreamUrl
              }) }</div>;

    return (
      <div>
        <div>
            <NavBar 
              isLoggedIn={this.state.isLoggedIn}
              origin={this.props.origin}
              isAdmin={this.state.isAdmin}
              user={this.state.currentUser}
            />
          </div>
          {Routes}
          <div>
          {!!playing ? tfPlayer : ''}
          </div>
          <Footer/>
      </div>
    );
  },

  /* Function triggered by item thumbnail click */
  onPlayBtnClick: function(stream_url, track) {
    var isPlaying = this.state.isPlaying;
    var isPaused = this.state.isPaused;
    if(this.state.currTrack == null) {
      this.setState({currTrack : track});
    }
    if(!isPlaying) {
      scPlayer.play({streamUrl: stream_url});
      isPlaying = true;
      this.setState({isPlaying : isPlaying, isPaused : isPaused, currStreamUrl : stream_url, currTrack : track});
    } else if(isPlaying && stream_url == this.state.currStreamUrl) {
        scPlayer.pause();
        isPlaying = false;
        isPaused = true;
        this.setState({isPlaying : isPlaying, isPaused : isPaused});     
    } else if(isPlaying && stream_url != this.state.currStreamUrl) {
        scPlayer.pause();
        scPlayer.play({streamUrl : stream_url});
        isPlaying = true;
        isPaused = false;  
        this.setState({isPlaying : isPlaying, isPaused : isPaused, currStreamUrl : stream_url, currTrack : track});     
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
  },

  /**
   * Event handler for 'change' events coming from the PostStore
   */
  _onChange: function() {
    console.log("APP STATE", getAppState());
    this.setState(getAppState());
  }

});

module.exports = TrakfireApp;
