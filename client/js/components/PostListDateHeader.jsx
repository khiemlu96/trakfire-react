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
    date = this.props.date
    return (
      <li className="tf-day-header" key={this.props.key}>
        <h3>{date}</h3>
      </li>
    );
  },


});

module.exports = PostListDateHeader;