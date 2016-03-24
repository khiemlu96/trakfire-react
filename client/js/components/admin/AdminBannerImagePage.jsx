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
                                                        <th className="" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 265} }>Title</th>
                                                        <th className="" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 299} }>Type</th>
                                                        <th className="" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 231} }>Size(kb)</th>
                                                        <th className="" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 180} }>Preview</th>
                                                        <th className="" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 299} }>Delete?</th>
                                                    </tr>
                                                </thead>
                                                <tbody>               
                                                    <tr className="gradeA odd" role="row">
                                                        <td className="sorting_1">Post Image</td>
                                                        <td>JPEG</td>
                                                        <td>596</td>
                                                        <td className="center">
                                                            <div className="tf-preview-img-container">
                                                                <img className="tf-preview-img" src="/assets/img/tf_placeholder.png"></img>
                                                            </div>
                                                        </td>
                                                        <td className="center">                                                            
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
<<<<<<< HEAD
                                            <Pagination activePage={1} items={6} perPage={10} first={true} last={true} prev={true} next={true} onSelect={ (pageNumber) => {} } />  
=======
                                            <Pagination activePage={1} items={6} perPage={10} first={true} last={true} prev={true} next={true}  />  
>>>>>>> d65f33d9d66359dc7b2a61856c4dfe033a54c254
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