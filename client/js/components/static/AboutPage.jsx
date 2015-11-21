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
        <p>We’re on a mission to level the playing field in the music industry. For every artist on the radio, there are thousands of talented independent artists whose music goes unheard. We believe that musicians should be discovered for their artistry, not just because of big marketing budgets or exclusive industry connections. This is why we built Trakfire.</p>

        <p>Our vision is to create a strong community comprised of both music creators and fans that enjoy sharing and discovering great new music. Together, let’s help these amazing artists get the exposure they deserve and listen to some good music while we’re at it.</p>
      </div>
    );
  },


});

module.exports = AboutPage;