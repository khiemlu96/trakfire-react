var React = require('react');
var PostActions = require('../actions/PostActions');
var ReactPropTypes = React.PropTypes;
var Link = require('react-router').Link;

var TrakfirePlayerInfo = React.createClass({

  propTypes: {
    img: ReactPropTypes.string,
    artist: ReactPropTypes.string,
    title: ReactPropTypes.string,
    post: ReactPropTypes.object
  },
  
  /**
   * @return {object}
   * the this.props pieces are for passing in data remove {this.props.} and replace with static data if need be
   */
  render: function() {
   // console.log('RENDER TRACK INFO', this.props );
    return (
      <div className="tf-player-info">
        <Link to={'/post/'+ this.props.post.id}>
          <img className="tf-player-info-img" src={this.props.img}></img>
          <div className="tf-player-info-text">
            <div>
              <p>{this.props.title}</p>
              <p>{this.props.artist}</p>
            </div>
          </div>
        </Link>
      </div>
    );
  },


});

module.exports = TrakfirePlayerInfo;