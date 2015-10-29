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
   // console.log('RENDER TRACK INFO', this.props );
    return (
      <div className="tf-player-info">
        <img className="tf-player-info-img" src={this.props.img}></img>
        <div className="tf-player-info-text">
          <div>
            <p>{this.props.title}</p>
            <p>{this.props.artist}</p>
          </div>
        </div>
      </div>
    );
  },


});

module.exports = TrakfirePlayerInfo;