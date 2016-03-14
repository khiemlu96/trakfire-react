var React = require('react');
var ReactPropTypes = React.PropTypes;
var TrakfirePlayerProgress = require('./TrakfirePlayerProgress.jsx');
var TrakfirePlayerInfo =require('./TrakfirePlayerInfo.jsx');
var classNames = require('classnames');
var isUpvoted = classNames("tf-player-wrap-inner-votes is-upvoted");
var isNotUpvoted = classNames("tf-player-wrap-inner-votes");
var _localVoteCount = 0;
var TrakfirePlayer = React.createClass({

    propTypes: {
        currTrack: ReactPropTypes.object.isRequired,
        isPlaying: ReactPropTypes.bool.isRequired,
        onPrevClick: ReactPropTypes.func,
        onNextClick: ReactPropTypes.func,
        onPlayPauseClick: ReactPropTypes.func.isRequired, 
        onProgressClick: ReactPropTypes.func, 
        onUpvote: ReactPropTypes.func, 
        isLoggedIn: ReactPropTypes.bool, 
        userId: ReactPropTypes.number
    },

    getInitialState: function() {
        return {toggle:false, isPlaying:false, isUpvoted:false, hasUpvoted:false};
    }, 

    componentDidMount: function() {
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
        this.props.onNextClick();
    },  

    hasUpvoted: function(post) {
        if(this.props.isLoggedIn){
          //console.log("POST TO UPVOTE", post);
          if(this.props.userId != -1)
            var exists = post.voters.indexOf(this.props.userId);
          else 
            var exists = -1;
          //console.log(post.id, exists);
          return (exists != -1) ? true : false;
        }
    }, 

    upvote: function(e) {
        e.preventDefault();
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

        return (
            <div className="tf-player-wrap">
                <div className="tf-player-wrap-inner container">
                    <div className={upvoted ? isUpvoted : isNotUpvoted} ref="upvote" onClick={this.upvote}>
                    { currTrack.vote_count }
                    </div>
                    <div className="tf-player-controls-wrap">
                    <a className={previousLinkClass} href="#!" onClick={this.handlePrevClick}></a>
                    {/*<a className="tf-player-play" href="#!" onClick={this.handlePlayPauseClick}>*/}
                    {!this.props.isPlaying ? play : pause}
                    
                    <a className="tf-player-forward" href="#!" onClick={this.handleNextClick}></a>
                    </div>
                    <div className="tf-player-controls-wrap">
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
                    />
                    </div>

                </div>
            </div>
		);
	},
});

module.exports = TrakfirePlayer;