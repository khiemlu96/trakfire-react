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

var UserStore = require('../../stores/UserStore.js');
var UserActions = require('../../actions/UserActions.js');

var delete_request_id = null;

function toArray(request_invites) {
    var array = [];
    for(key in request_invites) {
        array.push(request_invites[key]);
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

var AdminRequestInvitesListPage = React.createClass({

    getInitialState: function() {
        return {
            request_invites: UserStore.getUserRequestInvites(),
            current_page: 1,
            showDelRequestPopup: false
        };
    },

    getUserRequestInvites: function(data) {
        var url = this.props.origin + '/applications';
        UserActions.getUserRequestInvites(url, data);
    },

    componentDidMount: function() {
        var data = {
            limit: 20,
            offset: 0,
            page: this.state.current_page
        };
        this.getUserRequestInvites(data);        
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
    },

    showDelUserRequestInvitePopup: function(request_id){
        delete_request_id = request_id;

        this.setState({
            showDelRequestPopup : true
        });
    },
    hideDelUserRequestInvitePopup: function(){
        this.setState({
            showDelRequestPopup : false
        });
    },

    deleteRequest: function(){
        if(delete_request_id !== null ) {
            UserActions.deleteRequest(this.props.origin+'/applications/'+ delete_request_id);
        }        
        this.hideDelUserRequestInvitePopup();
    },

    renderUserRequestInvitesGrid: function(request_invites) {         
        if( request_invites !== undefined && getLength(request_invites) > 0 ) {
            var requestInvitesGridHtml = [];
            for( var id in request_invites ) {
                var request_invite = request_invites[id];           

                var row = 
                    <tr className="gradeA odd" role="row">
                        <td className="aligned-left sorting_1" style={{width: 150}}>{request_invite.name}</td>
                        <td className="aligned-left" style={{width: 150}}>{request_invite.handle}</td>
                        <td className="aligned-left" style={{width: 200}}>{request_invite.email}</td>
                        <td className="aligned-left" style={{width: 200}}>{request_invite.sc1}</td>
                        <td className="aligned-left" style={{width: 200}}>{request_invite.sc2}</td>
                        <td className="aligned-left" style={{width: 200}}>{request_invite.sc3}</td>
                        <td className="aligned-centered" style={{width: 100}}>
                            <div className="aligned-centered col-md-12 tf-admin-activity-button">
                                <a onClick={this.showDelUserRequestInvitePopup.bind(this, request_invite.id)}><span><i className="fa fa-trash-o"></i></span>Del</a>
                            </div>
                        </td>
                    </tr>;
                requestInvitesGridHtml.push(row);
            }
            return requestInvitesGridHtml;       
        } else {
            return(
                <tr className="aligned-centered" style={{display: 'table-row'}}>
                    <th colSpan="7"><center>No Result</center></th>
                </tr>
            );
        }
    },

    selectNextPage: function(event, obj) {
        var states = UserStore.getUserRequestInvitesStats();        
        var offset = states.offset + states.limit;
        var current_page = obj.eventKey;
        
        var data = {
            limit: 20,
            offset: offset,
            page: current_page
        };

        this.getUserRequestInvites(data);

        this.setState({
            current_page: current_page
        });
    },

    render: function() { 
        var request_invites = [];
        request_invites = this.state.request_invites;

        request_invites = toArray(request_invites);

        var requestInvitesGridHtml = this.renderUserRequestInvitesGrid( request_invites );
        var states = UserStore.getUserRequestInvitesStats();

        var count = parseInt(states.offset) + parseInt(states.page_count);
        var limit_count = ( count > states.total_count ? states.total_count: count);
        
        return (
            <div>
                <div className = "row"></div>

                <div className="col-lg-12"> 
                    <Panel header={<span>All User Invite Requests</span>}>
                        <div>
                            <div className="dataTable_wrapper">
                                <div id="dataTables-example_wrapper" className="dataTables_wrapper form-inline dt-bootstrap no-footer">

                                    <div className="row">
                                        <div className="col-sm-12">
                                            <table className="table table-striped table-bordered table-hover dataTable no-footer" id="dataTables-example" role="grid">
                                                <thead>
                                                    <tr role="row">
                                                        <th className="aligned-left" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 150} }>Name</th>
                                                        <th className="aligned-left" tabIndex="0" rowSpan="1" colSpan="1"  style={ {width: 150} }>Handle</th>
                                                        <th className="aligned-left" tabIndex="0" rowSpan="1" colSpan="1"  style={ {width: 200} }>Email</th>
                                                        <th className="aligned-centered" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 200} }>Track 1</th>
                                                        <th className="aligned-centered" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 200} }>Track 2</th>
                                                        <th className="aligned-centered" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 200} }>Track 3</th>
                                                        <th className="aligned-centered" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 100} }>Delete?</th>
                                                    </tr>
                                                </thead>
                                                <tbody>               
                                                    {requestInvitesGridHtml}                       
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>                                    
                                </div>
                            </div>
                        </div>
                    </Panel>
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

                <div id="delete-modal-container">
                    <Modal id="delete-modal" show={this.state.showDelRequestPopup} onHide={this.hideDelUserRequestInvitePopup}>
                        <Modal.Title>Confirm Delete?</Modal.Title>
                        <Modal.Body closeButton className="tf-modal-body">
                            <div className="row">Do you want to delete the Request?</div>
                            <div className="row">
                                <Button onClick={this.deleteRequest}>Yes</Button>
                                <Button onClick={this.hideDelUserRequestInvitePopup}>Cancel</Button>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        );
    },

    _onChange: function() {
        this.setState({
            request_invites: UserStore.getUserRequestInvites()
        });
    }
});

module.exports = AdminRequestInvitesListPage;