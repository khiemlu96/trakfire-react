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
	console.log("SEARCH IS VISIBLE?", this.props.isVisible);
	 var search = instantsearch({
        appId: 'JINS7FFC4L',
        apiKey: '43a21d6dc61be940854d8f4dc4efad3e',
        indexName: 'posts',
        urlSync: false
      });

    search.addWidget(
      instantsearch.widgets.searchBox({
        container: '.tf-search-input'
      })
    );

    var hitTemplate =
					'<li class="media tf-media">' +
					  '<div class="media-left">' +
					    '<a href="#" class="tf-media-wrap">' +
					      '<img class="media-object tf-media-thumbnail" width="64" src={{img_url}} alt="..."></img>' +
					    '</a>' +
					  '</div>' +
					  '<div class="media-body">' +
					    '<h4 class="tf-media-title">' +
					      '<span class="pull-right"><small ref="count">{{vote_count}}</small> </span>' +
					      '<a href="#/post/{{id}}" class="no-decor">{{title}}</a>' +
					    '</h4>' +
					    '<h6 class="tf-media-artist">{{artist}}' +
					      //'<small class="pull-right"> posted by: <Link to={profileLink} class="tf-media-poster">{post.author_name}</Link> </small>' +
					    '</h6>' + 
					  '</div>' +
					'</li>';


    var noResultsTemplate =  '<div class="text-center">No results found matching <strong>{{query}}</strong>.</div>';

    search.addWidget(
      instantsearch.widgets.hits({
        container: '#tf-search-result',
        hitsPerPage: 20,
        templates: {
          empty: noResultsTemplate,
          item: hitTemplate
        },
        transformData: function(hit) {
          document.getElementById("tf-search-results").style.display = "block";
          document.getElementById("tf-search-result").style.display = "block";
          document.getElementById("tf-search-result").onclick = function() {
          	document.getElementById("tf-search-results").style.display = "none";
          }
          document.getElementById("closeModal").style.display = "block";
          document.getElementById("closeModal").onclick = function() {
          	document.getElementById("tf-search-results").style.display = "none";
          } 
          return hit;
        }
      })
    );

    /*search.addWidget(
	  instantsearch.widgets.stats({
	    container: '#tf-search-result-stat',
	    transformData: function(hit) {
	    	console.log(hit.nbHits);
	    	return hit;
	    }
	  })
	);*/

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