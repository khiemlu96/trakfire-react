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
var PostStore = require('../stores/PostStore.js');
var SearchItemContainer = require('./SearchItemContainer.jsx');
var Link = Router.Link;

var SearchResultPage = require('./SearchResultPage.jsx');
var Tooltip = Bootstrap.Tooltip;
var OverlayTrigger = Bootstrap.OverlayTrigger;
var Popover = Bootstrap.Popover;
var ReactPropTypes = React.PropTypes;

var searchResultStyle = {
    backgroundColor: '#161616',
    height: 400,
    width: '100%',
    border: '1px solid #2b2b2b',
    position: 'fixed'
};
var searchInputArea = {
    backgroundColor: '#161616',
    border: 'none',
    textAlign: 'center',
    fontSize: 20,
    height: 65,
    fontWeight: 600,
    maxWidth: '98%'
};
var closeButtonStyle = {
    fontSize: 40,
    color: '#ff0d55',
    textDecoration: 'none',
    float: 'right',
    position: 'absolute',
    right: 10,
    top: 20
};

var searchIconStyle = {
    cursor: 'pointer'
};

function getLength(a) {
    var i = 0;
    for(key in a){
        i++;
    }
    return i;
}

var SearchResultModal = React.createClass({

    propTypes: {
        isSearchVisible: ReactPropTypes.bool,
        onPlayBtnClick: ReactPropTypes.func,
        currStreamUrl: ReactPropTypes.string
    },

    getInitialState: function() {
        return {
            posts: [],
            isSearchVisible: this.props.isSearchVisible
        };
    },

    closeModal: function() {
        this.setState({
            isSearchVisible: false
        });
        searchResultStyle.display = 'block';
    },

    showSearchResultPage: function() {
        this.closeModal();
        
        React.render(   <SearchResultPage 
                        searchkey={this.props.searchKeyword} 
                        posts={this.state.posts}
                        post_count={getLength(this.state.posts)}
                        onPlayBtnClick={this.props.onPlayBtnClick} 
                        currStreamUrl={this.props.currStreamUrl}/>, 
                        document.getElementById('main_container')
                    );
    },

    /**
     * @return {object}
     */
    render: function() {

        if (this.state.isSearchVisible === true) {
            searchResultStyle.display = 'block';
        } else {
            searchResultStyle.display = 'none';
        }
        var posts =  PostStore.getAll();
        this.state.posts = posts;
        var total_result_count = getLength(posts);
        var search_post_container = [];

        for (var i = 1; i <= 3; i++) {
            var post = posts[i];
            var postItem = <SearchItemContainer 
                            post = {post} 
                            onClick={this.props.onClick} 
                            key={post.key} 
                            trackIdx={i} 
                            post={post} 
                            currStreamUrl={this.props.currStreamUrl} />
            search_post_container.push(postItem);
        }

        return ( 
            <div className="tf-search-result-popup  col-sm-12 col-xs-12 col-md-12" style={searchResultStyle}>
                <div className="row search-text-container">
                    <center><h3>#{this.props.searchKeyword}</h3></center>
                </div>
                <div className="row col-md-12 col-sm-12 col-xs-12">
                    <ul className="tf-item-list-container">
                        {search_post_container}
                    </ul>                   
                </div>
                <div className="row show-more-btn-container col-md-12 col-sm-12 col-xs-12">  
                    <div className="show-more-result-btn btn btn-pimary" onClick={this.showSearchResultPage}>
                        <b>See more results ({total_result_count})</b>
                    </div>
                </div>
                < a onClick = {() => this.closeModal()} role = "button" style = {closeButtonStyle} > &times; < /a> 
            </div>            
        );
    }
});

module.exports = SearchResultModal;