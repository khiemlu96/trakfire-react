//TrakfireApp.js

//var Footer = require('./Footer.react');
//var Header = require('./Header.react');
var FilterBar = require('./FilterBar.react');
var PostsList = require('./PostsList.react');
var React = require('react');
var PostStore = require('../stores/PostStore');

/**
 * Retrieve the current TODO data from the TodoStore
 */
function getAppState() {
  return {
    allPosts: PostStore.getAll(),
    sort: "TOP",
    genre: "ALL"
  };
}

var TrakfireApp = React.createClass({

  getInitialState: function() {
    return getAppState();
  },

  componentDidMount: function() {
    PostStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    PostStore.removeChangeListener(this._onChange);
  },

  handleUserSelection: function(genre, sort) {
    console.log('filter to '+genre+' sort by '+sort);
    var currGenre = this.state.genre;
    var currSort = this.state.sort;
    this.setState({
      genre: genre ? genre : currGenre,
      sort: sort ? sort : currSort
    }); 
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div className="container">
        <FilterBar 
          onClick={this.handleUserSelection}
        />
        <PostsList
          allPosts={this.state.allPosts}
          genre={this.state.genre}
          sort={this.state.sort}
        />
      </div>
    );
  },

  /**
   * Event handler for 'change' events coming from the 
   */
  _onChange: function() {
    this.setState(getAppState());
  }

});

module.exports = TrakfireApp;
