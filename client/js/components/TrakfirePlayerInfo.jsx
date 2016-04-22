var React = require('react');
var PostActions = require('../actions/PostActions');
var ReactPropTypes = React.PropTypes;
var Link = require('react-router').Link;

var TrakfirePlayerInfo = React.createClass({

  propTypes: {
    img: ReactPropTypes.string,
    artist: ReactPropTypes.string,
    title: ReactPropTypes.string,
    post: ReactPropTypes.object, 
    upvote: ReactPropTypes.func, 
    hasUpvoted: ReactPropTypes.func
  },
  
  upvote: function(e) {
    console.log("upvoting");
    e.preventDefault();
    this.props.upvote();
  }, 

  /**
   * @return {object}
   * the this.props pieces are for passing in data remove {this.props.} and replace with static data if need be
   */
  render: function() {
    console.log('RENDER TRACK INFO', this.props );
    var songTitle = this.props.title;
    if(songTitle.length > 32)
    {
      songTitle = songTitle.substring(0,32);
      songTitle = songTitle + "...";
    }
    var voteStyle = { color: "#ff0d60 !important;" };
    var voteStyleUpvoted = { color: "#777 !important;" };

    return (
      <div className="tf-player-info">
        
          <Link to={'/post/'+ this.props.post.id}><img className="tf-player-info-img" src={this.props.img}></img></Link>
          <div className="tf-player-info-text">
            <div>
              <Link className="nd" to={'/post/'+ this.props.post.id}><p className="tf-player-title-info">{songTitle}</p></Link>
              <Link className="nd" to={'/post/'+ this.props.post.id}><p className="tf-player-artist-info">{this.props.artist}</p></Link>
            </div>
          </div> 
          <div className="tf-vote-el pull-right" ref="upvote" onClick={this.upvote}> {/*{upvoted ? isUpvoted : isNotUpvoted}*/}
            <div className="tf-vote-btn">
                <span className="icon icon-chevron-up" style={!this.props.hasUpvoted ? voteStyle : voteStyleUpvoted }></span>
            </div>
            <div className="tf-vote-count">{ this.props.post.vote_count }</div>
          </div>       
      </div>
    );
  },


});

module.exports = TrakfirePlayerInfo;