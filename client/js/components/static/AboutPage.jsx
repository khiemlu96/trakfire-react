var React = require('react');
var boostrap = require('bootstrap');
var AboutPage = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div className="container p-t-md about-page">
        <span className="tf-static-page-header">ABOUT</span>
        <p>Trakfire is a community of people who have the feel for music. It’s a place for tastemakers, both no-names and brand names, to share their best finds from the vast seas of Soundcloud and YouTube. There's more noise out there than ever before, and worthy artistry often doesn't receive as much visibility as those with money, marketing, and connections. Our goal is to 1) create a space where great music can surface democratically, powered by people who love and know music, and 2) move the needle in music culture as a collective mass.</p>
        
        <CommunityGrid/>
        
      </div>
    );
  },


});

module.exports = AboutPage;
