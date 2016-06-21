var React = require('react');
var boostrap = require('bootstrap');
var CommunityGrid = require('../CommunityGrid.jsx');
var ReactPropTypes = React.PropTypes;

var AboutPage = React.createClass({
  /**
   * @return {object}
   */
  propTypes: {
    origin: ReactPropTypes.string
  },

  render: function() {
    return (
      <div className="container p-t-md about-page">
        <span className="tf-static-page-header">ABOUT</span>
        <p>
          Trakfire is a discovery platform powered by the people who heard it first. The aux gods and the stream DJs. The ones who wait for the backseat to ask "what is this?". We want the kids who had K Dot on an iPod before m.A.A.d city. The ones who sang with Lizzy Grant pre-Lana Del Rey. We are a collective of tastemakers who knew the artists of 2016 in 2010. And we're gonna find the next wave too.
        </p>

        <br/>

        <CommunityGrid/>

      </div>
    );
  },


});

module.exports = AboutPage;
