var React = require('react');
var ReactPropTypes = React.PropTypes;

var TrakfirePlayer = React.createClass({
    
    propTypes: {

        isPlaying: ReactPropTypes.bool.isRequired,
        scClientId: ReactPropTypes.string.isRequired,
        onPrevClick: ReactPropTypes.func.isRequired,
        onNextClick: ReactPropTypes.func.isRequired,
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
		return (
            <div className="tf-player-wrap">
                <a href="#!" onClick={this.handlePrevClick}>
                    <span className="glyphicon glyphicon-backward"></span>
                </a>
                <a href="#!" onClick={this.handlePlayPauseClick}>
                    <span className="glyphicon glyphicon-play"></span>
                </a>
                <a href="#!" onClick={this.handleNextClick}>
                    <span className="glyphicon glyphicon-forward"></span>
                </a>
            {this.props.currTrack.stream_url}
            </div>
		);
	},
    bindClientId: function(url) {
        return url+this.props.scClientId;
    }

});

module.exports = TrakfirePlayer;