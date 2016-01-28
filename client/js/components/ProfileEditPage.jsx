var React = require('react');
var ReactPropTypes = React.PropTypes;
var UserActions = require('../actions/UserActions.js');
var UserStore = require('../stores/UserStore.js');

var styleDisplay = {
    display: 'none'
};

function getAppState() {
    return {
        user: UserStore.getUser(),
        isVisible: true
    };
}

var ProfileEdit = React.createClass({

        propTypes: {
            onPostItemClick: ReactPropTypes.func, //Playability
            currStreamUrl: ReactPropTypes.string,
            origin: ReactPropTypes.string,
            isVisible:  ReactPropTypes.bool,
            toggleProfileEdit: ReactPropTypes.func
        },

        getInitialState: function() {
            return {
                user: this.props.user,
                isVisible: this.props.isVisible
            };
        },

        getUser: function(userid) {
            UserActions.getUser(this.props.origin + '/users/' + userid + '/', userid);
        },

        onChange: function(event) {
            var user = this.state.user;
            if(event.target.name === 'name')
                user.username = event.target.value;
            else if(event.target.name === 'email')
                user.email = event.target.value;
            else if(event.target.name === 'bio')
                user.bio = event.target.value;

            this.setState({
                user : user
            });
        },

        saveUserProfile: function(userid) {            
            this.props.toggleProfileEdit(false);
            var userId = this.props.user.id;
            
            var data = {
                user: {}
            };

            data['user']['username'] = this.state.user.username;
            data['user']['email'] = this.state.user.email;
            data['user']['tbio'] = this.state.user.bio;

            UserActions.updateProfile(this.props.origin + '/users/' + userId, data);
        },
        
        /**
         * @return {object}
         */
        render: function() {
            
            var user = this.state.user;

            if(this.props.isVisible === true ){
                styleDisplay.display = 'block';
            } else {
                styleDisplay.display = 'none';
            }

            return (
                <div className = "tf-profile-edit-wrapper" style={styleDisplay}>
                    <div className="row col-md-12 col-sm-12 col-xs-12">
                        <div className="col-md-3 col-xs-2 col-sm-2"> </div>
                        <div className="col-md-8 col-xs-8 col-sm-8 tf-user-profile-form">
                            <div className="col-md-3 col-sm-3 col-xs-3 tf-profile-img-wrapper"> 
                                <img src = {user.img} className = "tf-profile-image"> </img>
                            </div>
                            <div className="col-md-5 col-sm-5 col-xs-5 first-section"> 
                                <label> USERNAME </label>
                                <input type="text" name="name" ref="name" value={this.state.user.username} onChange={this.onChange}></input>
                                <label> EMAIL * </label>
                                <input type="text" name="email" ref="email" value={this.state.user.email} onChange={this.onChange}></input>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-4 second-section"> 
                                <label> FACEBOOK.COM/ </label>
                                <input type="text" name="facebook_url" ref="facebook_url" value="" disabled></input>
                                <label> TWITTER.COM/ </label>
                                <input type="text" name="twitter_url" ref="handle" value={user.handle} disabled></input>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12 last-section"> 
                                <label> BIO </label>
                                <input type="text" name="bio" ref="bio" value={this.state.user.bio} onChange={this.onChange}></input>
                            </div>
                        </div>
                        <div className="col-md-2 col-xs-2 col-sm-2">
                            <a onClick={this.saveUserProfile}><div className="is-active btn btn-primary" >Save</div></a>
                        </div>
                    </div>
                </div>
            );
        },

        _onChange: function() {
            this.setState(getAppState());
        }
    });

    module.exports = ProfileEdit;