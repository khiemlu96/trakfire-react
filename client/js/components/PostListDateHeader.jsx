var React = require('react');
var PostActions = require('../actions/PostActions');
var ReactPropTypes = React.PropTypes;

var PostListDateHeader = React.createClass({

  propTypes: {
   date: ReactPropTypes.string
  },

  getInitialState: function() {
    return {};
  },

  /**
   * @return {object}
   */
  render: function() {
    var date = this.props.date
    var d = date.split(', ');
    var dayOfWeek = d[0];
    var date = d[1];
    return (
      <li className="tf-day-header" key={this.props.key}>
        <h3>{dayOfWeek} <small>{date}</small> </h3>
      </li>
    );
  },


});

module.exports = PostListDateHeader;