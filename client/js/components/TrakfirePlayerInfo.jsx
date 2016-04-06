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
    console.log('RENDER TRACK INFO', this.props );
    var songTitle = this.props.title;
    if(songTitle.length > 35)
    {
      songTitle = songTitle.substring(0,32);
      songTitle = songTitle + "...";
    }
    
    return (
      <div className="tf-player-info">
        
          <Link to={'/post/'+ this.props.post.id}><img className="tf-player-info-img" src={this.props.img}></img></Link>
          <div className="tf-player-info-text">
            <div>
              <Link to={'/post/'+ this.props.post.id}><p className="tf-player-title-info">{songTitle}</p></Link>
              <Link to={'/post/'+ this.props.post.id}><p className="tf-player-artist-info">{this.props.artist}</p></Link>
            </div>
          </div>        
      </div>
    );
  },


});

module.exports = TrakfirePlayerInfo;