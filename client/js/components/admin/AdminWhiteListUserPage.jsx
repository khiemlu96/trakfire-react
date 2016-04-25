'use strict';

var React = require("react");
var Component = require("react").Component;
var PropTypes = require("react").PropTypes;
var Router = require('react-router');
var Link = Router.Link;
var Pagination = require("react-bootstrap").Pagination;
var Panel = require("react-bootstrap").Panel;
var Well = require("react-bootstrap").Well;
var Button = require("react-bootstrap").Button;
var PageHeader = require("react-bootstrap").PageHeader;
var Bootstrap = require('react-bootstrap');
var Modal = Bootstrap.Modal;
var Reqwest = require('reqwest');
var ReactPropTypes = React.PropTypes;

var UserStore = require('../../stores/UserStore.js');
var UserActions = require('../../actions/UserActions.js');

var delete_user_id = null;

function toArray(whileList_users) {
    var array = [];
    for(key in whileList_users) {
        array.push(whileList_users[key]);
    }
    return array.sort(compareCreatedAt);
}

function compareCreatedAt(a, b) {
    if(a.created_at < b.created_at) return 1;
    else if(a.created_at > b.created_at) return -1;
    else if(a.created_at == b.created_at) return 1;
    return 0;
}

function getLength(a) {
    var i = 0;
    for(key in a){
        i++;
    }
    return i;
}

var AdminWhiteListUserPage = React.createClass({
    
    propTypes: {        
        origin: ReactPropTypes.string
    },

    getInitialState: function() {
        this.whitelist_user = [];
        return {
            searchText: "",
            current_page: 1,
            whileList_users: UserStore.getAllWhiteListUsers()
        };
    },

    componentDidMount: function() {
        var data = {
            limit: 20,
            offset: 0,
            page: this.state.current_page
        };
        this.getAllWhiteListUsers(data);

        UserStore.addChangeListener(this._onChange);
        this.addUserTagginng();
    },

    getAllWhiteListUsers: function(data) {
        UserActions.getAllWhiteListUsers( this.props.origin + '/whitelists', data );
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
    },

    getUserCollection: function(data) {     
        UserActions.getAllUsers(this.props.origin + '/users', data);
    },

    removeEmptyMsg: function() {
        $(".empty-msg-atwho").remove();
    },

    addUserTagginng: function() {
        var self = this;
        self.whitelist_user = [];

        var at_config = {
            at: "",
            headerTpl: null,
            start_with_space: false,
            search_key: "handle",
            insertTpl: "<span handle='${handle}' data-value='${handle}' class='member'>${handle}</span>",
            displayTpl: "<li data-value='${email}' handle='${handle}'>${handle}  (<small>${email}</small>)</li>",
            limit: 10,
            callbacks: {
                beforeInsert: function(value, $li, e) {
                    self.removeEmptyMsg();
                    var email = $li[0].attributes["data-value"].value;
                    var handle = $li[0].attributes.handle.value;
                    var user = {email: email, handle: handle};

                    // Allow only one user at a time
                    if( self.whitelist_user.length === 1 ) {
                        self.whitelist_user = [];
                        $('#user_handle_input_box').find(".atwho-inserted").remove();
                    }

                    self.whitelist_user.push(user);                    
                    return value;
                },

                beforeReposition: function(offset) {
                    self.removeEmptyMsg();
                    var correctOffset = $('#user_handle_input_box').offset();
                    offset.top = correctOffset.top + $('#user_handle_input_box').height() + parseInt($('#user_handle_input_box').css('paddingTop'), 10) + parseInt($('#user_handle_input_box').css('paddingBottom'), 10) + parseInt($('#user_handle_input_box').css('borderTopWidth'), 10) + parseInt($('#user_handle_input_box').css('borderBottomWidth'), 10);
                    offset.left = correctOffset.left;

                    return offset;
                },

                remoteFilter: function(params, callback) {
                    self.removeEmptyMsg();
                    var passback = [];                  
                    
                    if(params !== "" ) {
                        var data = {
                            limit: 20,
                            search_key: params,
                            search_by: 'handle'
                        };

                        var url = self.props.origin+'/users';
                        Reqwest({
                            url: url,
                            type: 'json',
                            method: 'GET',
                            data: data,
                            contentType: 'application/json',
                            headers: {'Authorization': localStorage.getItem('jwt')},
                            success: function(resp) { 
                                if( resp.users.length > 0 ) {
                                    resp.users.forEach( function(user) {
                                        if( user.handle !== null ) {
                                            passback.push({
                                                'uid':user.uid,
                                                'name':user.username,
                                                'email':user.email,
                                                'handle': user.handle
                                            });
                                        }
                                    });
                                }

                                if(passback.length === 0) {
                                    self.removeEmptyMsg();
                                    $("body").append("<div class='empty-msg-atwho'>No Results</div>");
                                    $(".empty-msg-atwho").css('top', $("#user_handle_input_box").offset().top + $("#user_handle_input_box").height() + parseInt($('#user_handle_input_box').css('paddingTop'), 10) + parseInt($('#user_handle_input_box').css('paddingBottom'), 10) + parseInt($('#user_handle_input_box').css('borderTopWidth'), 10) + parseInt($('#user_handle_input_box').css('borderBottomWidth'), 10)).css('left', $("#user_handle_input_box").offset().left);
                                }
                                callback(passback);
                            },
                            error: function(error) {
                                console.error(url, error['response']);
                            }
                        });
                    }                    
                }
            }
        };

        $('#user_handle_input_box').atwho(at_config);
    },

    addUserToWhiteList: function() {
        var user = {};
        user['email'] = this.whitelist_user[0].email !== null ? this.whitelist_user[0].email : "";
        user['handle'] = this.whitelist_user[0].handle;
        
        var data = {
            user: user
        };

        UserActions.addUserToWhiteList(this.props.origin + '/whitelists', data);
    },

    showDelWhiteListUserPopup: function(user_id){
        delete_user_id = user_id;

        this.setState({
            showDelWhiteListUserPopup : true
        });
    },

    hideDelWhiteListUserPopup: function(){
        this.setState({
            showDelWhiteListUserPopup : false
        });
    },

    deleteWhiteListUser: function(){
        if(delete_user_id !== null ) {
            UserActions.deleteWhiteListUser(this.props.origin+'/whitelists/'+ delete_user_id);
        }        
        this.hideDelWhiteListUserPopup();
    },

    selectNextPage: function(event, obj) {
        var states = UserStore.getAllWhiteListUsersState();        
        var offset = states.offset + states.limit;
        var current_page = obj.eventKey;
        
        var data = {
            limit: 20,
            offset: offset,
            page: current_page
        };

        this.getAllWhiteListUsers(data);

        this.setState({
            current_page: current_page
        });
    },

    renderWhiteListUserGrid: function(whileList_users) {     
        if( whileList_users !== undefined && getLength(whileList_users) > 0 ) {
            var whiteListUserGridHtml = [];
            for( var id in whileList_users ) {
                var whileList_user = whileList_users[id];           

                var row = 
                    <tr className="gradeA odd" role="row">
                        <td className="aligned-left sorting_1">{whileList_user.username}</td>
                        <td className="aligned-left">{whileList_user.email}</td>
                        <td className="aligned-left">{whileList_user.handle}</td>
                        <td className="aligned-centered">
                            <div className="aligned-centered col-md-12 tf-admin-activity-button">
                                <a onClick={this.showDelWhiteListUserPopup.bind(this, whileList_user.id)}><span><i className="fa fa-trash-o"></i></span>Del</a>
                            </div>
                        </td>
                    </tr>;
                whiteListUserGridHtml.push(row);
            }
            return whiteListUserGridHtml;       
        } else {
            return(
                <tr className="aligned-centered" style={{display: 'table-row'}}>
                    <th colSpan="4"><center>No Result</center></th>
                </tr>
            );
        }
    },

    render: function() {
        var whileList_users = [];
        whileList_users = this.state.whileList_users;
        whileList_users = toArray(whileList_users);

        var whiteListUserGridHtml = this.renderWhiteListUserGrid( whileList_users );
        var states = UserStore.getAllWhiteListUsersState();

        var count = parseInt(states.offset) + parseInt(states.page_count);
        var limit_count = ( count > states.total_count ? states.total_count: count);

        return (
            <div>
                <div className = "row"></div>
                <div className = "col-lg-12 col-md-12">
                    <Panel header={<span>Add User To White List</span>}>
                        <div className="col-md-2">Search By Handle: &nbsp;</div>
                        <div ref="userInput" id="user_handle_input_box" className="col-md-6 inputor" contentEditable="true" onKeyUp={this.handleBackspace}>                            
                        </div>
                        <div className="col-md-3" pullRight>
                            <Button onClick={this.addUserToWhiteList}>Add User To White List</Button>
                        </div>
                    </Panel>
                </div>
                <div className="col-lg-12 col-md-12"> 
                    <Panel header={<span>All White List Users</span>}>
                        <div>
                            <div className="dataTable_wrapper">
                                <div id="dataTables-example_wrapper" className="dataTables_wrapper form-inline dt-bootstrap no-footer">

                                    <div className="row">
                                        <div className="col-sm-12">
                                            <table className="table table-striped table-bordered table-hover dataTable no-footer" id="dataTables-example" role="grid">
                                                <thead>
                                                    <tr role="row">
                                                        <th className="aligned-left" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 200} }>Name</th>
                                                        <th className="aligned-left" tabIndex="0" rowSpan="1" colSpan="1"  style={ {width: 200} }>Email</th>
                                                        <th className="aligned-left" tabIndex="0" rowSpan="1" colSpan="1"  style={ {width: 200} }>Handle</th>
                                                        <th className="aligned-centered" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 100} }>Delete?</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {whiteListUserGridHtml}            
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="dataTables_info" id="dataTables-example_info" role="status" aria-live="polite">
                                                Showing {states.offset} to {limit_count} of {states.total_count} entries
                                            </div>
                                        </div>
                                        <div className="col-sm-6" pullRight >
                                            <Pagination activePage={this.state.current_page} items={states.no_of_page} maxButtons={6} perPage={states.limit} first={true} last={true} prev={true} next={true} onSelect={ this.selectNextPage.bind(this) } />  
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel>                    
                </div>
                <div id="delete-modal-container">
                    <Modal id="delete-modal" show={this.state.showDelWhiteListUserPopup} onHide={this.hideDelWhiteListUserPopup}>
                        <Modal.Title>Confirm Delete?</Modal.Title>
                        <Modal.Body closeButton className="tf-modal-body">
                            <div className="row">Do you want to delete the Request?</div>
                            <div className="row">
                                <Button onClick={this.deleteWhiteListUser}>Yes</Button>
                                <Button onClick={this.hideDelWhiteListUserPopup}>Cancel</Button>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        );
    },

    _onChange: function() {
        this.setState({
            whileList_users: UserStore.getAllWhiteListUsers()
        });
        self.whitelist_user = [];
        $('#user_handle_input_box').find(".atwho-inserted").remove();
    }
});

module.exports = AdminWhiteListUserPage;