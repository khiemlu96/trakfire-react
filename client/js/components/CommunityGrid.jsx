var React = require('react');
var ReactPropTypes = React.PropTypes;
var Link = require('react-router').Link;

var Bootstrap = require('react-bootstrap');
var CommunityGridItem = require('./CommunityGridItem.jsx');
var UserStore = require('../stores/UserStore.js');

var imageUrlArray = [];

var CommunityGrid = React.createClass({

  propTypes: {

  },

  populateImageArray: function(userArray) {
    for(var user in userArray) {
      imageUrlArray.push(user.img);
    }
  },

  render: function() {
    populateImageArray(UserStore.getAllUsers);
    return (
      for (var url in imageUrlArray){
         <CommunityGridItem imgUrl=imageUrlArray[url]/>;
      }
    );
  },

});

module.exports = CommunityGrid;
