/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var Link = require('react-router').Link;

var Bootstrap = require('react-bootstrap');
var OverlayTrigger = Bootstrap.OverlayTrigger;
var Popover = Bootstrap.Popover;
var UserStyle = { maxWidth:480, backgroundColor: '#1c1c1c', border:'1px solid #2b2b2b'};
var UserFlyOver = require('./UserFlyOver.jsx');

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function getLength(arr) {
  var count = 0;
  for(key in arr){
    count++;
  }
  return count;
}

var PostDetailHeader = React.createClass({
  propTypes: {
   post: ReactPropTypes.object,
  },

  componentWillMount: function() {
    console.log("WILL MOUNT THE DETAIL HEADER");
  },

  componentDidMount: function() {
    console.log("MOUNTING THE DETAIL HEADER");
  }, 

  buildTweet: function(post) {
    var surlines = ["premium unleaded gasoline", 
                    "a tidal wave of pure fire", 
                    "pure unadulterated fire", 
                    "the next wave",
                    "undeniable"];
    var choice = randomIntFromInterval(0, 4);
    var text = post.title + " by " + post.artist + " is " + surlines[choice];
    var via = "trakfiremusic";
    //var url = post.url  TODO ONCE SERVER RENDERING IS COMPLETE
    var base = "https://twitter.com/intent/tweet?";
    return base + "text=" + text + "&via=" + via; // TODO ES6 TEMPLATE STRINGS
  }, 

  renderVotes: function(post) {
    var votes = post.votes;
    var voteHtml = [];
    for(key in votes) {
      if(votes[key].user.id != post.author_id) {
        voteHtml.push(
          /*<a className="tf-link" href={"/profile/" + votes[key].user.id} >
            <img className="tf-author-img" src={votes[key].user.img} />
          </a>*/
          <Link to={'/profile/'+votes[key].user.id}> 
            <UserFlyOver user = {votes[key].user} origin={this.props.origin} />
          </Link>
        );
      }                              
    }
    return (voteHtml);
  },
  /*getInitialState: function() {
    return {isPlaying:false, isUpvoted:false, hasUpvoted:false};
  },*/

  /*upvote: function(e) {
    e.preventDefault();
    this.PostActions.upvote(this.props.key);
  },

  playPauseTrack: function(e) {
    e.preventDefault();
    console.log("TRACK", this.props.trackIdx);
    this.props.onClick(this.props.post.stream_url, this.props.post);
    if(!this.state.isPlaying) {
      //this.refs.post.className += " is-playing";
      this.setState({isPlaying : true});
      mixpanel.track("Track Play");
    }
    else {
      //this.refs.post.className = isNotPlaying;
      this.setState({isPlaying : false});
      mixpanel.track("Track Pause");
    }
    console.log("POST", this.state.isPlaying, this.refs.post);
  },*/

  /**
   * @return {object}
   */
  render: function() {
    var post = this.props.post;
    var background_img = { backgroundImage: "url("+post.img_url_lg+")" };
    return(
      <div className="container">
      <div className="detail-header text-center">

        <div className="tf-header-background" style={background_img}></div>
        <div className="tf-header-background-overlay">
          <img src="assets/img/polygon_overlay.png" alt="..."></img>
        </div>

        <div className="container">
          <div className="container-inner-home">
            <div className="row no-gutter">

              <div className="col-md-3">
                <div className="tf-header-thumbnail">
                    <img src={post.img_url_lg} alt="..."></img>
                </div>
              </div>

              <div className="col-md-offset-1 col-md-8">
                <div className="tf-header-info">
                    <h4>{post.title}</h4>
                    <h6>{post.artist}</h6>
                    <hr></hr>
                    <div className="row">
                      <div className="col-xs-6">
                        <p>Posted by <b><Link className="tf-profile-link nd">{post.author_name}</Link></b></p>
                        <a href={this.buildTweet(post)} className="nd"><div className="button btn-share-song"><img className="tf-social-icons" src={'/assets/img/twitter_footer.svg'} /> Tweet This Song</div></a>
                      </div>
                      <div className="col-xs-6">
                        <div >
                          <i className="glyphicon glyphicon-fire tf-social-icons"></i> 
                          <span>&nbsp;<b>{voteCount = getLength(post.votes)} &nbsp;people</b></span>
                          <span>&nbsp;&nbsp;upvoted</span>
                        </div>
                        <div className="tf-auther-panel">         
                          {this.renderVotes(post)}                     
                        </div>
                      </div>
                    </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
      </div> 
    );}

});

module.exports = PostDetailHeader;