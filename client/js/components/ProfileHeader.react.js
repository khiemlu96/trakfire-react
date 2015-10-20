var React = require('react');
var PostActions = require('../actions/PostActions');
var ReactPropTypes = React.PropTypes;

var ProfileHeader = React.createClass({

    propTypes: {
      userName: ReactPropTypes.string.isRequired,
      userTwitterLink: ReactPropTypes.string,
      userBio: ReactPropTypes.string.isRequired,
      userFacebookLink: ReactPropTypes.string,
      userImg: ReactPropTypes.string.isRequired
    },
  /*getDefaultProps: function(){
    return {
      userName : "DIPLO", 
      userBio : "Random white dude, DJ & Producer. Label owner of MAD DECENT <a> www.maddecent.com </a>",
      userImg : "https://pbs.twimg.com/profile_images/618481497159417856/mqVVw79M.jpg"
    }
  },*/
  /**
   * @return {object}
   */
  render: function() {
    return (
      <div className="tf-profile-wrapper"> 

        <img src={this.props.userImg} className="tf-profile-image"></img>

        <h1 className="tf-name">{this.props.userName}</h1> 
        <p className="tf-bio">{this.props.userBio}</p>

        <div className="tf-social-icons"> 
          <img src="assets/img/facebook_share.svg"></img>
          <img src="assets/img/twitter_share.svg"></img>
        </div>

      </div>
    );
  },


});

module.exports = ProfileHeader;