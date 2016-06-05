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
        <br><br>
        <p>
          Our community consists of people who work at a variety of companies in the music industry. If you're a Trakfire member and interested in any of the opportunities below, hit us up at <a href="mailto:jobs@trakfire.com">jobs@trakfire.com</a> and we'll connect you with the appropriate person who can help you out.
        </p>
        
        <br><br>

        <h4>Scooter Braun Projects</h4>
        <p>A&R Intern / LA / Spring 2017</p>
        <p>Digital Media Intern / LA / Spring 2017</p>
        
        <br><br>
        
        <h4>C3 MGMT</h4>
        <p>Artist Management Intern / LA / Fall 2016</p>
        <p>Artist Management Intern / NYC / Fall 2016</p>
        <p>Artist Management Intern / Austin / Fall 2016</p>
        
        <br><br>

        <p>More coming soon.</p>

      </div>
    );
  },


});

module.exports = JobBoard;
