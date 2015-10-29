var React = require('react');
var ReactPropTypes = React.PropTypes;
var Link = require('react-router').Link;

var ProfileBar = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div className="tf-filter-bar">
        <div className="container"> 
          <Link className="is-active" to="/">BACK</Link>
          {/*<div className="right">
            <a href="#!" className="is-active" 
              onClick={this.handleTopClick}> EDIT </a>
          </div>*/}
        </div>
      </div>
    );
  },


});

module.exports = ProfileBar;
