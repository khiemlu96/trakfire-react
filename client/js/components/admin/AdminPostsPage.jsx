'use strict';

var React = require("react");
var Component = require("react").Component;
var PropTypes = require("react").PropTypes;
var Router = require('react-router');
var Link = Router.Link;
var Pagination = require("react-bootstrap").Pagination;
var Panel = require("react-bootstrap").Panel;
var Well = require("react-bootstrap").Well;
var Button = require("react-bootstrap").Button;
var PageHeader = require("react-bootstrap").PageHeader;
var Bootstrap = require('react-bootstrap');
var Modal = Bootstrap.Modal;

var PostStore = require('../../stores/PostStore.js');
var PostAction= require('../../actions/PostActions.js');

var delete_posts = [];

var _dayCount = 0;

function toArray(posts) {
    var array = [];
    for(key in posts) {
        array.push(posts[key]);
    }
    return array.sort(compareCreatedAt);
}

function compareCreatedAt(a, b) {
    if(a.created_at < b.created_at) return 1;
    else if(a.created_at > b.created_at) return -1;
    else if(a.created_at == b.created_at) return 1;
    return 0;
}

function getLength(a) {
    var i = 0;
    for(key in a){
        i++;
    }
    return i;
}

var AdminPostsPage = React.createClass({

    getInitialState: function() {
        return {
            posts: PostStore.getAdminPosts(),
            searchText: "",
            current_page: 1
        };
    },

    showDelPostPopup: function(post_id) {
        delete_posts = [];
        delete_posts.push(post_id);

        this.setState({
            showDelPostPopup: true
        });        
    },

    hideDelPostPopup: function() {
        this.setState({
            showDelPostPopup: false
        });
    },

    deletePost: function() {
        if(delete_posts.length > 0) {
            for(var key in delete_posts) {
                PostAction.deletePost(this.props.origin + '/posts/' + delete_posts[key]);
            }            
        }
        this.hideDelPostPopup();
    },

    getAdminPostsBatch: function(data) {
        var url = this.props.origin + '/posts';
        PostAction.getAdminPostsBatch(url, data);
    },

    componentDidMount: function() {
        var data = {
            limit: 20,
            offset: 0,
            action_type: 'admin_post_batch',
            page: this.state.current_page
        };
        this.getAdminPostsBatch(data);        
        PostStore.addChangeListener(this._onChange);
    },

    renderPostGrid: function(posts) {         
        if( posts !== undefined && getLength(posts) > 0 ) {
            var postGridHtml = [];
            for( var id in posts ) {
                var post = posts[id];

                //Set comment count to 0 if no any comment id posted
                if( post.comment_count === null) {
                    post.comment_count = 0;
                }

                //Set vote count to 0 if no any comment id posted
                if( post.vote_count === null) {
                    post.vote_count = 0;
                }

                var row = 
                    <tr className="gradeA odd" role="row">
                        <td className="aligned-left sorting_1">{post.title}</td>
                        <td className="aligned-left">{post.artist}</td>
                        <td className="aligned-left">{post.user.username}</td>
                        <td className="aligned-centered"><Link to={'/post/'+post.id}>{post.comment_count}</Link></td>
                        <td className="aligned-centered"><Link to={'/post/'+post.id}>{post.vote_count}</Link></td>
                        <td className="aligned-centered">                            
                            <div className="aligned-centered col-md-12">
                                <a onClick={this.showDelPostPopup.bind(this, post.id)} className="tf-del-post-link">
                                    <span><i className="fa fa-trash-o"></i></span>
                                    Delete
                                </a>
                            </div>
                        </td>
                    </tr>;
                postGridHtml.push(row);
            }
            return postGridHtml;       
        } else {
            return(
                <tr className="aligned-centered" style={{display: 'table-row'}}>
                    <th colSpan="6"><center>No Result</center></th>
                </tr>
            );
        }       
    },

    selectNextPage: function(event, obj) {
        console.log(obj.eventKey);

        var states = this.state.posts.state;        
        var offset = states.offset + states.limit;
        var current_page = obj.eventKey;

        var data = {
            limit: 20,
            offset: offset,
            action_type: 'admin_post_batch',
            page: current_page
        };

        this.getAdminPostsBatch(data);

        this.setState({
            current_page: current_page
        });
    },

    search: function(event) {
        var _searchText = this.refs.searchInput.getDOMNode().value.trim();

        if(_searchText !== "" ) {
            
            this.setState({
                searchText: _searchText
            });

            var url = this.props.origin + '/posts';
            var data = {
                limit: 20,
                offset: 0,
                action_type: 'admin_post_batch',
                search_key: _searchText,
                page: 1
            };
            PostAction.getAdminPostsBatch(url, data);
        }        
    },

    render: function() { 
        
        var posts = this.state.posts.posts;
        posts = toArray(posts);
        var postGridHtml = this.renderPostGrid( posts );
        var states = this.state.posts.state;

        var count = parseInt(states.offset) + parseInt(states.page_count);
        var limit_count = ( count > states.total_count ? states.total_count: count);
        
        return (
            <div>
                <div className = "row"></div>

                <div className="col-lg-12"> 
                    <Panel header={<span>All Posts</span>}>
                        <div>
                            <div className="dataTable_wrapper">
                                <div id="dataTables-example_wrapper" className="dataTables_wrapper form-inline dt-bootstrap no-footer">

                                    <div className="row">                    
                                        <div className="col-sm-6 col-md-4">
                                            <div id="dataTables-example_filter" className="dataTables_filter">
                                                <label>Search:
                                                    <div>
                                                        <span><input type="search" ref="searchInput" className="form-control input-sm" placeholder="" aria-controls="dataTables-example" /></span>
                                                        <span><Button className="tf-search-button" onClick={this.search}><i className="fa fa-search"></i></Button></span>
                                                    </div>
                                                </label>                                                
                                            </div>                                            
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-12">
                                            <table className="table table-striped table-bordered table-hover dataTable no-footer" id="dataTables-example" role="grid">
                                                <thead>
                                                    <tr role="row">
                                                        <th className="aligned-left" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 350} }>Title</th>
                                                        <th className="aligned-left" tabIndex="0" rowSpan="1" colSpan="1"  style={ {width: 275} }>Artist</th>
                                                        <th className="aligned-left" tabIndex="0" rowSpan="1" colSpan="1"  style={ {width: 175} }>Posted By</th>
                                                        <th className="aligned-centered" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 100} }>Comments</th>
                                                        <th className="aligned-centered" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 100} }>Votes</th>
                                                        <th className="aligned-centered" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 100} }>Delete?</th>
                                                    </tr>
                                                </thead>
                                                <tbody>               
                                                    {postGridHtml}                       
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="dataTables_info" id="dataTables-example_info" role="status" aria-live="polite">
                                                Showing {states.offset} to {limit_count} of {states.total_count} entries
                                            </div>
                                        </div>
                                        <div className="col-sm-6" pullRight >
                                            <Pagination activePage={this.state.current_page} items={states.no_of_page} perPage={states.limit} first={true} last={true} prev={true} next={true} onSelect={ this.selectNextPage.bind(this) } />  
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </div>

                <div id="delete-modal-container">
                    <Modal id="delete-modal" show={this.state.showDelPostPopup} onHide={this.hideDelPostPopup}>
                        <Modal.Title>Confirm Delete?</Modal.Title>
                        <Modal.Body closeButton className="tf-modal-body">
                            <div className="row">Do you want to delete the Post?</div>
                            <div className="row">
                                <Button onClick={this.deletePost}>Yes</Button>
                                <Button onClick={this.hideDelPostPopup}>Cancel</Button>
                            </div>                            
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        );
    },

    _onChange: function() {
        this.setState({
            posts: PostStore.getAdminPosts()
        });
    }
});

module.exports = AdminPostsPage;