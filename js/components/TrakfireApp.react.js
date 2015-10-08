//TrakfireApp.js

//var Footer = require('./Footer.react');
//var Header = require('./Header.react');
var PostsList = require('./PostsList.react');
var React = require('react');
var PostStore = require('../stores/PostStore');

/**
 * Retrieve the current TODO data from the TodoStore
 */
function getAppState() {
  return {
    allPosts: PostStore.getAll()
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

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div className="container">
        <PostsList
          allPosts={this.state.allPosts}
        />
      </div>
    );
  },

  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange: function() {
    this.setState(getAppState());
  }

});

module.exports = TrakfireApp;
