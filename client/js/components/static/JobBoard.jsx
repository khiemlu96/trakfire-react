var React = require('react');
var boostrap = require('bootstrap');
var JobBoard = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div className="container p-t-md about-page">
        <span className="tf-static-page-header">JOB BOARD</span>
        <br>
        <p>[Trakfire Members] Hit us up at jobs@trakfire.com if you're interested in any of the opportunities below and we'll connect you with the appropriate person.</p>
        <br>

        <h4>Scooter Braun Projects</h4>
        <p>A&R Intern / LA / Spring 2017</p>
        <p>Digital Media Intern / LA / Spring 2017</p>

        <p>More coming soon.</p>

      </div>
    );
  },


});

module.exports = AboutPage;
