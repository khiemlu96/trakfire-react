var React = require('react');
var ReactPropTypes = React.PropTypes;

function getAppState() {
  return {
    user: UserStore.getCurrentUser(), 
    userid: new Uri(location.search).getQueryParamValue('id'),
    username: new Uri(location.search).getQueryParamValue('uname')
  };
}

var LandingPage = React.createClass({

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
      UserActions.updateEmail(this.props.origin+'/users/'+this.state.userid, email);
      mixpanel.identify(this.state.userid);
      mixpanel.track("Updated email and name");
      mixpanel.people.set_once({
          '$email': email,
          '$name': this.state.username
      });
      this.props.history.pushState(null, '/');
    } else {
      //console.log("SHIT NIGGA U MISSED");
      this.refs.err.getDOMNode().value = "Please enter a valid email";
    }
  }, 

  componentDidMount: function() {
    var id = this.state.userid;
    console.log(id);
    mixpanel.identify(id);
    mixpanel.track("Landed on the landing page");
    //mixpanel.alias(this.state.user.username);
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

module.exports = LandingPage;
