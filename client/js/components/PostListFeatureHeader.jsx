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
var Carousel = require('react-bootstrap').Carousel;
var CarouselItem = require('react-bootstrap').CarouselItem;


var style = {
  ul: {
    listStyleType: 'none',
    margin: '0',
    padding: '0',
    overflow: 'hidden'
  },
  li : {
    float: 'left',
    marginRight: '10px'
  },
  carousel: {
    height: '300px !important'
  }
}
var PostListFeatureHeader = React.createClass({

  propTypes: {
   post: ReactPropTypes.object,
   reload: ReactPropTypes.bool
  },

  componentWillMount: function() {
    //console.log("WILL MOUNT THE HEADER");
  },

  componentDidMount: function() {
    console.log("MOUNTING THE HEADER");
  },

  renderCarouselItem: function(post) {
    var post = this.props.post;
    var background_img = { backgroundImage: "url("+post.img_url_lg+"?time)" };
    var userImgLink = post.user.img;
    var autherName = post.author_name;
    var profileLink = "/profile/"+post.author_id;
    var postLink = "/post/"+post.id;
    var artist_id = "tf-media-artist-" + post.id;
    var thumb = post.img_url_lg ? post.img_url_lg : "assets/img/tf-placeholder.png"
    return (
      <CarouselItem>
      <div className="profile-header text-center">
      <div className="tf-header-background" style={background_img}></div>
      <div className="tf-header-background-overlay">
        <img src="http://d1zb20amprz33r.cloudfront.net/polygon_overlay-min.png" alt="..."></img>
      </div>

      <div className="container">
        <div className="container-inner-home">
          <div className="row no-gutter">

            <div className="col-xs-offset-1 col-xs-3">
              <div className="tf-header-thumbnail">
                  <img src={thumb} alt="..."></img>
              </div>
            </div>

            <div className="col-xs-5">
              <div className="tf-header-info">
                  <h4>{post.title}</h4>
                  <h6>{post.artist}</h6>
                  <br/>
                  <h6>
                  <span className="tf-feature-name">posted by:</span> <a href = {profileLink} onClick={this.stopPropagation} className = "tf-media-poster nd">
                  <span id = {artist_id}>
                      <span className = "tf-media-artist-name tf-feature-name">{post.author_name}</span>
                  </span></a>
                  </h6>
               </div>
            </div>
            <div className="col-xs-3">
              <div className="tf-feature-badge"><img src="assets/img/features/beats1.png"/></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </CarouselItem>
    )
  },

  renderCarousel : function() {
    var post = this.props.post;
    var items = [post, post, post];
    var self = this;
    var carouselItems = items.map(function(post){
      return self.renderCarouselItem(post)
    });
    console.log('caro items', carouselItems)
    return <Carousel wrap={false} bsStyle={style.carousel}>{carouselItems}</Carousel>
  },

  /**
   * @return {object}
   */
  render: function() {
    var post = this.props.post;
    var background_img = { backgroundImage: "url("+post.img_url_lg+"?time)" };
    var userImgLink = post.user.img;
    var autherName = post.author_name;
    var profileLink = "/profile/"+post.author_id;
    var postLink = "/post/"+post.id;
    var artist_id = "tf-media-artist-" + post.id;
    //var content = this.renderCarousel();
    //console.log('2 yung', content)
    return (
      <div className="main-page">
        {this.renderCarousel()}
      </div>
    );
  }

});

module.exports = PostListFeatureHeader;
