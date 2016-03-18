import React, { PropTypes, Component } from 'react';
import {Pagination, Panel, Well, Button, PageHeader} from "react-bootstrap";

var Tables = React.createClass({

  render: function() {
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
                      {/*<div className="dataTables_length" id="dataTables-example_length">
                                              <label>Show <select name="dataTables-example_length" aria-controls="dataTables-example" className="form-control input-sm"><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select> entries</label>
                                            </div>*/}
                    </div>
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
                            <th className="sorting" tabIndex="0" aria-controls="dataTables-example" rowSpan="1" colSpan="1" aria-label="Browser: activate to sort column ascending" style={ {width: 321} }>User Name</th>
                            <th className="sorting" tabIndex="0" aria-controls="dataTables-example" rowSpan="1" colSpan="1" aria-label="Platform(s): activate to sort column ascending" style={ {width: 299} }>Emails</th>
                            <th className="center" tabIndex="0" aria-controls="dataTables-example" rowSpan="1" colSpan="1" aria-label="CSS grade: activate to sort column ascending" style={ {width: 180} }>?</th>
                          </tr>
                        </thead>
                        <tbody>               
                          <tr className="gradeA odd" role="row">
                            <td className="sorting_1">Test User 1</td>
                            <td>test1@gmail.com</td>
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
                            <td className="sorting_1">Test User 2</td>
                            <td>test2@gmail.com</td>
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
                            <td className="sorting_1">Test User 3</td>
                            <td>test3@gmail.com</td>
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
                            <td className="sorting_1">Test User 4</td>
                            <td>test4@gmail.com</td>
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
                            <td className="sorting_1">Test User 5</td>
                            <td>Ctest4@gmail.com</td>
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