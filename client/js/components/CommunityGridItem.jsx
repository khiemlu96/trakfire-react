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
      <div className="col-md-2 tf-bottom-margin">
        <img className="img-circle" height="100px" width="100px" src={this.props.imgUrl}></img>
      </div>
    );
  },


});

module.exports = CommunityGridItem;
