var React = require('react');
var ReactPropTypes = React.PropTypes;
var Link = require('react-router').Link;

var Bootstrap = require('react-bootstrap');
var Tooltip = Bootstrap.Tooltip;
var OverlayTrigger = Bootstrap.OverlayTrigger;

var UserStore = require('../stores/UserStore.js');

var CommunityGridItem = React.createClass({

  propTypes: {
    imgUrl: React.PropTypes.string.isRequired, 
    href: React.PropTypes.string.isRequired, 
    name: ReactPropTypes.string.isRequired
  },

  render: function() {
    return (
      <div className="col-md-2 tf-bottom-margin">
       <OverlayTrigger placement="top" overlay = {<Tooltip id="tooltip">{this.props.name}</Tooltip>} >
            <a href={this.props.href}>
              <img className="img-circle" height="100px" width="100px" src={this.props.imgUrl}></img>
            </a>
       </OverlayTrigger>
      </div>
    );
  },


});

module.exports = CommunityGridItem;
