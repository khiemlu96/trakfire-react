var React = require('react');
var ReactPropTypes = React.PropTypes;
var Link = require('react-router').Link;

var Bootstrap = require('react-bootstrap');
var UserStore = require('../stores/UserStore.js');

var CommunityGridItem = React.createClass({

  propTypes: {
    imgUrl: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <div className="col-md-1">
        <img height="100px" width="100px" src={this.props.imgUrl}>
      </div>
    );
  },


});

module.exports = CommunityGridItem;
