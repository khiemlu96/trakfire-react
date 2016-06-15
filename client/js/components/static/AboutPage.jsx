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
          Trakfire is a discovery platform that leverages the people who heard it first. 
          The aux gods and the stream djs. 
          The ones who wait for the backseat to ask "what is this?". 
          We want the kids to had K Dot on an ipod before mAAD city. 
          The ones who sang with Lizzy Grant pre Lana Del Rey. 
          We want people who knew what Drake would be in the acura days. 
          We are a collective of tastemakers who knew the artists of 2016 in 2008. 
          And were gonna find the next wave too. join us @ trakfire.com.
        </p>
      </div>
    );
  },


});

module.exports = AboutPage;
