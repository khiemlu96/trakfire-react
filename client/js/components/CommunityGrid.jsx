var React = require('react');
var ReactPropTypes = React.PropTypes;
var Link = require('react-router').Link;

var Bootstrap = require('react-bootstrap');
var CommunityGridItem = require('./CommunityGridItem.jsx');
var UserStore = require('../stores/UserStore.js');
var UserActions = require('../actions/UserActions.js');

var imageUrlArray = [
  "https://pbs.twimg.com/profile_images/654132152108380160/NboKGPdi.jpg", /* grant */
  "https://pbs.twimg.com/profile_images/731728302679937025/-ckljE8x.jpg", /* arjun */
  "https://pbs.twimg.com/profile_images/739238139496013824/Di4Xv3Kl.jpg", /* drew osherow */
  "https://pbs.twimg.com/profile_images/705799608664854528/8lyscTUc.jpg", /* dj skee */
  "https://pbs.twimg.com/profile_images/711211307769450497/uXetn-Rd.jpg", /* bernard bennett-green */
  "https://pbs.twimg.com/profile_images/562454001241694209/bVnKVGt1.jpeg", /* ross lindly */
  "https://pbs.twimg.com/profile_images/712551168698880000/7O8S4wl8.jpg", /* joey masso */
  "https://pbs.twimg.com/profile_images/378800000051286778/1584e2c1f9aede7654f278e6cbb985b2.jpeg", /* nick dela cruz */
  "https://pbs.twimg.com/profile_images/739154832540340225/oq3T--as.jpg", /* chloe heavey */
  "https://pbs.twimg.com/profile_images/616016098270404608/6WYwLSB6.jpg", /* nick stilwell */
  "https://pbs.twimg.com/profile_images/665453087688028160/bi972SBS_400x400.jpg", /* stefen chra */
  "https://scontent-dfw1-1.xx.fbcdn.net/t31.0-8/12239385_10154273458899338_434860998774886403_o.jpg", /* alec lykken */
  "https://pbs.twimg.com/profile_images/662108755731963904/Rqb7h7fI.jpg", /* helena yohannes */
  "https://pbs.twimg.com/profile_images/1619174303/30388_534773737690_70902851_31598692_2588092_n.jpg", /* noah preston */
  "https://pbs.twimg.com/profile_images/646770209437564928/YRVfrN3b.jpg", /* nate stranzl */
  "https://pbs.twimg.com/profile_images/626091726088765440/IPc3BNuT.jpg", /* caitlin harriford */
  "https://pbs.twimg.com/profile_images/694679759599439872/E5XyfE4O.jpg", /* danny cagan */
  "https://pbs.twimg.com/profile_images/649438766713573376/Wy8jaAQT.jpg", /* nneoma akubuilo */
  "https://pbs.twimg.com/profile_images/726807586541023232/k2xsiF_n.jpg", /* zach cohan */
  "https://pbs.twimg.com/profile_images/596466463780667393/AKmLhSDB.jpg", /* larry love */
  "https://pbs.twimg.com/profile_images/595800738967748608/IZXMdQ8x.jpg", /* akash chandani */
  "https://pbs.twimg.com/profile_images/741335820347396096/VQX_C8Gm.jpg", /* brandon canada */
  "https://pbs.twimg.com/profile_images/622538564002164736/BFau3E6h.jpg", /* ben taft */
  "https://pbs.twimg.com/profile_images/551066724770934785/KdJr5kRS.jpeg", /* matt stern */
  "https://pbs.twimg.com/profile_images/659635680838967296/u0TFZbvv.jpg", /* andy thai */
  "https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-9/10256896_808015762543848_6524139530942005204_n.jpg?oh=6c9d2d3628abb07ebdd7e18140931269&oe=57CA4796", /* spencer price */
  "http://i.imgur.com/VswZaI3.png", /* alex griffin */
  "http://i.imgur.com/VbCclTU.png", /* kevin cortez */
  "http://i.imgur.com/cuIHAnz.jpg", /* shaun morris */
  "http://i.imgur.com/7NOtkC6.jpg", /* ethan watts */
  "http://i.imgur.com/nHwPdS0.jpg", /* gordon moore */
  "https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-9/13237834_10153904305891130_1972298033652733490_n.jpg?oh=57e1a96184dcf20d738982bff89ef998&oe=57C5551A" /* john fiorentino */
];

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
    var communityGrid = [];
    var chunks = chunkify(imageUrlArray, ((imageUrlArray.length)/6), true);
    console.log("chunks", chunks);
    for(var i = 0; i < chunks.length; i++) {
      var jsx = chunks[i].map(function(url, idx) { return <CommunityGridItem imgUrl={url}/> });
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
