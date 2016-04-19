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
        <p>Trakfire is an invite-only community of people who have the feel for music. It’s a place for tastemakers, both emerging and well known, to share their best finds from the vast seas of Soundcloud and YouTube. There's more noise out there than ever before, and worthy artistry often doesn't receive as much visibility as those with money, marketing, and connections. Our hope for Trakfire is to create a space where great music can surface up democratically, powered by people who love and know music.</p>
      </div>
    );
  },


});

module.exports = AboutPage;