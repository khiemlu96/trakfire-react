var React = require('react');
var ReactPropTypes = React.PropTypes;
var UserStore = require('../stores/UserStore.js');

function getAppState() {
  return {
    user: UserStore.getCurrentUser()
  };
}
var EmailAcquirePage = React.createClass({

  propTypes : {
    onPostItemClick: ReactPropTypes.func, //Playability
    currStreamUrl: ReactPropTypes.string
  }, 

  getInitialState: function() {
    return getAppState();
  }, 

  componentDidMount: function() {
    /*mixpanel.identify(this.state.user.id);
    mixpanel.track("Arrived on profile page");
    mixpanel.alias(this.state.user.username);*/
  },

  /**
   * @return {object}
   */
  render: function() {
    console.log("USER TO RENDER", this.state.user)
    var user = this.state.user;
    return (
      <div>
        <div className="tf-email-acquire">
          <h2> Slide us that email. </h2>
          <input type="email" placeholder="slime@szn.com"></input>
        </div>
      </div>
    );
  },


});

module.exports = EmailAcquirePage;
