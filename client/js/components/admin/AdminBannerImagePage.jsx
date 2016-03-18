'use strict';

var React = require("react");
var Component = require("react").Component;
var PropTypes = require("react").PropTypes;

var Pagination = require("react-bootstrap").Pagination;
var Panel = require("react-bootstrap").Panel;
var Well = require("react-bootstrap").Well;
var Button = require("react-bootstrap").Button;
var PageHeader = require("react-bootstrap").PageHeader;
var PostStore = require('../../stores/PostStore.js');

var AdminBannerImagePage = React.createClass({

    render: function() {

        return (
            <div>
                <div className="col-lg-12"> 
                    <PageHeader>All Posts</PageHeader>
                </div>

                <div className="col-lg-12"> 
                    <Panel header={<span>All Posts</span>}>
                        <div>
                            <div className="dataTable_wrapper">
                                <div id="dataTables-example_wrapper" className="dataTables_wrapper form-inline dt-bootstrap no-footer">

                                    <div className="row">                    
                                        <div className="col-sm-3">
                                            <div id="dataTables-example_filter" className="dataTables_filter">
                                                <label>Search:<input type="search" className="form-control input-sm" placeholder="" aria-controls="dataTables-example" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-12">
                                            <table className="table table-striped table-bordered table-hover dataTable no-footer" id="dataTables-example" role="grid" aria-describedby="dataTables-example_info">
                                                <thead>
                                                    <tr role="row">
                                                        <th className="sorting_asc" tabIndex="0" aria-controls="dataTables-example" rowSpan="1" colSpan="1" aria-label="Rendering engine: activate to sort column descending" aria-sort="ascending" style={ {width: 265} }>Title</th>
                                                        <th className="sorting" tabIndex="0" aria-controls="dataTables-example" rowSpan="1" colSpan="1" aria-label="Browser: activate to sort column ascending" style={ {width: 321} }>Artist</th>
                                                        <th className="sorting" tabIndex="0" aria-controls="dataTables-example" rowSpan="1" colSpan="1" aria-label="Platform(s): activate to sort column ascending" style={ {width: 299} }>Posted By</th>
                                                        <th className="sorting" tabIndex="0" aria-controls="dataTables-example" rowSpan="1" colSpan="1" aria-label="Engine version: activate to sort column ascending" style={ {width: 231} }>Comments</th>
                                                        <th className="sorting" tabIndex="0" aria-controls="dataTables-example" rowSpan="1" colSpan="1" aria-label="CSS grade: activate to sort column ascending" style={ {width: 180} }>Votes</th>
                                                        <th className="" tabIndex="0" aria-controls="dataTables-example" rowSpan="1" colSpan="1" aria-label="CSS grade: activate to sort column ascending" style={ {width: 299} }>?</th>
                                                    </tr>
                                                </thead>
                                                <tbody>               
                                                    <tr className="gradeA odd" role="row">
                                                        <td className="sorting_1">Post1</td>
                                                        <td>Graves and Yoshinabu</td>
                                                        <td>Test Usr 1</td>
                                                        <td className="center">5</td>
                                                        <td className="center">10</td>
                                                        <td className="center">
                                                            <div className="col-md-6">
                                                                <a><span><i className="fa fa-pencil-square-o"></i></span>Edit</a>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <a><span><i className="fa fa-trash-o"></i></span>Del</a>
                                                            </div>
                                                        </td>
                                                    </tr>                          
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="dataTables_info" id="dataTables-example_info" role="status" aria-live="polite">
                                                Showing 1 to 10 of 57 entries
                                            </div>
                                        </div>
                                        <div className="col-sm-6" pullRight >
                                            <Pagination activePage={1} items={6} perPage={10} first={true} last={true} prev={true} next={true} onSelect={ (pageNumber) => {} } />  
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>
        );
    }
});

module.exports = AdminBannerImagePage;