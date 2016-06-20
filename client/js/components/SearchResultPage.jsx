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
var SearchBar = require('./SearchBar.jsx');
var createBrowserHistory = require('history/lib/createBrowserHistory');
var SearchItemContainer = require("./SearchItemContainer.jsx");
//var history = createBrowserHistory();

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
        currStreamUrl: ReactPropTypes.string,
        searchKey:ReactPropTypes.string
    },

    getInitialState: function() {
        console.log("indexName");
        var key = 'DEVA';

        console.log(this.props.params.searchkey);
        return {
            searchkey: this.props.params.searchkey,
            posts: this.props.posts
        };
    },

    componentDidMount: function() {
        //$(document.body).on('keydown', this.handleKeyDown);
    var search = instantsearch({
        appId: '2CGJRVYAYN',
        apiKey: 'd216e9a395320d63a1b68ea0b20b9347',
        indexName: 'posts',
        urlSync: true,
        searchOnEmptyQuery: false,
        searchParameters: {query:this.props.params.searchkey}
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
        container: '.tf-search-result-list',
        hitsPerPage: 20,
        cssClasses: {
          item: 'col-md-4',
          root:'row'
        },
        templates: {
          empty: noResultsTemplate,
          item: hitTemplate
        },
        transformData: function(hit) {
          console.log("BUVA");
          document.getElementById("tf-search-bar").style.display = "none";
          return hit;
        }
      })
    );

    search.addWidget(
      instantsearch.widgets.sortBySelector({
        container: '#sort-by-container',
        indices: [
          {name: 'vote_count', label: 'UPVOTES'},
          {name: 'posts', label: 'Posts'}
        ]
      })
    );


    search.start();

    },


    render: function() {

        return (
            <div className="tf-search-page-container col-md-12" style={searchResultStyle}>
                <div className="row search-text-container">
                    <a href="#!" className="tf-back-link"><h4>BACK</h4></a>
                    <span className="tf-search-page-heading">#{this.props.searchkey}</span>
                    <div className="tf-search-page-sort-container">
                        <span className="">SORT BY &nbsp;&nbsp;
                            <span className="tf-sort-dropdown" id="sort-by-container">
                            </span>
                        </span>
                    </div>
                </div>
                <div className="row col-md-12 tf-search-result-list">

                </div>
            </div>
        );
    }
});

module.exports = SearchResultPage;
