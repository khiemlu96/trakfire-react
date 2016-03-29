'use strict';

var React = require("react");
var Component = require("react").Component;
var PropTypes = require("react").PropTypes;

var Pagination = require("react-bootstrap").Pagination;
var Panel = require("react-bootstrap").Panel;
var Well = require("react-bootstrap").Well;
var Button = require("react-bootstrap").Button;
var PageHeader = require("react-bootstrap").PageHeader;
var Modal = require("react-bootstrap").Modal;

var UserStore = require('../../stores/UserStore.js');
var UserActions = require('../../actions/UserActions.js');

var delete_user_id;
var verify_user_id;
var verifyText = "";

function getLength(a) {
    var i = 0;
    for(key in a){
        i++;
    }
    return i;
}

var AdminUserPage = React.createClass({

    getInitialState: function(){
         return {
            users : UserStore.getAllUsers(),
            current_page : 1,
            searchText : "",
            userState : UserStore.getUsersState()
        };
    },

    getAllUsersFromApi: function(data){
        UserActions.getAllUsers(this.props.origin+'/users',data);
    },

    componentDidMount: function() {
        var data = {
            limit: 20,
            offset: 0,
            page: this.state.current_page
        };

        this.getAllUsersFromApi(data);
        UserStore.addChangeListener(this._onUserStateChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onUserStateChange);
    },

    showDelUserPopup: function(user_id){
        delete_user_id = user_id;

        this.setState({
            showDelUserPopup : true
        });

    },

    deleteUser: function(){
        UserActions.deleteUser(this.props.origin+'/users/'+delete_user_id);
        this.hideDelUserPopup();
    },

    hideDelUserPopup: function(){
        this.setState({
            showDelUserPopup : false
        });
    },

    selectNextPage: function(event, obj) {
        console.log(obj.eventKey);

        var userStates = this.state.userState;
        var offset = userStates.offset + userStates.limit;
        var current_page = obj.eventKey;

        var data = {
            limit: 20,
            offset: offset,
            page: current_page
        };

        this.getAllUsersFromApi(data);

        this.setState({
            current_page: current_page
        });

    },

    search: function(event) {
        var searchText = this.refs.searchInput.getDOMNode().value.trim();

        if( searchText !== "" ) {

            this.setState({
                searchText: searchText
            });

            var data = {
                limit: 20,
                offset: 0,
                search_key: searchText,
                page: 1
            };

            this.getAllUsersFromApi(data);
        }        
    },

    
    checkToVerifyUser: function(user_id){
        var checkbox = document.getElementById(user_id);
        var check = checkbox.checked;
       
        if(check){
            verifyText = "Verify";
            this.showVerifyUserPopup(user_id);
        }
        else
        {
            verifyText = "Unverify";
            this.showVerifyUserPopup(user_id);    
        }
    },

    showVerifyUserPopup: function(user_id){
        verify_user_id  = user_id;

        this.setState({
            showVerifyUserPopup : true
        });
    },

    verifyUser: function(){
        var data = {            
            user: {}
        };
        if(verifyText === "Verify"){
            data['user']['isVerify'] = true;
        }
        else if(verifyText === "Unverify"){
            data['user']['isVerify'] = null;
        }

        UserActions.verifyUser(this.props.origin+'/users/'+verify_user_id, data);
        this.hideVerifyUserPopup();
        UserStore.addChangeListener(this._onChange);
    },


    hideVerifyUserPopup: function(){
        this.setState({
            showVerifyUserPopup : false
        });
    },

    renderUserGrid: function(){
        var users = this.state.users;

        if( users !== undefined && getLength(users) > 0) {
            var userGridHtml = [];
            
            for( var id in users ) {
                var user = users[id];
                var isVerified = "";
    
                if(user.isVerified === true){
                    isVerified = "checked";
                }

                var row = 
                    <tr className="gradeA odd" role="row">
                        <td className="sorting_1">{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.handle}</td>
                        <td className="center">
                            <div className="tf-admin-activity-button col-md-6">
                                <a><span><i className="fa fa-pencil-square-o"></i></span>Edit</a>
                            </div>
                            <div className="tf-admin-activity-button col-md-6">
                                <a onClick={this.showDelUserPopup.bind(this, user.id)}><span><i className="fa fa-trash-o"></i></span>Del</a>
                            </div>
                        </td>
                        <td>
                            <div className="col-md-12 text-center"><input id={user.id} type="checkbox" ref="verify" checked={isVerified} onClick={this.checkToVerifyUser.bind(this, user.id)}/></div>
                        </td>
                    </tr>
                userGridHtml.push(row);
            } 
            return userGridHtml;       
        } else {
            return <tr></tr>;
        }       
    },


    render: function() {
        var userGridHtml = this.renderUserGrid();
        var userStates = this.state.userState;

        var count = parseInt(userStates.offset) + parseInt(userStates.page_count);
        var limit_count = ( count > userStates.total_count ? userStates.total_count: count);

        return (
            <div>
                <div className = "row"></div>

                <div className="col-lg-12"> 
                    <Panel header={<span>Trak Starters</span>} >
                        <div> 
                            <div className="dataTable_wrapper">
                                <div id="dataTables-example_wrapper" className="dataTables_wrapper form-inline dt-bootstrap no-footer">
                                    <div className="row">
                                        <div className="col-sm-4 pull-right">
                                            <div id="dataTables-example_filter" className="dataTables_filter">
                                                <label>Search:
                                                    <span><input type="search" ref="searchInput" className="form-control input-sm" placeholder="" aria-controls="dataTables-example" /></span>
                                                    <span><Button className="tf-search-button" onClick={this.search}><i className="fa fa-search"></i></Button></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-12">
                                            <table className="table table-striped table-bordered table-hover dataTable no-footer" id="dataTables-example" role="grid">
                                                <thead>
                                                    <tr role="row">
                                                        <th className="" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 321} }>User Name</th>
                                                        <th className="" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 299} }>Email</th>
                                                        <th className="" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 150} }>Handle</th>
                                                        <th className="center" tabIndex="0" rowSpan="1" colSpan="1"  style={ {width: 150} }>Edit / Delete?</th>
                                                        <th className="" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 50} }>Verified?</th>
                                                    </tr>
                                                </thead>
                                                <tbody>               
                                                    {userGridHtml}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="dataTables_info" id="dataTables-example_info" role="status" aria-live="polite">
                                                Showing {userStates.offset} to {limit_count} of {userStates.total_count} entries
                                            </div>
                                        </div>
                                        <div className="col-sm-6" pullRight>
                                            <Pagination activePage={this.state.current_page} items={userStates.no_of_page} perPage={userStates.limit} first={true} last={true} prev={true} next={true} onSelect={ this.selectNextPage.bind(this) } />  
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </div>

                <div id="delete-modal-container">
                    <Modal id="delete-modal" show={this.state.showDelUserPopup} onHide={this.hideDelUserPopup}>
                        <Modal.Title>Confirm Delete?</Modal.Title>
                        <Modal.Body closeButton className="tf-modal-body">
                            <div className="row">Do you want to delete the User?</div>
                            <div className="row">
                                <Button onClick={this.deleteUser}>Yes</Button>
                                <Button onClick={this.hideDelUserPopup}>Cancel</Button>
                            </div>                            
                        </Modal.Body>
                    </Modal>
                </div>

                <div id="verify-modal-container">
                    <Modal id="verify-modal" show={this.state.showVerifyUserPopup} onHide={this.hideVerifyUserPopup}>
                        <Modal.Title>Confirm {verifyText}?</Modal.Title>
                        <Modal.Body closeButton className="tf-modal-body">
                            <div className="row">Do you want to {verifyText} the User?</div>
                            <div className="row">
                                <Button onClick={this.verifyUser}>Yes</Button>
                                <Button onClick={this.hideVerifyUserPopup}>Cancel</Button>
                            </div>                            
                        </Modal.Body>
                    </Modal>
                </div>

            </div>
        );
    },

    _onUserStateChange: function() {

        this.setState({
            users : UserStore.getAllUsers(),
            userState : UserStore.getUsersState()
        });
    }
});

module.exports = AdminUserPage;