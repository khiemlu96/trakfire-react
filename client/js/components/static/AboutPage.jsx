var React = require('react');
var boostrap = require('bootstrap');
var AboutPage = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div id="about-page">
        <h1>About</h1>
        <p>We are on a mission to level the playing field in the music industry. Through crowd curation we are democratizing discovery so that regardless of money, marketing or networks, good music surfaces up.</p>
      </div>
    );
  },


});

module.exports = AboutPage;