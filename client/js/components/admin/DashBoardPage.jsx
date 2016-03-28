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

var range_type = "1";

//var Chart = require('react-d3-core').Chart;
//var LineChart = require('react-d3-basic').LineChart;
var LineChart = require("./react-chartjs/index.js").Line;

var chartOptions = {
        ///Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines : true,

    //String - Colour of the grid lines
    scaleGridLineColor : "rgba(0,0,0,.05)",

    //Number - Width of the grid lines
    scaleGridLineWidth : 1,

    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,

    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,

    //Boolean - Whether the line is curved between points
    bezierCurve : true,

    //Number - Tension of the bezier curve between points
    bezierCurveTension : 0.4,

    //Boolean - Whether to show a dot for each point
    pointDot : true,

    //Number - Radius of each point dot in pixels
    pointDotRadius : 4,

    //Number - Pixel width of point dot stroke
    pointDotStrokeWidth : 1,

    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius : 20,

    //Boolean - Whether to show a stroke for datasets
    datasetStroke : true,

    //Number - Pixel width of dataset stroke
    datasetStrokeWidth : 2,

    //Boolean - Whether to fill the dataset with a colour
    datasetFill : true,

    //String - A legend template
    //legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>"

    //Boolean - Whether to horizontally center the label and point dot inside the grid
    offsetGridLines : false
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
        //this.renderChart();
        UserStore.addChangeListener(this._onChange);
    },

    getAdminState: function() {
        var data = {
            range_type: range_type
        };

        UserActions.getAdminState( this.props.origin+'/admin_state', data );
    },

    renderChart: function() {

        var chartData = this.state.admin_state.chart_data;

        if( range_type === "1" ) {
            chartData = {
                labels: chartData[0],
                datasets: [
                    {
                        fillColor: "#25BDFF",
                        strokeColor: "#25BDFF",
                        pointColor: "#25BDFF",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "#25BDFF",
                        data: chartData[1]
                    }
                ]
            };
        } else if( range_type === "2" ) {
            chartData = {
                labels: chartData[0],
                datasets: [
                    {
                        fillColor: "#25BDFF",
                        strokeColor: "#25BDFF",
                        pointColor: "#25BDFF",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "#25BDFF",
                        data: chartData[1]
                    }
                ]
            };
        } else if( range_type === "3" ) {
            chartData = {
                labels: chartData[0],
                datasets: [
                    {
                        fillColor: "#25BDFF",
                        strokeColor: "#25BDFF",
                        pointColor: "#25BDFF",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "#25BDFF",
                        data: chartData[1]
                    }
                ]
            };
        }

        React.render(
            <div style={styles.graphContainer}>
                <LineChart data={chartData} options={chartOptions} />
            </div>
            ,document.getElementById('chart-container')
        );
    },

    select: function(event, eventKey) {
        range_type = eventKey;
        this.getAdminState();
        this.renderChart();
    },

    render: function() {
        var admin_state = this.state.admin_state;
        
        if( range_type === "1" ) 
            var title = 'day';
        else if( range_type === "2" ) 
            var title = 'month';
        else if( range_type === "3" ) 
            var title = 'year';

        return ( 
            <div>
                <div className = "row">
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
                        <Panel id="Chart-panel"
                            header = {
                                <span>
                                    <i className = "fa fa-bar-chart-o fa-fw" > < /i> Posted Tracks 
                                    <div className = "pull-right" >
                                        <DropdownButton title = {title} bsSize = "xs" pullRight id="dropdown_period">
                                            <MenuItem eventKey = "1" onSelect={this.select.bind(this)}> Day </MenuItem> 
                                            <MenuItem eventKey = "2" onSelect={this.select.bind(this)}> Month </MenuItem> 
                                            <MenuItem eventKey = "3" onSelect={this.select.bind(this)}> Year </MenuItem> 
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
        this.renderChart();       
    }
});

module.exports = DashBoardPage;