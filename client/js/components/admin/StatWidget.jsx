var React = require("react");
var Panel = require("react-bootstrap").Panel;
var Router = require('react-router');
var Link = Router.Link;

var StatWidget = React.createClass({
    render: function() {
        return ( 
            <Panel className = "stat" bsStyle = {this.props.style} 
                header = {
                    <div className = "row">
                    <div className = "col-xs-3">
                    </div>
                    <div className = "col-xs-9 text-right">
                    <div className = "huge"> {this.props.count} </div> <div> {this.props.headerText} 
                    </div> </div> </div>
                }
                footer = { 
                    <Link to = {this.props.linkTo}>
                    <span className = "pull-left"> {this.props.footerText} 
                    </span> 
                    <span className = "pull-right"> 
                        <i className = "fa fa-arrow-circle-right"> </i>
                    </span >
                    <div className = "clearfix" > < /div> 
                    </Link>
                }>
            </Panel>
        );
    }
});

module.exports = StatWidget;
