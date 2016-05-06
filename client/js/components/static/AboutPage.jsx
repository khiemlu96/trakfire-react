/**
 * Page: About Page
 */

var React = require('react');
var bootstrap = require('bootstrap');
var Bootstrap = require('react-bootstrap');
var PropTypes = require("react").PropTypes;
var UserStore = require('../../stores/UserStore.js');
var UserActions = require('../../actions/UserActions.js');
var ReactPropTypes = React.PropTypes;
var Panel = require("react-bootstrap").Panel;
var Link = require('react-router').Link;

function getLengthOfAnObjectArray(_array) {
    var index = 0;
    
    for(key in _array){
        index++;
    }
    return index;
}
/**
 * Class: AboutPage
 * The class renders the About page in App.
 *
 * @authored By: 
*/
var AboutPage = React.createClass({
    /**
     * @method: getInitialState
     * @description: Sets initials value of the following states in Components
     *
     * @parameters none
     *
     * @return object of states wihch have assigned initial values at the start level
    */
    getInitialState: function() {
        return {
            allUsersData: UserStore.getAllUsers()
        };
    },

    /*
     * Set all props types 
     *
    */
    propTypes: {        
        origin: ReactPropTypes.string
    },

    /**
     * This method will be called once the component is just rendered or mounted in Page
     * Call the method to get the user from DataBase.
     * Add a callback function for any change in UserStore dispatcher
     *
     * @parameters none
     * 
     * @return none
    */
    componentDidMount: function() {
        // Load all users data after component been mounted 
        this.loadAllUsersData();
        
        // Apply a call back function to change in User Store Dispatcher
        UserStore.addChangeListener( this.dispatcherChangeCallBack );
    },

    /**
     * This method call a function to load All user profile pic data 
     * 
     * @parameters None
     * 
     * @return None
    */
    loadAllUsersData: function() {
        // call the function from UserActions module
        var params = {
            limit: 'all',
            offset: 0,
            action_type: 'get_user_img'
        };

        UserActions.getAllUsers( this.props.origin + '/users', params );
    },

    /**  
     * This method will Form a HTML for Users Profile Circle Grid 
     * And return it to render()
     *  
     * @return HTMl Element
    */
    renderAllUsersData: function() {   
        var _allUsers = ( this.state.allUsersData !== null || this.state.allUsersData !== undefined ) ? this.state.allUsersData : [];

        if( getLengthOfAnObjectArray(_allUsers) > 0 ) {
            var _userListHtml = [];
            var singleUser = null;
            // Form a single row of each user
            for( var id in _allUsers ) {
                singleUser = _allUsers[id];
                var _singleRow = 
                    <tr className="gradeA odd" role="row">                        
                        <td className="aligned-centered">                            
                            <Link to={"/profile/"+ singleUser.id}>
                                <img className="tf-preview-img" src={singleUser.original_profile_img}></img>
                            </Link>
                        </td>
                        <td className="aligned-centered">
                            <Link to={"/profile/"+ singleUser.id}>{singleUser.name}</Link>
                        </td>
                    </tr>
                _userListHtml.push(_singleRow);
            }

            return _userListHtml;
        } else {
            return( 
                <tr className="aligned-centered" style={{display: 'table-row'}}>
                    <th colSpan="2"><center>No Result</center></th>
                </tr>
            );
        }
    },

    /**  
     * This method will Form a HTML for Users Profile Circle Grid 
     * And return it to render()
     * 
     * @parameters
     * users: Array of object which are users basically
     * 
     * @return HTMl Element
    */
    renderUserProfileGrid: function() {
        var _tableGridHtml = "";
        var _userGridHtml = this.renderAllUsersData();
        
        _tableGridHtml = <table className="table table-striped" role="grid">
                            <thead>
                                <tr role="row">                                    
                                    <th className="aligned-centered" tabIndex="0" rowSpan="1" colSpan="1">Profile Image</th>
                                    <th className="aligned-centered" tabIndex="0" rowSpan="1" colSpan="1">User Name</th>                               
                                </tr>
                            </thead>
                            <tbody>               
                                {_userGridHtml}                       
                            </tbody>
                        </table>;
        return _tableGridHtml;
    },

    /**  
     * This method will Form a HTML for a component and render or mount it on parent component
     * 
     * @return HTMl Element
    */
    render: function() {
        return ( 
            <div className = "container p-t-md about-page">
                <span className = "tf-static-page-header">ABOUT</span>

                <div className="col-lg-12 col-md-12">
                    <Panel className="col-lg-6 col-md-6">
                        {this.renderUserProfileGrid()}
                    </Panel>
                </div>
                <p>
                    Trakfire is an invite-only community of people who have the feel for music.It’s a place for tastemakers, both emerging and well known, to share their best finds from the vast seas of Soundcloud and YouTube.There's more noise out there than ever before, and worthy artistry often doesn't receive as much visibility as those with money, marketing, and connections.Our hope for Trakfire is to create a space where great music can surface up democratically, powered by people who love and know music. 
                </p> 
            </div>
        );
    },

    /**  
     * Set new loaded users in dispatcher to state 'users'
     * 
     * @return none
    */
    dispatcherChangeCallBack: function() {
        this.setState({
            allUsersData: UserStore.getAllUsers()
        });
    }
});

module.exports = AboutPage;