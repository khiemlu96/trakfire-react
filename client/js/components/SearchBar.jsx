/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var Router = require('react-router');
var Bootstrap = require('react-bootstrap');
var Link = Router.Link;
var SearchResultModal = require('./SearchResult.jsx');

var Tooltip = Bootstrap.Tooltip;
var OverlayTrigger = Bootstrap.OverlayTrigger;
var Popover = Bootstrap.Popover;
var ReactPropTypes = React.PropTypes;

var searchBoxStyle = {
	backgroundColor: '#161616',
	maxHeight: 90,
	maxWidth: '100%',
	left: '0 !important',
	border: '1px solid #2b2b2b',
	position: 'fixed'
};
var searchInputArea = {
	backgroundColor: '#161616',
	border: 'none',
	textAlign: 'center',
	fontSize: 20,
	height: 60,
	fontWeight: 600,
	maxWidth: '97%'
};
var closeButtonStyle = {
	fontSize: 40,
	color: '#ff0d55',
	textDecoration: 'none',
	verticalAlign: 'middle',
	float: 'right'
};
var searchIconStyle = {
	cursor: 'pointer',
	color: '#ff0d55',
	fontSize: '18px',
	marginRight: '15px'
};

var SearchBar = React.createClass({

	propTypes: {
		isVisible: ReactPropTypes.bool,
		onPlayBtnClick: ReactPropTypes.func,
   	 	currStreamUrl: ReactPropTypes.string
	},
	
	componentDidMount: function() {
	    $(document.body).on('keydown', this.handleKeyDown);
	},

	componentWillUnmount: function() {
	    $(document.body).off('keydown', this.handleKeyDown);
	},

	getInitialState: function() {
		return {
			isVisible: this.props.isVisible,
			showSearchResultPopup: false
		};
	},

	handleKeyDown: function(e) {
	    var ENTER = 13;
	    if( e.keyCode == ENTER ) {
	    	this.closeModal();
	    	var searchKey = e.target.value;
	        this.showSearchResult(searchKey);
	    }
	},

	closeModal: function() {
		this.setState({
			isVisible: false
		});		
	},

	renderSearchBar: function() {
		this.setState({
			isVisible: true
		});	
		searchBoxStyle.display = 'block';
	},

	showSearchResult: function(searchKey) {
		this.setState({
			showSearchResultPopup: true
		});

		React.unmountComponentAtNode(document.getElementById('search-result'));
		React.render(
			<SearchResultModal 
				isSearchVisible={true} 
				searchKeyword={searchKey} 
				onPlayBtnClick = {this.props.onPlayBtnClick}
    			currStreamUrl={this.props.currStreamUrl} />, 
			document.getElementById("search-result")
		);
	},

	/**
	 * @return {object}
	 */
	render: function() {
		if (this.state.isVisible === true) {
			searchBoxStyle.display = 'block';
		} else {
			searchBoxStyle.display = 'none';
		}

		return (
			<OverlayTrigger trigger = "click" rootClose placement = "bottom"
				overlay = { 
					< Popover id="tf-search-bar" className = "tf-search-input-box col-sm-12 col-xs-12 col-md-12" style = {searchBoxStyle}>
						< div >
							<input  ref="searchInput" type = "text" onKeyDown={this.handleKeyDown} className = "tf-search-input" 
							placeholder = "WHAT ARE YOU LOOKING FOR?" style = {searchInputArea} >
							</input> 
							< a onClick = {this.closeModal()} role = "button" style = {closeButtonStyle} > &times; < /a> 
						< /div> 
					< /Popover>
				} >
				<span className = "glyphicon glyphicon-search" onClick={this.renderSearchBar} style = {searchIconStyle}></span>		 
			</OverlayTrigger>
			
		);
	}
});

module.exports = SearchBar;