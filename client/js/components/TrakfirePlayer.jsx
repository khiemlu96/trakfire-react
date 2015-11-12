var React = require('react');
var ReactPropTypes = React.PropTypes;
var TrakfirePlayerProgress = require('./TrakfirePlayerProgress.jsx');
var TrakfirePlayerInfo =require('./TrakfirePlayerInfo.jsx');
var TrakfirePlayer = React.createClass({
    
    propTypes: {
        currTrack: ReactPropTypes.object.isRequired,
        isPlaying: ReactPropTypes.bool.isRequired,
        onPrevClick: ReactPropTypes.func,
        onNextClick: ReactPropTypes.func,
        onPlayPauseClick: ReactPropTypes.func.isRequired
    },

    handlePlayPauseClick: function() {
        this.props.onPlayPauseClick();
        mixpanel.track("Toggle play from player");
    },

    handlePrevClick: function() {
        this.props.onPrevClick();

    },

    handleNextClick: function() {
        this.props.onNextClick();
    },    

	render: function(){
        var currTrack = this.props.currTrack;
        var play = <a className="tf-player-play" href="#!" onClick={this.handlePlayPauseClick}></a>;
        var pause = <a className="tf-player-pause" href="#!" onClick={this.handlePlayPauseClick}></a>;
        return (
            <div className="tf-player-wrap">
                <div className="tf-player-wrap-inner container">
                    <div className="tf-player-wrap-inner-votes">
                    { currTrack ? currTrack.vote_count : 1 }
                    </div>
                    <div className="tf-player-controls-wrap">
                    {/*<a className="tf-player-backward" href="#!" onClick={this.handlePrevClick}></a>*/}
                    {/*<a className="tf-player-play" href="#!" onClick={this.handlePlayPauseClick}>*/}
                    {!this.props.isPlaying ? play : pause}
                    
                    {/*<a className="tf-player-forward" href="#!" onClick={this.handleNextClick}></a>*/}
                    </div>
                    <div className="tf-player-controls-wrap">
                        <TrakfirePlayerProgress
                            duration={ currTrack ? parseInt(currTrack.duration) : 0 }
                            isPlaying={this.props.isPlaying}
                        />
                    </div>
                    <div className="tf-player-controls-wrap-info">
                    <TrakfirePlayerInfo
                        img={currTrack ? currTrack.img_url : ''}
                        artist={currTrack ? currTrack.artist : ''}
                        title={currTrack ? currTrack.title : ''}
                    />
                    </div>

                </div>
            </div>
		);
	},
});

module.exports = TrakfirePlayer;