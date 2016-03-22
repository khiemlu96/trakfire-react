'use strict';

var React = require("react");
var Component = require("react").Component;
var PropTypes = require("react").PropTypes;

var Pagination = require("react-bootstrap").Pagination;
var Panel = require("react-bootstrap").Panel;
var Well = require("react-bootstrap").Well;
var Button = require("react-bootstrap").Button;
var PageHeader = require("react-bootstrap").PageHeader;

var UserStore = require('../../stores/UserStore.js');
var UserActions = require('../../actions/UserActions.js');

function getAppState() {
    return {
        users : UserStore.getAllUsers()
    };
}

function getLength(a) {
    var i = 0;
    for(key in a){
        i++;
    }
    return i;
}

var AdminUserPage = React.createClass({

    getInitialState: function(){
         return getAppState();
    },

    getAllUsersFromApi: function(){
        var data = {
            limit: 10,
            offset: 0
        }
        UserActions.getAllUsers(this.props.origin+'/users',data);
    },

    componentDidMount: function() {
        this.getAllUsersFromApi();
        UserStore.addChangeListener(this._onChange);
    },

    renderUserGrid: function(){
        var users = this.state.users;
        //console.log("====================== ADMIN USERS : ",users);

        if( users !== undefined && getLength(users) > 0) {
            var userGridHtml = [];
            for( var id in users ) {
                var user = users[id];
                var row = 
                    <tr className="gradeA odd" role="row">
                        <td className="sorting_1">{user.name}</td>
                        <td>{user.email}</td>
                        <td className="center">
                            <div className="col-md-6">
                                <a><span><i className="fa fa-pencil-square-o"></i></span>Edit</a>
                            </div>
                        <div className="col-md-6">
                            <a><span><i className="fa fa-trash-o"></i></span>Del</a>
                        </div>
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
        //console.log("============= USER GRID HTML : ",userGridHtml);
        return (
            <div>
                <div className="col-lg-12"> 
                    <PageHeader>All Users</PageHeader> 
                </div>

                <div className="col-lg-12"> 
                    <Panel header={<span>Trak Starters</span>} >
                        <div> 
                            <div className="dataTable_wrapper">
                                <div id="dataTables-example_wrapper" className="dataTables_wrapper form-inline dt-bootstrap no-footer">
                                    <div className="row">
                                        <div className="col-sm-9">
                                        </div>
                                        <div className="col-sm-3">
                                            <div id="dataTables-example_filter" className="dataTables_filter">
                                                <label>Search:<input type="search" className="form-control input-sm" placeholder="" aria-controls="dataTables-example" />
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
                                                        <th className="" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 299} }>Emails</th>
                                                        <th className="center" tabIndex="0" rowSpan="1" colSpan="1"  style={ {width: 180} }>?</th>
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
                                            <div className="dataTables_info" id="dataTables-example_info" role="status" aria-live="polite">Showing 1 to 10 of 57 entries</div>
                                        </div>
                                        <div className="col-sm-6" pullRight>
                                            <Pagination activePage={1} items={6} perPage={10} first={true} last={true}
                                            prev={true} next={true} onSelect={ (pageNumber) => {} } />  
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>
        );
    },
    _onChange: function() {
        this.setState(getAppState());
    }
});

module.exports = AdminUserPage;