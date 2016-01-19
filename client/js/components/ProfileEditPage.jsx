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

        saveUserProfile: function() {
            this.props.toggleProfileEdit(false);
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
                                <input type="text" name="name" ref="name" value={user.name}></input>
                                <label> EMAIL * </label>
                                <input type="text" name="email" ref="email" value={user.email}></input>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-4 second-section"> 
                                <label> FACEBOOK.COM/ </label>
                                <input type="text" name="facebook_url" ref="facebook_url" value="" disabled></input>
                                <label> TWITTER.COM/ </label>
                                <input type="text" name="twitter_url" ref="twitter_url" value={user.handle} disabled></input>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12 last-section"> 
                                <label> BIO </label>
                                <input type="text" name="bio" ref="bio" value={user.bio}></input>
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