import React, { PropTypes, Component } from 'react';
import {Pagination, Panel, Well, Button, PageHeader} from "react-bootstrap";

var Tables = React.createClass({

  render: function() {
    return (

      <div>
        <div className="col-lg-12"> 
          <PageHeader>Tables</PageHeader> 
        </div>

        <div className="col-lg-12"> 
        	<Panel header={<span>All Posts</span>} >
       			<div> 
       				<div className="dataTable_wrapper">
                <div id="dataTables-example_wrapper" className="dataTables_wrapper form-inline dt-bootstrap no-footer">
                  
                  <div className="row">                    
                    <div className="col-sm-3">
                      <div id="dataTables-example_filter" className="dataTables_filter">
                        <label>Search:<input type="search" className="form-control input-sm" placeholder="" aria-controls="dataTables-example" /></label>
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
                          <tr className="gradeA even" role="row">
                            <td className="sorting_1">Post2</td>
                            <td>Point Point</td>
                            <td>Test Usr 1</td>
                            <td className="center">10</td>
                            <td className="center">9</td>
                            <td className="center">
                              <div className="col-md-6">
                                <a><span><i className="fa fa-pencil-square-o"></i></span>Edit</a>
                              </div>
                              <div className="col-md-6">
                                <a><span><i className="fa fa-trash-o"></i></span>Del</a>
                              </div>
                            </td>
                          </tr>
                          <tr className="gradeA odd" role="row">
                            <td className="sorting_1">Post3</td>
                            <td>AllanKingdom</td>
                            <td>Test Usr 2</td>
                            <td className="center">7</td>
                            <td className="center">5</td>
                            <td className="center">
                              <div className="col-md-6">
                                <a><span><i className="fa fa-pencil-square-o"></i></span>Edit</a>
                              </div>
                              <div className="col-md-6">
                                <a><span><i className="fa fa-trash-o"></i></span>Del</a>
                              </div>
                            </td>
                          </tr>
                          <tr className="gradeA even" role="row">
                            <td className="sorting_1">Post4</td>
                            <td>Desiigner</td>
                            <td>Test Usr 3</td>
                            <td className="center">13</td>
                            <td className="center">20</td>
                            <td className="center">
                              <div className="col-md-6">
                                <a><span><i className="fa fa-pencil-square-o"></i></span>Edit</a>
                              </div>
                              <div className="col-md-6">
                                <a><span><i className="fa fa-trash-o"></i></span>Del</a>
                              </div>
                            </td>
                          </tr>
                          <tr className="gradeA odd" role="row">
                            <td className="sorting_1">Post5</td>
                            <td>Kevin Gates</td>
                            <td>Test Usr 5</td>
                            <td className="center">4</td>
                            <td className="center">12</td>
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
                      <div className="dataTables_info" id="dataTables-example_info" role="status" aria-live="polite">Showing 1 to 10 of 57 entries</div>
                    </div>
                    <div className="col-sm-6" pullRight >
                      <Pagination activePage={1}
                        items={6} perPage={10} 
                        first={true} last={true}
                        prev={true} next={true}
                        onSelect={ (pageNumber) => {} } />  
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/*<div className="row ng-scope"> 
          <div className="col-lg-6"> 
            <Panel header={<span>Kitchen Sink </span>} >
                <div className="table-responsive"> 
                  <table className="table table-striped table-bordered table-hover"> 
                    <thead> <tr> <th># </th><th>First Name </th><th>Last Name </th><th>Username   </th></tr></thead>
                    <tbody> <tr> <td>1 </td><td>Mark </td><td>Otto </td><td>@mdo  </td></tr><tr> <td>2 </td><td>Jacob </td><td>Thornton </td><td>@fat  </td></tr><tr> <td>3 </td><td>Larry </td><td>the Bird </td><td>@twitter   </td></tr></tbody>
                  </table>
                </div>
            </Panel>
          </div>
          <div className="col-lg-6"> 
            <Panel header={<span>Basic Table</span>} >
                <div className="table-responsive"> 
                  <table className="table"> 
                    <thead> <tr> <th># </th><th>First Name </th><th>Last Name </th><th>Username   </th></tr></thead>
                    <tbody> <tr> <td>1 </td><td>Mark </td><td>Otto </td><td>@mdo  </td></tr><tr> <td>2 </td><td>Jacob </td><td>Thornton </td><td>@fat  </td></tr><tr> <td>3 </td><td>Larry </td><td>the Bird </td><td>@twitter   </td></tr></tbody>
                  </table> 
                </div>
            </Panel>
          </div>
        </div>

        <div className="row ng-scope"> 
                  <div className="col-lg-6"> 
                    <Panel header={<span>Striped Rows </span>} >
                        <div className="table-responsive"> 
                          <table className="table table-striped"> 
                            <thead> <tr> <th># </th><th>First Name </th><th>Last Name </th><th>Username   </th></tr></thead>
                            <tbody> <tr> <td>1 </td><td>Mark </td><td>Otto </td><td>@mdo  </td></tr><tr> <td>2 </td><td>Jacob </td><td>Thornton </td><td>@fat  </td></tr><tr> <td>3 </td><td>Larry </td><td>the Bird </td><td>@twitter   </td></tr></tbody>
                          </table> 
                        </div> 
                    </Panel>
                  </div>
                  <div className="col-lg-6"> 
                    <Panel header={<span>Bordered Table </span>} >
                        <div className="table-responsive table-bordered"> 
                          <table className="table"> 
                            <thead> <tr> <th># </th><th>First Name </th><th>Last Name </th><th>Username   </th></tr></thead>
                            <tbody> <tr> <td>1 </td><td>Mark </td><td>Otto </td><td>@mdo  </td></tr><tr> <td>2 </td><td>Jacob </td><td>Thornton </td><td>@fat  </td></tr><tr> <td>3 </td><td>Larry </td><td>the Bird </td><td>@twitter   </td></tr></tbody>
                          </table> 
                        </div>
                    </Panel>
                  </div>
                </div>
        
                <div className="row ng-scope"> 
                  <div className="col-lg-6"> 
                    <Panel header={<span>Hover Rows </span>} >
                        <div className="table-responsive"> 
                          <table className="table table-hover"> 
                            <thead> <tr> <th># </th><th>First Name </th><th>Last Name </th><th>Username   </th></tr></thead>
                            <tbody> <tr> <td>1 </td><td>Mark </td><td>Otto </td><td>@mdo  </td></tr><tr> <td>2 </td><td>Jacob </td><td>Thornton </td><td>@fat  </td></tr><tr> <td>3 </td><td>Larry </td><td>the Bird </td><td>@twitter   </td></tr></tbody>
                          </table> 
                        </div>
                    </Panel>
                  </div>
                  <div className="col-lg-6"> 
                    <Panel header={<span>Context Classes </span>} >
                        <div className="table-responsive"> 
                          <table className="table"> 
                            <thead> <tr> <th># </th><th>First Name </th><th>Last Name </th><th>Username   </th></tr></thead>
                            <tbody> <tr className="success"> <td>1 </td><td>Mark </td><td>Otto </td><td>@mdo  </td></tr><tr className="info"> <td>2 </td><td>Jacob </td><td>Thornton </td><td>@fat  </td></tr><tr className="warning"> <td>3 </td><td>Larry </td><td>the Bird </td><td>@twitter  </td></tr><tr className="danger"> <td>4 </td><td>John </td><td>Smith </td><td>@jsmith   </td></tr></tbody>
                          </table> 
                        </div>
                    </Panel>
                  </div>
                </div>*/}

      </div> 
    );
  }

});

export default Tables;