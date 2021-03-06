var React = require('react');
var ReactPropTypes = React.PropTypes;
var TrakfirePlayerProgress = require('./TrakfirePlayerProgress.jsx');
var TrakfirePlayerInfo =require('./TrakfirePlayerInfo.jsx');
var classNames = require('classnames');
var isUpvoted = classNames("tf-player-wrap-inner-votes is-upvoted");
var isNotUpvoted = classNames("tf-player-wrap-inner-votes");
var _localVoteCount = 0;

function keypressCheck(e) { 
    var e = window.event||e; // Handle browser compatibility
    var keyID = e.keyCode;

    // Check that if key stroke is occured from Search input box
    // then dont disable event on key
    if( e.target.id === null || ( e.target.id !== null && e.target.id !== "tf-search-input" )) {
        if( keyID === 32 ) {
            e.preventDefault(); // Prevent the default action
        }
    }
}

var TrakfirePlayer = React.createClass({

    propTypes: {
        currTrack: ReactPropTypes.object.isRequired,
        isPlaying: ReactPropTypes.bool.isRequired,
        onPrevClick: ReactPropTypes.func,
        onNextClick: ReactPropTypes.func,
        onPlayPauseClick: ReactPropTypes.func.isRequired, 
        onProgressClick: ReactPropTypes.func,
        onGetSongsLength: ReactPropTypes.func, 
        isUpvoted: ReactPropTypes.bool,
        onUpvote: ReactPropTypes.func, 
        isLoggedIn: ReactPropTypes.bool, 
        userId: ReactPropTypes.number, 
        showModal: ReactPropTypes.func
    },

    getInitialState: function() {
        return {toggle:false, isPlaying:false, isUpvoted:false, hasUpvoted:false};
    }, 

    componentDidMount: function() {
        console.log("CURRENT TRACK", this.props.currTrack);
        this.state.isUpvoted = this.props.isUpvoted;

        window.addEventListener("keypress", keypressCheck);
        window.addEventListener("keydown", this.handleHotKeysEvent);
        
        if( this.props.currTrack !== undefined )
            this.state.isUpvoted = this.hasUpvoted(this.props.currTrack);
    }, 

    componentDidUpdate: function(prevProps, prevState) {
        //console.log(prevProps.currTrack, this.props.currTrack);
        if(prevProps.currTrack != this.props.currTrack && !this.state.toggle) {
            this.setState({toggle:true});
        } else if(this.state.toggle) {
            this.setState({toggle:false});
        }    
    },

    componentWillUnmount: function() {
        window.removeEventListener("keypress", keypressCheck);
        window.removeEventListener("keydown", this.handleHotKeysEvent);
    },

    handleProgressClick: function(millipos) {
        this.props.onProgressClick(millipos);
    },

    handlePlayPauseClick: function() {
        this.props.onPlayPauseClick();
        mixpanel.track("Toggle play from player");
    },

    handlePrevClick: function() {
        if(this.props.currTrack.sortedIdx > 0) {
            this.props.onPrevClick();
        } else {
            return false;
        }       
    },

    handleNextClick: function() {
        if(this.props.currTrack.sortedIdx < (this.props.onGetSongsLength()-1)){
            this.props.onNextClick();
        }
    },  

    hasUpvoted: function(post) {
        if(this.props.isLoggedIn){
          //console.log("POST TO UPVOTE", post);
          if(this.props.userId != -1)
            var exists = post.votes.indexOf(this.props.userId);
          else 
            var exists = -1;
          //console.log(post.id, exists);
          return (exists != -1) ? true : false;
        }
    }, 

    upvote: function(e) {
        //e.preventDefault();
        var post = this.props.currTrack;
        //console.log('upvoting '+this.props.key);
        //PostActions.upvote('http://localhost:3000'+'/votes', this.props.post.id);
        mixpanel.identify(this.props.userid);
        mixpanel.track("Upvote", {
          "Title" : post.title,
          "id" : post.id,
          "artist" : post.artist,
          "vote count" : post.vote_count
        });
        if(this.props.isLoggedIn && !this.hasUpvoted(post)){
          this.props.onUpvote(post.id);
          this.setState({hasUpvoted:true});
        } else {
            this.props.showModal();
        }
    },

    handleHotKeysEvent: function( event ){        
        if (event.keyCode == 32){            
            this.handlePlayPauseClick();
        } else if (event.keyCode == 85){
            this.upvote(event);
        }
    },

	render: function(){
        var currTrack = this.props.currTrack;
        var upvoted = this.hasUpvoted(currTrack);
        var play = <a className="tf-player-play" href="#!" onClick={this.handlePlayPauseClick}></a>;
        var pause = <a className="tf-player-pause" href="#!" onClick={this.handlePlayPauseClick}></a>;
        var localUpvote = this.state.hasUpvoted; //pre refresh we upvoted this

        var previousLinkClass = " tf-player-backward ";
        if(currTrack.sortedIdx === 0) {
            previousLinkClass += " link-disabled ";
        }

        var nextLinkClass = "tf-player-forward";
        if(currTrack.sortedIdx === (this.props.onGetSongsLength()-1)){
           nextLinkClass += " link-disabled ";
        }

        var voteStyle = { color: "#ff0d60 !important;" };
        
        return (
            <div className="tf-player-wrap">
                <div className="tf-player-wrap-inner container">
                    <div className="tf-player-controls-wrap">
                    <a className={previousLinkClass} href="#!" onClick={this.handlePrevClick}></a>
                    {/*<a className="tf-player-play" href="#!" onClick={this.handlePlayPauseClick}>*/}
                    {!this.props.isPlaying ? play : pause}
                    
                    <a className={nextLinkClass} href="#!" onClick={this.handleNextClick}></a>
                    </div>
                    <div className="tf-player-controls-wrap v-center-progress">
                        <TrakfirePlayerProgress
                            duration={ currTrack ? parseInt(currTrack.duration) : 0 }
                            isPlaying={this.props.isPlaying}
                            onProgressClick={this.handleProgressClick}
                            toggle={this.state.toggle}
                            showTrackDuration={false}
                        />
                    </div>
                    <div className="tf-player-controls-wrap-info">
                    <TrakfirePlayerInfo
                        img={currTrack ? currTrack.img_url : ''}
                        artist={currTrack ? currTrack.artist : ''}
                        title={currTrack ? currTrack.title : ''}
                        post = {currTrack}
                        upvote={this.upvote}
                        hasUpvoted={this.hasUpvoted}
                    />
                    </div>

                </div>
            </div>
		);
	},
});

module.exports = TrakfirePlayer;