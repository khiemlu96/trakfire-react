/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var PostActions = require('../actions/PostActions');
var classNames = require('classnames');
var ReactPropTypes = React.PropTypes;

/* GLOBAL SCOPE VARS */
var _genre = null;
var _sort = null;
var _inactive = classNames("");
var _active = classNames("is-active");


var FilterBar = React.createClass({

  propTypes: {
    onClick: ReactPropTypes.func.isRequired,
    genre: ReactPropTypes.string.isRequired,
    sort: ReactPropTypes.string.isRequired,
    scrollToTop: ReactPropTypes.func
  },

  componentDidMount: function() {
    _genre = "ALL";
    _sort = "TOP";
    this.props.onClick("ALL", "TOP");
  },

  handleAllClick: function() {
    //Find the old .is-active before calling the onClick func
    //That way we have access to the old genre 
    //this.mutexClassName('all', _genre.toLowerCase());
    _genre = "ALL";
    _sort = this.props.sort;
    this.props.onClick("ALL", null);
    //this.props.scrollToTop();
    mixpanel.track('Filter', {
    'genre': 'All',
    'sort': _sort
    });
  },

  handleElectronicClick: function() {
    //this.mutexClassName('electronic', _genre.toLowerCase());
    _genre = "ELECTRONIC";
    _sort = this.props.sort;
    this.props.onClick("ELECTRONIC", null);
    //this.props.scrollToTop();
    mixpanel.track('Filter', {
    'genre': 'Electronic',
    'sort': _sort
    });
  },

  handleHipHopClick: function(){
    //this.mutexClassName('hiphop', _genre.toLowerCase());
    _genre = "HIPHOP";
    _sort = this.props.sort;
    this.props.onClick("HIPHOP", null);
    //this.props.scrollToTop();
    mixpanel.track('Filter', {
    'genre': 'Hip Hop',
    'sort': _sort
    });
  },

  handleVocalsClick: function() {
    _genre = "VOCALS";
    _sort = this.props.sort;
    this.props.onClick("VOCALS", null);

    mixpanel.track('Filter', {
    'genre': 'Vocals',
    'sort': _sort
    });    
  }, 

  handleTopClick: function(){
    //this.mutexClassName("top", _sort.toLowerCase());
    _genre = this.props.genre;
    _sort = "TOP";
    this.props.onClick(null, "TOP");
    mixpanel.track('Filter', {
    'genre': _genre,
    'sort': "Top"
    });
  },

  /*
   * handleNewClick must handle more than filtering and class manipulations
   * additionally the method must switch the view to a grid and reorder by created_at
   */
  handleNewClick: function(){
    //this.mutexClassName("new", _sort.toLowerCase());
    _genre = this.props.genre;
    _sort = "NEW";
    this.props.onClick(null, "NEW");
    //this.props.scrollToTop();
  },
  
  /**
   * @return {object}
   */
  render: function() {
    return (
      <div className="tf-filter-bar">
        <div className="container"> 
          <a href="#!"
            ref="all" 
            className={(_genre == "ALL") ? "is-active" : "" }
            onClick={this.handleAllClick}>
            All
          </a>
          <a href="#!" ref="hiphop" className={(_genre == "HIPHOP") ? "is-active" : "" } 
            onClick={this.handleHipHopClick} >
            Rhymes
          </a>
          <a href="#!" ref="vocal" className={(_genre == "VOCALs") ? "is-active" : "" } 
            onClick={this.handleVocalsClick} >
            Vocals
          </a>  
          <a href="#!" 
            ref="electronic" 
            className={(_genre == "ELECTRONIC") ? "is-active" : "" } 
            onClick={this.handleElectronicClick}>
            Electronic
          </a>        
          <div className="right">
            {/*<a href="#!" ref="top" className="is-active" 
              onClick={this.handleTopClick} >
              POPULAR
            </a>
            <a href="#!" ref="new" className="" 
              onClick={this.handleNewClick} >
              NEW
            </a>*/}
          </div>
        </div>
      </div>
    );
  },

  // UTILS  

  /* 
   * mutexClassName: adds .is-active to clicked elem and removes it from prev
   * elemToAdd = The element to add .is-active too
   * elemToRm = The element (previous state or genre) to rm .is-active from
   */

  mutexClassName: function(elemToAdd, elemToRm) {
    var refs = this.refs;
    var add, rm = null;
    add = refs[elemToAdd];
    rm = refs[elemToRm];
    console.log("ADD||RM ", add, rm);
    if( !add || !rm ) {
      console.error('grabbed a shitty ref');
    } else {
      rm.className = _inactive;
      add.className = _active;
    }

  }

});

module.exports = FilterBar;