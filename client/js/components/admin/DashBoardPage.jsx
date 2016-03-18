'use strict';

var React = require("react");
var Router = require('react-router');
var bootstrap = require('bootstrap');
var Bootstrap = require('react-bootstrap');
var ReactPropTypes = React.PropTypes;
var classNames = require('classnames');
var NavDropdown = require('react-bootstrap').NavDropdown;
var MenuItem = require('react-bootstrap').MenuItem;
var PageHeader = require('react-bootstrap').PageHeader;
var DropdownButton = require('react-bootstrap').DropdownButton;
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;
var Navbar = require('react-bootstrap').Navbar;
var Panel = require("react-bootstrap").Panel;
var ListGroup = require("react-bootstrap").ListGroup;
var ListGroupItem = require("react-bootstrap").ListGroupItem;
var Button = require("react-bootstrap").Button;

var StatWidget = require('./StatWidget.jsx');

var DashBoardPage = React.createClass({

    componentDidMount: function() {

    },

    render: function() {
        return ( 
            <div>
                <div className = "row">
                    <div className = "col-lg-12">
                        <PageHeader> Dashboard </PageHeader> 
                    </div> 
                </div>

                <div className = "row">
                    <div className = "col-lg-3 col-md-6">
                        <StatWidget style = "primary" icon = "fa fa-music fa-5x" count = "26" headerText = "Traks!" footerText = "View Details" linkTo = "/" />
                    </div> 
                    <div className = "col-lg-3 col-md-6">
                        <StatWidget style = "panel-green" icon = "fa fa-user fa-5x" count = "12" headerText = "Users!" footerText = "View Details" linkTo = "/" />
                    </div> 
                    <div className = "col-lg-3 col-md-6">
                        <StatWidget style = "panel-yellow" icon = "fa fa-comments fa-5x" count = "124" headerText = "Comments!" footerText = "View Details" linkTo = "/" />
                    </div>     
                </div>

                <div className = "row">
                    <div className = "col-lg-12">
                        <Panel
                            header = {
                                <span>
                                    <i className = "fa fa-bar-chart-o fa-fw" > < /i> Posted Tracks 
                                    <div className = "pull-right" >
                                        <DropdownButton title = "Dropdown" bsSize = "xs" pullRight>
                                        <MenuItem eventKey = "1"> Day </MenuItem> 
                                        <MenuItem eventKey = "2"> Month </MenuItem> 
                                        <MenuItem eventKey = "3"> Year </MenuItem> 
                                        </DropdownButton> 
                                    </div> 
                                </span>
                            }> 
                            <div>
                            </div>
                        </Panel>
                    </div>
                </div> 
            </div>
        );
    }
});

module.exports = DashBoardPage;