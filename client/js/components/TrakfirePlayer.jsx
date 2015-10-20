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
    },

    handlePrevClick: function() {
        this.props.onPrevClick();

    },

    handleNextClick: function() {
        this.props.onNextClick();
    },    

	render: function(){
        var currTrack = this.props.currTrack;
        return (
            <div className="tf-player-wrap">
                <div className="tf-player-wrap-inner container">
                    <div className="tf-player-wrap-inner-votes">
                    { currTrack.votes ? currTrack.votes : 1 }
                    </div>
                    <div>
                    <a className="tf-player-backward" href="#!" onClick={this.handlePrevClick}>
                    </a>
                    <a className="tf-player-play" href="#!" onClick={this.handlePlayPauseClick}>
                    </a>
                    <a className="tf-player-forward" href="#!" onClick={this.handleNextClick}>
                    </a>
                    </div>
                    <TrakfirePlayerProgress
                        duration={currTrack.duration}
                    />
                    <TrakfirePlayerInfo
                        img={currTrack.thumb_url}
                        artist={currTrack.artist}
                        title={currTrack.title}
                    />
                </div>
            </div>
		);
	},
});

module.exports = TrakfirePlayer;