var React = require('react');
var ReactPropTypes = React.PropTypes;
var Link = require('react-router').Link;

var editBtnDisplayStyle = {
    display: 'block'
};

var ProfileBar = React.createClass({

    PropTypes: {
        toggleProfileEdit: ReactPropTypes.func,
        showEditLink: ReactPropTypes.bool
    },

    getInitialState: function() {
        return ({
            showEditLink: this.props.showEditLink
        });
    },

    openEditProfile: function() {
        this.props.toggleProfileEdit(true);
    },

    /**
     * @return {object}
     */
    render: function() {
        if(this.state.showEditLink === true) {
            editBtnDisplayStyle.display = 'block';
        } else {
            editBtnDisplayStyle.display = 'none';
        }

        return ( 
            <div className = "tf-filter-bar" >
                <div className = "container col-md-12 col-xs-12" >
                    <div className="left">
                        <Link to="#!" className="tf-back-link"><h6>BACK</h6></Link>
                    </div>                    
                    <div className="right" style={editBtnDisplayStyle}>
                        <a onClick={this.openEditProfile}><div className="is-active btn btn-primary">Edit</div></a>
                    </div>
                </div> 
            </div>
        );
    },
});

module.exports = ProfileBar;