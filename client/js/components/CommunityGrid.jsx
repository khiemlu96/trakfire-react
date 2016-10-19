var React = require('react');
var ReactPropTypes = React.PropTypes;
var Link = require('react-router').Link;

var Bootstrap = require('react-bootstrap');
var CommunityGridItem = require('./CommunityGridItem.jsx');
var UserStore = require('../stores/UserStore.js');
var UserActions = require('../actions/UserActions.js');

var imgToUser = {
  "https://pbs.twimg.com/profile_images/654132152108380160/NboKGPdi.jpg" : ["vibegordon", "Grant Collins"],
  "https://pbs.twimg.com/profile_images/731728302679937025/-ckljE8x.jpg": ["arjunkmehta", "Arjun Mehta"],
  "https://pbs.twimg.com/profile_images/772645022739013633/AB13Ktau.jpg": ["dosherow23", "Drew Osherow"],
  "https://pbs.twimg.com/profile_images/767932803530919936/0mbazVxA.jpg": ["djskee", "DJ SKEE"],
  "https://pbs.twimg.com/profile_images/760503094023118849/03yKeHE0.jpg": ["watchbbg", "Bernard Bennett-Green"],
  "https://pbs.twimg.com/profile_images/562454001241694209/bVnKVGt1.jpeg": ["Ross_Lindly", "Ross Lindly"],
  "https://pbs.twimg.com/profile_images/770115508884701184/oJ9z7-zY.jpg": ["_jmace", "Joey Masso"],
  "https://pbs.twimg.com/profile_images/675158010122117120/r0cPvKv2.jpg": ["JonTanners", "Jon Tanners"],
  "https://pbs.twimg.com/profile_images/378800000051286778/1584e2c1f9aede7654f278e6cbb985b2.jpeg": ["cruzcontrol5", "Nick De La Cruz"],
  "https://pbs.twimg.com/profile_images/739154832540340225/oq3T--as.jpg": ["Clo4Sho", "Chloe Heavey"],
  "https://pbs.twimg.com/profile_images/616016098270404608/6WYwLSB6.jpg": ["nicholasstillwell", "Nick Stillwell"],
  "https://pbs.twimg.com/profile_images/665453087688028160/bi972SBS_400x400.jpg": ["stefenchra", "Stephen Chraghchian"],
  "https://scontent-dfw1-1.xx.fbcdn.net/t31.0-8/12239385_10154273458899338_434860998774886403_o.jpg": [" aleclykken ", "Alec Lykken"],
  "https://pbs.twimg.com/profile_images/662108755731963904/Rqb7h7fI.jpg": ["TheReal_Helena", "Helena Yohannes"],
  "https://pbs.twimg.com/profile_images/1619174303/30388_534773737690_70902851_31598692_2588092_n.jpg": ["_noahEP", "Noah Preston"],
  "https://pbs.twimg.com/profile_images/646770209437564928/YRVfrN3b.jpg": ["stranzzz", "Nate Stranzl"],
  "https://scontent.xx.fbcdn.net/v/t1.0-9/11896235_10207878977997982_3363443496669409328_n.jpg?oh=4aa682d28a0c37deff1c61e9c4c1b369&oe=5855A389": ["iamcaitlinh", "Caitlin Harriford"],
  "https://pbs.twimg.com/profile_images/694679759599439872/E5XyfE4O.jpg": ["dannycagan", "Danny Cagan"],
  "https://pbs.twimg.com/profile_images/781713745269567488/7Aunq4gw.jpg": ["TJD_Nneoma", "Nneoma Akubuilo"],
  "https://pbs.twimg.com/profile_images/726807586541023232/k2xsiF_n.jpg": ["ZachCohan", "Zach Cohan"],
  "https://pbs.twimg.com/profile_images/596466463780667393/AKmLhSDB.jpg": ["LarryLoveWB", "Larry Love"],
  "https://pbs.twimg.com/profile_images/756189810767699968/uYqR_7Ix.jpg": ["luvkushmusic", "Akash Chandani"],
  "https://pbs.twimg.com/profile_images/741335820347396096/VQX_C8Gm.jpg": ["realtripcarter", "Brandon Canada"],
  "https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-9/13659111_10154299562278491_8345188877303351453_n.jpg?oh=55fa3643fec030835bfabb6af49d63d5&oe=5841C912": ["filthytaft", "Ben Taft"],
  "https://pbs.twimg.com/profile_images/783871741504331776/0nDIi0Ss.jpg": ["DJSterntables", "Matt Stern"],
  "https://pbs.twimg.com/profile_images/782275239426174976/BN5b6b9x.jpg": ["andymthai", "Andy Thai"],
  "https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-9/10256896_808015762543848_6524139530942005204_n.jpg?oh=052e1f71e16bc0737409f6d82f23cab3&oe=58900896": ["pricesh74", "Spencer Price"],
  "https://pbs.twimg.com/profile_images/684209980120027137/tvzBUvaI.png": ["johnnyfio", "John Fiorentino"],
  "https://pbs.twimg.com/profile_images/656678975415042048/o_NCQdCp.jpg": ["DionteGoodlett", "Dionte Goodlett"],
  "https://pbs.twimg.com/profile_images/515125794461720576/f9lH4ZmA.jpeg": ["GianniHarrell", "Gianni Harrell"],
  "https://pbs.twimg.com/profile_images/761418399314436096/HedVveZX.jpg": ["kalishaxoxo", "Kalisha Perera"],
  "https://pbs.twimg.com/profile_images/1573426901/Screen_shot_2011-10-05_at_12.24.44_AM.png": ["imnaughtfunny", "Kimari Jones"],
  "https://scontent-dft4-1.xx.fbcdn.net/v/t1.0-9/1919137_949438948480008_2830479285243350274_n.jpg?oh=abc056c5cf5f0f114de54af2dde36590&oe=58569358": ["Rollin1797", "Collin Remley"],
  "https://pbs.twimg.com/profile_images/722637224756527104/V2gzyuuA.jpg": ["kwright619", "Kevin Wright"],
  "https://pbs.twimg.com/profile_images/554870903771643904/QptVYRoS.jpeg": ["dillchen", "Dillon Chen"],
  "https://pbs.twimg.com/profile_images/717471203364114432/LRgWlhXY.jpg": ["reedrosenbluth", "Reed Rosenbluth"],
  "https://pbs.twimg.com/profile_images/680826862189191168/_zvtIlYY.jpg": ["adlerike", "Ike Adler"],
  "https://pbs.twimg.com/profile_images/787567105348542464/hwDxmaam.jpg": ["TheRealBpatt", "Brandon Patterson"],
  "https://pbs.twimg.com/profile_images/767970130630324224/PjHiElWM.jpg": ["Hprado15", "Hector Prado"],
  "https://pbs.twimg.com/profile_images/714302032996380672/mkhZ_e4V.jpg": ["duzi23", "Mduduzi Hlatshwayo"],
  "https://pbs.twimg.com/profile_images/782671840309350401/WqqMD1eO.jpg": ["LoHenderson", "Lauren Henderson"],
  "https://pbs.twimg.com/profile_images/775941330606231552/1_EeP3wl.jpg": ["venturebuddha", "Ben Choe"]
};

var imageUrlArray = [
  "https://pbs.twimg.com/profile_images/654132152108380160/NboKGPdi.jpg", /* grant */
  "https://pbs.twimg.com/profile_images/731728302679937025/-ckljE8x.jpg", /* arjun */
  "https://pbs.twimg.com/profile_images/772645022739013633/AB13Ktau.jpg", /* drew osherow */
  "https://pbs.twimg.com/profile_images/767932803530919936/0mbazVxA.jpg", /* dj skee */
  "https://pbs.twimg.com/profile_images/760503094023118849/03yKeHE0.jpg", /* bernard bennett-green */
  "https://pbs.twimg.com/profile_images/562454001241694209/bVnKVGt1.jpeg", /* ross lindly */
  "https://pbs.twimg.com/profile_images/770115508884701184/oJ9z7-zY.jpg", /* joey masso */
  "https://pbs.twimg.com/profile_images/675158010122117120/r0cPvKv2.jpg", /* jon tanners */
  "https://pbs.twimg.com/profile_images/378800000051286778/1584e2c1f9aede7654f278e6cbb985b2.jpeg", /* nick dela cruz */
  "https://pbs.twimg.com/profile_images/739154832540340225/oq3T--as.jpg", /* chloe heavey */
  "https://pbs.twimg.com/profile_images/616016098270404608/6WYwLSB6.jpg", /* nick stilwell */
  "https://pbs.twimg.com/profile_images/665453087688028160/bi972SBS_400x400.jpg", /* stefen chra */
  "https://scontent-dfw1-1.xx.fbcdn.net/t31.0-8/12239385_10154273458899338_434860998774886403_o.jpg", /* alec lykken */
  "https://pbs.twimg.com/profile_images/662108755731963904/Rqb7h7fI.jpg", /* helena yohannes */
  "https://pbs.twimg.com/profile_images/1619174303/30388_534773737690_70902851_31598692_2588092_n.jpg", /* noah preston */
  "https://pbs.twimg.com/profile_images/646770209437564928/YRVfrN3b.jpg", /* nate stranzl */
  "https://scontent.xx.fbcdn.net/v/t1.0-9/11896235_10207878977997982_3363443496669409328_n.jpg?oh=4aa682d28a0c37deff1c61e9c4c1b369&oe=5855A389", /* caitlin harriford */
  "https://pbs.twimg.com/profile_images/694679759599439872/E5XyfE4O.jpg", /* danny cagan */
  "https://pbs.twimg.com/profile_images/781713745269567488/7Aunq4gw.jpg", /* nneoma akubuilo */
  "https://pbs.twimg.com/profile_images/726807586541023232/k2xsiF_n.jpg", /* zach cohan */
  "https://pbs.twimg.com/profile_images/596466463780667393/AKmLhSDB.jpg", /* larry love */
  "https://pbs.twimg.com/profile_images/756189810767699968/uYqR_7Ix.jpg", /* akash chandani */
  "https://pbs.twimg.com/profile_images/741335820347396096/VQX_C8Gm.jpg", /* brandon canada */
  "https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-9/13659111_10154299562278491_8345188877303351453_n.jpg?oh=55fa3643fec030835bfabb6af49d63d5&oe=5841C912", /* ben taft */
  "https://pbs.twimg.com/profile_images/783871741504331776/0nDIi0Ss.jpg", /* matt stern */
  "https://pbs.twimg.com/profile_images/782275239426174976/BN5b6b9x.jpg", /* andy thai */
  "https://scontent-lax3-1.xx.fbcdn.net/v/t1.0-9/10256896_808015762543848_6524139530942005204_n.jpg?oh=052e1f71e16bc0737409f6d82f23cab3&oe=58900896", /* spencer price */
  "https://pbs.twimg.com/profile_images/684209980120027137/tvzBUvaI.png", /* john fiorentino */
  "https://pbs.twimg.com/profile_images/656678975415042048/o_NCQdCp.jpg", /* dionte goodlett */
  "https://pbs.twimg.com/profile_images/515125794461720576/f9lH4ZmA.jpeg", /* gianni harrell */
  "https://pbs.twimg.com/profile_images/761418399314436096/HedVveZX.jpg", /* kalisha */
  "https://pbs.twimg.com/profile_images/1573426901/Screen_shot_2011-10-05_at_12.24.44_AM.png", /* kimari jones */
  "https://scontent-dft4-1.xx.fbcdn.net/v/t1.0-9/1919137_949438948480008_2830479285243350274_n.jpg?oh=abc056c5cf5f0f114de54af2dde36590&oe=58569358", /* collin remley */
  "https://pbs.twimg.com/profile_images/722637224756527104/V2gzyuuA.jpg", /* kevin wright */
  "https://pbs.twimg.com/profile_images/554870903771643904/QptVYRoS.jpeg", /* dillon chen */
  "https://pbs.twimg.com/profile_images/717471203364114432/LRgWlhXY.jpg", /* reed rosenbluth */
  "https://pbs.twimg.com/profile_images/680826862189191168/_zvtIlYY.jpg", /* ike adler */
  "https://pbs.twimg.com/profile_images/787567105348542464/hwDxmaam.jpg", /* brandon patterson */
  "https://pbs.twimg.com/profile_images/767970130630324224/PjHiElWM.jpg", /* hector prado */
  "https://pbs.twimg.com/profile_images/714302032996380672/mkhZ_e4V.jpg", /* mduduzi hlatshwayo */
  "https://pbs.twimg.com/profile_images/782671840309350401/WqqMD1eO.jpg", /* lauren henderson */
  "https://pbs.twimg.com/profile_images/775941330606231552/1_EeP3wl.jpg" /* ben choe */
];

function toArray(obj) {
  var array = [];
  for(key in obj) {
    array.push(obj[key]);
  }
  return array;
}

function chunkify(a) {
  var len = a.length, out = [], i = 0, temp = [], count = 0;
  while(count <= len) {
    if(i == 6 || count == len) {
      out.push(temp)
      temp = []
      i = 0
    }
    temp.push(a[count])
    i++;
    count++;
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
    var chunks = chunkify(imageUrlArray, Math.floor(imageUrlArray.length/6));
    console.log("chunks", chunks, chunks.length);
    for(var i = 0; i < chunks.length; i++) {
      var jsx = chunks[i].map(function(url, idx) {
        console.log('url', url, idx, imgToUser[url])
        var info = imgToUser[url];
        var handle = info[0];
        var name = info[1];
        var twturl = "https://twitter.com/"+handle
        console.log("COMMUNITY GRID:: ", twturl, name);
        return <CommunityGridItem imgUrl={url} href={twturl} name={name}/>
      });
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
