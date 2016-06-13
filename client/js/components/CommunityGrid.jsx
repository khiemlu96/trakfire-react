var React = require('react');
var ReactPropTypes = React.PropTypes;
var Link = require('react-router').Link;

var Bootstrap = require('react-bootstrap');
var CommunityGridItem = require('./CommunityGridItem.jsx');
var UserStore = require('../stores/UserStore.js');
var UserActions = require('../actions/UserActions.js');

function toArray(obj) {
  var array = [];
  for(key in obj) {
    array.push(obj[key]);
  }
  return array;
}

function chunkify(a, n, balanced) {
    
    if (n < 2)
        return [a];

    var len = a.length,
            out = [],
            i = 0,
            size;

    if (len % n === 0) {
        size = Math.floor(len / n);
        while (i < len) {
            out.push(a.slice(i, i += size));
        }
    }

    else if (balanced) {
        while (i < len) {
            size = Math.ceil((len - i) / n--);
            out.push(a.slice(i, i += size));
        }
    }

    else {
        n--;
        size = Math.floor(len / n);
        if (len % size === 0)
            size--;
        while (i < size * n) {
            out.push(a.slice(i, i += size));
        }
        out.push(a.slice(size * n));
    }

    return out;
}

function getComponentState() {
  return {
    users : UserStore.getAllWhiteListUsers(), 
  };
}

var CommunityGrid = React.createClass({

  propTypes: {
    origin: ReactPropTypes.string
  },

  getInitialState: function() {
    return getComponentState();
  }, 

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
    UserActions.getAllWhiteListUsers(this.props.origin + "/whitelists");
  }, 

  renderGridItems: function() {
    var users = this.state.users;//UserStore.getAllUsers();
    users = toArray(users);
    //console.log("USERS FOR GRID", users, users.length);
    var communityGrid = [];
    var chunks = chunkify(users, Math.ceil((users.length / 6)), false);
    console.log("chunks", chunks, users.length);
    for(var i = 0; i < chunks.length; i++) {
      var jsx = chunks[i].map(function(user, idx) { return <CommunityGridItem key={i+"_"+idx} imgUrl={user.img}/> });
      communityGrid.push(jsx);
    }
    console.log("COMMUNITY GRID", communityGrid);
    return communityGrid;
  }, 

  render: function() {
    var communityGrid = this.renderGridItems();
    return (
      <div>
        {communityGrid.map(function(row) { 
          return <div className="row">{row}</div> 
        })}
      </div>
    );
  },

  _onChange: function() {
    this.setState(getComponentState());
  }

});

module.exports = CommunityGrid;
