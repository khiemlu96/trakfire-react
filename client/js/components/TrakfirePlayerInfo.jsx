var React = require('react');
var PostActions = require('../actions/PostActions');
var ReactPropTypes = React.PropTypes;

var TrakfirePlayerInfo = React.createClass({

  propTypes: {
    img: ReactPropTypes.string,
    artist: ReactPropTypes.string,
    title: ReactPropTypes.string
  },
  
  /**
   * @return {object}
   * the this.props pieces are for passing in data remove {this.props.} and replace with static data if need be
   */
  render: function() {
    console.log('RENDER TRACK INFO');
    return (
      <div className="tf-player-info">
        <img className="tf-player-info-img" src={this.props.img}></img>
        <p className="tf-player-info-artist">{this.props.artist}</p>
        <p classname="tf-player-info-title">{this.props.title}</p>
      </div>
    );
  },


});

module.exports = TrakfirePlayerInfo;