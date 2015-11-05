var React = require('react');
var ReactPropTypes = React.PropTypes;
var Link = require("react-router").Link;
var UserStore = require('../stores/UserStore.js');
var UserActions = require('../actions/UserActions.js');

function getAppState() {
  return {
    user: UserStore.getCurrentUser()
  };
}

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

var EmailAcquirePage = React.createClass({

  propTypes : {
    updateUserWithEmail: ReactPropTypes.func.isRequired
  }, 

  getInitialState: function() {
    return getAppState();
  }, 

  updateUserWithEmail: function() {
    var email = this.refs.email.getDOMNode().value;
    //console.log("EMAIL TO VALIDATE IS", email);
    if(validateEmail(email)){
      //console.log('GOT THE EMAIL DOE');
      UserActions.updateEmail(this.props.origin+'/users/'+this.state.user.id, email);
      mixpanel.identify(this.state.user.id);
      mixpanel.track("Updated email");
      mixpanel.people.set_once({
          '$email': email
      });
      this.props.history.pushState(null, '/');
    } else {
      //console.log("SHIT NIGGA U MISSED");
      this.refs.err.getDOMNode().value = "Please enter a valid email";
    }
  }, 

  componentDidMount: function() {
    mixpanel.identify(this.state.user.id);
    mixpanel.track("User arrived on email acquisition page");
    mixpanel.alias(this.state.user.username);
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
        <div className="tf-email-acquire">
          <div className="tf-email-acq-error" ref="err"></div>
          <h2> Slide us that email. </h2>
          <input type="email" className="tf-email-input" placeholder="slime@szn.com" ref="email"></input>
          <br></br>
          <br></br>
          <a href="#!" onClick={this.updateUserWithEmail} className="tf-link">CONTINUE</a>
        </div>
    );
  },


});

module.exports = EmailAcquirePage;
