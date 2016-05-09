/* global LWA, ajaxEndpoint, googletag */
window.LWA = window.LWA || {};

window.Namespace = function (ns) {
  var parent = window.LWA, namespace = ns.split('.');
 
  for (var i = 0, length = namespace.length; i < length; i++) {
    var name = namespace[i];
    if (typeof parent[name] === 'undefined') {
      parent[name] = {};
    }
    parent = parent[name];
  }
  return parent;
};


var Modules = window.Namespace('Modules');

Modules.Util = (function() {
  var $body,
  
  Ajax = {
    getUrl: function() {
      return ajaxEndpoint.url;
    }
  },

  Responsive = {
    BP3: {
      state: undefined,
      query: '(max-width: 768px)',

      match: function() {
        return this.state;
      },

      set: function() {
        this.state = window.matchMedia && window.matchMedia(this.query).matches;
      }
    },

    BP1: {
      state: undefined,
      query: '(max-width: 620px)',

      match: function() {
        return this.state;
      },

      set: function() {
        this.state = window.matchMedia && window.matchMedia(this.query).matches;
      }
    },

    setBreakpoints: function() {
      Responsive.BP1.set();
      Responsive.BP3.set();
    }
  },

  Metric = {
    windowWidth: undefined,
    windowHeight: undefined,

    setScrollTop: function(position) {
      $body.scrollTop(position);
    },

    getScrollPos: function() {
      return $body.scrollTop();
    },

    setWindowWidth: function() {
      Metric.windowWidth = $(window).width();
    },

    getWindowWidth: function() {
      return Metric.windowWidth;
    },

    setWindowHeight: function() {
      Metric.windowHeight = $(window).height();
    },

    getWindowHeight: function() {
      return Metric.windowHeight;
    },

    update: function() {
      Metric.setWindowWidth();
      Metric.setWindowHeight();
      Responsive.setBreakpoints();
    }
  },

  // hold off on resize event
  Delay = function() {
    var timer = 0;
    return function(callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  };

  function init() {
    $body = $('body');
    Metric.update();
    $(window).resize(Metric.update);
  }

  init();

  return {
    getScrollPos: Metric.getScrollPos,
    setScroll: Metric.setScrollTop,
    windowWidth: Metric.getWindowWidth,
    windowHeight: Metric.getWindowHeight,
    getUrl: Ajax.getUrl,
    getResponsive: function () {
      return Responsive;
    },
    delay: new Delay()
  };

})();


// DPF ad refresh on orientation changes
var DFP = window.Namespace('DFP');

DFP.Watch = (function() {
  
  function refresh() {
    LWA.Modules.Util.delay(function() {
      googletag.pubads().refresh();
    }, 200);
  }
  
  function init() {
    $(window).resize(refresh);
  }
  
  return {
    init: init
  };
  
})();

$(document).ready(function() {
  LWA.Modules.Modal('.nav-search a', '#modal-search', { close: LWA.Modules.Search.close });
  
  DFP.Watch.init();
});