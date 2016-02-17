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
//var _genre = null;
var _genre = ["ELECTRONIC", "HIPHOP", "VOCALS"];
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
    //_genre = "ALL";
    _sort = "TOP";
    //this.props.onClick(null, "TOP");
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
    //_genre = "ELECTRONIC";
    var exists = _genre.indexOf("ELECTRONIC");
    if(exists > -1) {
      if(_genre.length > 1){
        _genre.splice(exists, 1);
        this.props.onClick("ELECTRONIC", null);
      }
    } else {
      _genre.push("ELECTRONIC");
      this.props.onClick("ELECTRONIC", null);
    }
    
    _sort = this.props.sort;
    //if(_genre.length > 1)
    //this.props.onClick("ELECTRONIC", null);
    //this.props.scrollToTop();
    mixpanel.track('Filter', {
    'genre': 'Electronic',
    'sort': _sort
    });
  },

  handleHipHopClick: function(){
    //this.mutexClassName('hiphop', _genre.toLowerCase());
    //_genre = "HIPHOP";
    var exists = _genre.indexOf("HIPHOP");
    if(exists > -1) {
      if(_genre.length > 1) {
        _genre.splice(exists, 1);
        this.props.onClick("HIPHOP", null);
      }
    } else {
      _genre.push("HIPHOP");
      this.props.onClick("HIPHOP", null);
    }
    _sort = this.props.sort;
    //if(_genre.length > 1)
    //this.props.onClick("HIPHOP", null);
    //this.props.scrollToTop();
    mixpanel.track('Filter', {
    'genre': 'Hip Hop',
    'sort': _sort
    });
  },

  handleVocalsClick: function() {
    //_genre = "VOCALS";
    var exists = _genre.indexOf("VOCALS");
    if(exists > -1) {
      if(_genre.length > 1) {
        _genre.splice(exists, 1);
        this.props.onClick("VOCALS", null);
      }
    } else {
      _genre.push("VOCALS");
      this.props.onClick("VOCALS", null);
    }
    _sort = this.props.sort;

    //if(_genre.length > 1) 
    //this.props.onClick("VOCALS", null);

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
    var title = "TODAY'S FIRE";
    return (
      <div className="tf-filter-bar">
        <div className="container "> 
          <div className="left"><h4>{title} </h4></div>
          <div className="row right">
           <ul className="tf-filter-bar-ul">
            <a href="#!" ref="electronic" className={(_genre.indexOf("ELECTRONIC") > -1 ) ? "is-active tf-left-filter" : "is-non-active tf-left-filter" } 
              onClick={this.handleElectronicClick}>
              <li >Electronic</li>
            </a>              
            <a href="#!" ref="hiphop" className={(_genre.indexOf("HIPHOP") > -1 ) ? "is-active " : "is-non-active" } 
              onClick={this.handleHipHopClick} >
              <li>Hiphop</li>
            </a>    
            <a href="#!" ref="vocal" className={(_genre.indexOf("VOCALS") > -1 ) ? "is-active tf-right-filter" : "is-non-active tf-right-filter" } 
              onClick={this.handleVocalsClick} >
              <li>Vocals</li>
            </a>    
            {/*<a href="#!" 
              ref="top" 
              className={(_genre == "POPULAR") ?"is-active" : "" }
              onClick={this.handleTopClick} >
              POPULAR
            </a>*/}
            </ul>
          </div>
          <div className="right">
            {
            }
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