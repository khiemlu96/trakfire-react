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

var PostListHeader = React.createClass({

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

  /**
   * @return {object}
   */
  render: function() {
    var post = this.props.post;
    var background_img = { backgroundImage: "url("+post.img_url_lg+"?time)" };
    return(
      <div className="main-page">
      <div className="profile-header text-center">

        <div className="tf-header-background" style={background_img}></div>
        <div className="tf-header-background-overlay">
          <img src="http://d1zb20amprz33r.cloudfront.net/polygon_overlay-min.png" alt="..."></img>
        </div>

        <div className="container">
          <div className="container-inner-home">
            <div className="row no-gutter">

              <div className="col-xs-offset-2 col-xs-3">
                <div className="tf-header-thumbnail">
                    <img src={post.img_url_lg ? post.img_url_lg : "assets/img/tf-placeholder.png"} alt="..."></img>
                </div>
              </div>

              <div className="col-xs-7">
                <div className="tf-header-info">
                    <h4>{post.title}</h4>
                    <h6>{post.artist}</h6>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
      </div>
    );}

});

module.exports = PostListHeader;
