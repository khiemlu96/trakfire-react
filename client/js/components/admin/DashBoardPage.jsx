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
var UserActions = require('../../actions/UserActions.js');
var UserStore = require('../../stores/UserStore.js');
var StatWidget = require('./StatWidget.jsx');

//var Chart = require('react-d3-core').Chart;
//var LineChart = require('react-d3-basic').LineChart;
var LineChart = require("react-chartjs").Line;

var chartOptions = {
    bezierCurve : false,
    datasetFill : false,
    pointDotStrokeWidth: 4,
    scaleShowVerticalLines: false,
    responsive: true
};

var styles = {
    "graphContainer" : {
        "backgroundColor" : "#fff",
        "height" : "350px",
        "width" : "850px",
        "marginTop" : "15px",
        "padding" : "20px"
    }
};

var DashBoardPage = React.createClass({

    getInitialState: function() {
        return({
            admin_state: {
                posts: 0,
                comments: 0,
                users: 0
            }
        });
    },

    componentDidMount: function() {
        this.getAdminState();
        this.renderChart();
        UserStore.addChangeListener(this._onChange);
    },

    getAdminState: function() {
        var data = {
            range_type: 'day'
        };

        UserActions.getAdminState(this.props.origin+'/admin_state', data);
    },

    renderChart: function() {
        var chartData = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    fillColor: "#25BDFF",
                    strokeColor: "#25BDFF",
                    pointColor: "#25BDFF",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "#25BDFF",
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        React.render(
            <div style={styles.graphContainer}>
                <LineChart data={chartData} options={chartOptions} width="200" height="150" />
            </div>
            ,document.getElementById('chart-container')
        );
    },


    render: function() {
        var admin_state = this.state.admin_state;

        return ( 
            <div>
                <div className = "row">
                    <div className = "col-lg-12">
                        <PageHeader> Dashboard </PageHeader> 
                    </div> 
                </div>

                <div className = "row">
                    <div className = "col-lg-3 col-md-6">
                        <StatWidget style = "primary" icon = "fa fa-music fa-5x" count = {admin_state.posts} headerText = "Traks" footerText = "View All Posts" linkTo = "/admin/posts" />
                    </div> 
                    <div className = "col-lg-3 col-md-6">
                        <StatWidget style = "panel-green" icon = "fa fa-user fa-5x" count = {admin_state.users} headerText = "Users" footerText = "View All Users" linkTo = "/admin/users" />
                    </div> 
                    <div className = "col-lg-3 col-md-6">
                        <StatWidget style = "panel-yellow" icon = "fa fa-comments fa-5x" count = {admin_state.comments} headerText = "Comments" footerText = "View Details" linkTo = "/admin/posts" />
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
                            <div id = "chart-container">

                            </div>
                        </Panel>
                    </div>
                </div> 
            </div>
        );
    },

    _onChange: function() {
        this.setState({
            admin_state: UserStore.getAdminState()
        });        
    }
});

module.exports = DashBoardPage;