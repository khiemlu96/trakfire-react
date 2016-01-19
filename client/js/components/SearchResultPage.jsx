/*
 * @class SearchResultPage
 *
 * @description This page shows all items of search result
 *  
*/

var React = require('react');
var Router = require('react-router');
var Bootstrap = require('react-bootstrap');
var ReactPropTypes = React.PropTypes;
var Link = Router.Link; 

var createBrowserHistory = require('history/lib/createBrowserHistory');
var SearchItemContainer = require("./SearchItemContainer.jsx");
var history = createBrowserHistory();

var searchResultStyle = {
    backgroundColor: '#161616',
    height: '100%',
    width: '100%',
    border: '1px solid #2b2b2b',
    position: 'fixed'
};

function toArray(obj) {
    var array = [];
    for(key in obj) {
    array.push(obj[key]);
    }
    return array.sort(compareCreatedAt);
}

var SearchResultPage = React.createClass({
    propTypes: {
        origin: ReactPropTypes.func.isRequired,
        onPlayBtnClick: ReactPropTypes.func,
        currStreamUrl: ReactPropTypes.string
    },

    getInitialState: function() {
        return {
        	searchText: this.props.searchkey,
            posts: this.props.posts
        };
    },

	render: function() {  
        var search_post_container = [];
        var i = 0;
        if(this.props.post_count > 0) {
            for(key in this.props.posts) {
                var post = this.props.posts[key];
                var postItem = <SearchItemContainer 
                                post = {post} 
                                onPlayBtnClick={this.props.onPlayBtnClick}
                                key={post.key} 
                                trackIdx={i} 
                                post={post} 
                                currStreamUrl={this.props.currStreamUrl} />
                search_post_container.push(postItem);
                i++;
            }
        }
               
		return (
			<div className="tf-search-page-container col-md-12" style={searchResultStyle}>
                <div className="row search-text-container">
                    <a href="#!" className="tf-back-link"><h4>BACK</h4></a>
                    <span className="tf-search-page-heading">#{this.props.searchkey}</span>
                    <div className="tf-search-page-sort-container">
                        <span className="">SORT BY &nbsp;&nbsp;
                            <span className="tf-sort-dropdown">
                                <a>UPDATES</a>&nbsp;&nbsp;
                                <a>&#9660;</a>
                            </span>
                        </span>
                    </div>
                </div>
                <div className="row col-md-12">
                    <ul className="tf-item-list-container">
                        {search_post_container}
                    </ul>                   
                </div>
            </div>
		);
	}
});

module.exports = SearchResultPage;
