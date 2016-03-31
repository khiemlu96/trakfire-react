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
var Algolia = require('algoliasearch');
var instantsearch = require('instantsearch.js');
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

var SearchBar = React.createClass({

	propTypes: {
		isVisible: ReactPropTypes.bool,
		onPlayBtnClick: ReactPropTypes.func,
   	 	currStreamUrl: ReactPropTypes.string,
   	 	searchKeyword: ReactPropTypes.string
	},
	
	componentDidMount: function() {
		
	 var search = instantsearch({
        appId: 'YX1WDN49CX',
        apiKey: '50d31a5aee4abf796b908e368f312027',
        indexName: 'posts',
        urlSync: false,
        searchOnEmptyQuery: false,
        searchParameters: {query:this.props.searchKeyword}
      });

    search.addWidget(
      instantsearch.widgets.searchBox({
        container: '.tf-search-input'
      })
    );

    var hitTemplate =
                      '<div class="hit media">' +
                        '<div >'+
                          '<div class="media-body tf-search-item-content">' +
                          '<div class="tf-post-item--votes is-upvoted" ref="upvotes">'+
                              '<span>'+
                                  '<b>&#9650;</b>'+
                              '</span>'+
                              '<br/>'+
                              '<span ref="count">'+
                                  '<b>{{vote_count}}</b>'+
                              '</span>'+
                            '</div>'+
                            '<div class="col-md-5 tf-thumbnail tf-search-panel"  style="background-image: url(\'{{img_url}}\');"></div>' + 
                            '<div class="col-md-7 tf-post-item--info">'+
                              '<h5 >{{{title}}} {{#stars}}<span class="ais-star-rating--star{{^.}}__empty{{/.}}"></span>{{/stars}}</h5>' +
                              '<p class="year">{{artist}}</p><p class="genre">{{#genre}}<span class="badge">{{.}}</span> {{/genre}}</p>' +
                            '</div>' +
                            '<div class="tf-search-item-auth-img" ref="author_img">'+
                              '<span class="" ref="author_img">'+
                                '<img class="author_img" src="../assets/img/tf_placeholder.png" />'+
                              '</span>'+
                            '</div>'+
                          '</div>' +
                        '</div>' +
                      '</div>';
    var noResultsTemplate =  '<div class="text-center">No results found matching <strong>{{query}}</strong>.</div>';

    search.addWidget(
      instantsearch.widgets.hits({
        container: '#tf-search-result',
        hitsPerPage: 3,
        cssClasses: {
          item: 'col-md-4',
          root:'row'
        },
        templates: {
          empty: noResultsTemplate,
          item: hitTemplate
        },
        transformData: function(hit) {
          console.log("ONE HIT", hit);
          document.getElementById("tf-search-result").style.display = "block";
          return hit;
        }
      })
    );

    search.addWidget(
	  instantsearch.widgets.stats({
	    container: '#tf-search-result-stat',
	    transformData: function(hit) {
	    	console.log(hit.nbHits);
	    	if(hit.nbHits > 3){
	    		document.getElementById("show-more-btn-container").style.display = "block";
	    	}
	    	else{
	    		document.getElementById("show-more-btn-container").style.display = "none";
	    	}
	    	return hit;
	    }
	  })
	);

    search.start();

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
	    var SPACE = 32;
	    if( e.keyCode == SPACE ) {
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

		return (
			<div></div>
			
		);
	}
});

module.exports = SearchBar;