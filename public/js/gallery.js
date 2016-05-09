/* global LWA, Sly, imagesLoaded, Handlebars, ga */

var Views = window.Namespace('Views');

Views.Gallery = (function() {

  var Helper = {
    isRight: function(previous, current) {
      return previous < current;
    }
  };

  var StartAgain = function(element, callback) {
    var self = this,
      ACTIVE = 'gallery-home-active';

    self.show = function() {
      element.addClass(ACTIVE);
    };

    self.hide = function() {
      element.removeClass(ACTIVE);
    };

    element.click(function() {
      callback.call(self);
    });
  };

  // @param: wrapping dom element
  var FinalSlide = function(element) {
    var self = this,
      ACTIVE = 'gallery-next-active';

    self.show = function() {
      element.addClass(ACTIVE);
    };

    self.hide = function() {
      element.removeClass(ACTIVE);
    };

    self.isActive = function() {
      return element.hasClass(ACTIVE);
    };
  };

  var Modal = {
    
    state: {
      modal: undefined,
      slider: undefined,
      responsive: {
        height: 120,
        heightTouch: 160
      },
      startTime: 0,
      prevPos: 0
    },

    template: Handlebars.gallery_modal,

    NextUp: {
      
      state: {
        pos: 0
      },

      isFirst: function() {
        return this.state.slider.currSlideId === 0;
      },

      isEnabled: function() {
        return this.elements.slider.hasClass('gallery-next-enable');
      },

      isActivated: function() {
        return this.elements.slider.hasClass('gallery-next-active');
      },
      
      activate: function() {
        this.elements.slider.addClass('gallery-next-active');
        Modal.elements.$next.hide();
      },

      deactivate: function() {
        this.elements.slider.removeClass('gallery-next-active');
        Modal.elements.$next.show();
      },

      enable: function() {
        this.elements.slider.addClass('gallery-next-enable');
      },

      disable: function() {
        this.elements.slider.removeClass('gallery-next-enable');
      },

      onActivate: function(event) {
        var position = this.state.slider.currSlideId;

        if (this.isFirst()) {
          this.deactivate();
        } else {
          this.activate();
        }

        // if is swipe at position 0
        if (this.isFirst() && position === this.state.pos) {
          this.disable();
          Modal.prev();
        }
        this.state.pos = position;
      },

      destroy: function() {
        this.state.slider.goTo(0);
        this.disable();
        this.deactivate();
        Modal.state.slider.goTo(0);
        Modal.onActivate(0);
      },

      init: function() {
        this.elements = {
          slider: $('#modal-slider-next')
        };

        var container = this.elements.slider.find('.royalSlider');
        this.state.slider = container.css({
          'width': LWA.Modules.Util.windowWidth(),
          'height': LWA.Modules.Util.windowHeight()
        })
        .royalSlider({
          sliderDrag: false,
          navigateByClick: false,
          transitionSpeed: 260,
          startSlideId: 0,
          controlNavigation: 'none',
          fadeinLoadedSlide: false,
          addActiveClass: true,
          arrowsNav: false
        }).data('royalSlider');

        this.state.slider.ev.on('rsBeforeAnimStart', function(event) {
          Modal.NextUp.onActivate(event);
        });

        container.find('#modal-gallery-home').click(function() { Modal.NextUp.destroy(); });
      }
    },


    init: function() {
      Modal.state.startTime = new Date().getTime();

      if (Modal.state.slider !== undefined) {
        return;
      }

      Modal.elements = {
        $slider: $('#modal-gallery-frame .royalSlider'),
        $total: Modal.state.modal.el().find('.modal-gallery-count'),
        $next: Modal.state.modal.el().find('.sly-next')
      };

      Modal.state.modal.el().find('.sly-prev').click(Modal.prev);
      Modal.state.modal.el().find('.sly-next').click(Modal.next);

      // add slides and initialise helpers
      Modal.elements.$slider.html(Modal.template(LWA.Data.Gallery));

      if (LWA.hasNextPost) {
        Modal.NextUp.init();
      }
      Modal.state.startAgain = new StartAgain($('#modal-gallery-home'), Modal.startAgain);
      Modal.state.lazyImage = new LazyImage(Modal.elements.$slider.find('img'), {
        onLoad: function(instance) {
          $(instance.elements[0]).removeClass('m-transparent').next().remove();
        }
      });
      Modal.state.lazyImage.load(0);
      Modal.buildSlider(0);
    },

    buildSlider: function(startAt) {
      Modal.state.slider = Modal.elements.$slider.royalSlider({
        arrowsNav: false,
        sliderDrag: false,
        navigateByClick: false,
        fadeinLoadedSlide: false,
        controlNavigation: 'none',
        globalCaption: true,
        addActiveClass: true,
        startSlideId: startAt,
        transitionSpeed: 260
      }).data('royalSlider');

      Modal.state.slider.ev.on('rsAfterSlideChange', function(event) {
        ga('send', 'event', 'Gallery', 'click', 'Gallery modal navigate', { 'page': location.pathName });
        Modal.onActivate(Modal.state.slider.currSlideId);
      });

      Modal.onActivate(startAt);
      Modal.setFrameHeight();
    },

    startAgain: function() {
      if (LWA.hasNextPost && Modal.NextUp.isEnabled()) {
        Modal.NextUp.destroy();
      } else {
        Modal.state.slider.goTo(0);
      }
    },

    destroy: function() {
      Modal.startAgain();
      var endTime = new Date().getTime();
      ga('send', 'timing', 'Gallery', 'Modal view', endTime - Modal.state.startTime, 'Gallery modal', { 'page': location.pathName });
    },

    next: function() {
      if (LWA.hasNextPost && Modal.NextUp.isEnabled()) {
        Modal.NextUp.activate();
        Modal.NextUp.state.slider.goTo(1);
        Modal.state.startAgain.show();
        return;
      }
      Modal.state.slider.next();
    },

    prev: function() {
      if (LWA.hasNextPost && Modal.NextUp.isActivated()) {
        Modal.NextUp.deactivate();
        Modal.NextUp.state.slider.goTo(0);
        Modal.state.startAgain.hide();
        return;
      }
      if (LWA.hasNextPost) {
        Modal.NextUp.disable();
      }
      Modal.state.slider.prev();
    },

    onActivate: function(position) {
      this.state.lazyImage.load(position);

      position = position + 1;
      this.elements.$total.html(position + ' / ' + this.state.slider.numSlides);

      if (position === 1 || Helper.isRight(this.state.prevPos, position)) {
        this.state.startAgain.hide();
      } else {
        this.state.startAgain.show();
      }

      if (LWA.hasNextPost && position === this.state.slider.numSlides) {
        this.NextUp.enable();
      }
      this.state.prevPos = position;
    },

    setFrameHeight: function() {
      var extraHeight = LWA.Modules.Util.getResponsive().BP1.match() ? Modal.state.responsive.heightTouch : Modal.state.responsive.height;
      Modal.elements.$slider.css('height', LWA.Modules.Util.windowHeight() - extraHeight);
      Modal.elements.$slider.find('.rsOverflow').css('height', LWA.Modules.Util.windowHeight() - extraHeight);
    },

    reload: function() {
      if (Modal.state.slider === undefined) {
        return;
      }
      
      Modal.state.modal.loader.start();
      
      Modal.elements.$slider.css('width', '');
      Modal.elements.$slider.find('.rsOverflow').css('width', '');
      Modal.state.slider.updateSliderSize(true);
      Modal.setFrameHeight();

      setTimeout(function() {
        Modal.state.modal.loader.stop();
      }, 1000);
    }
  };

  var Thumbs = {

    state: {
      sly: undefined
    },

    elements: {
      $header: $('.header')
    },

    toggle: function() {
      Thumbs.elements.$header.toggleClass('header-gallery-thumbs-active');
    },

    init: function() {
      var $wrap = $('#header-gallery-thumbs');
      Thumbs.initialiseSly($('#header-gallery-thumbs'));
      $('#gallery-thumbs').click(Thumbs.toggle);
    },

    initialiseSly: function($wrap) {
      Thumbs.state.sly = new Sly('#header-gallery-thumbs', {
        horizontal: 1,
        itemNav: 'basic',
        smart: 1,
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 0,
        speed: 300,
        elasticBounds: 1,
        easing: 'swing',
        prevPage: $wrap.find('.sly-prev'),
        nextPage: $wrap.find('.sly-next')
      });

      Thumbs.state.sly.init();
      Thumbs.state.sly.on('active', Thumbs.onActivate);
    },

    onActivate: function(eventName, position) {
      Inline.setActive(position);
    },

    setActive: function(position) {
      Thumbs.state.sly.activate(position);
    },

    reload: function() {
      Thumbs.state.sly.reload();
    }
  };

  var Inline = {

    element: {
      title: $('.header-gallery-title'),
      overlay: $('#header-gallery .m-overlay'),
      gallery: $('#header-gallery-wrap')
    },

    state: {
      sly: undefined,
      responsive: undefined,
      isTouch: false,
      loader: false,
      previousPosition: 0
    },

    template: Handlebars.gallery_inline,

    init: function() {
      this.state.responsive = LWA.Modules.Util.getResponsive();
      this.state.isTouch = !this.state.responsive.BP3.match();
      this.state.loader = LWA.Modules.Spinner('#header-gallery .loader-icon', {show: true});

      this.element.title.on('webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd', Inline.onTransitionEnd);

      Handlebars.registerHelper('getWidth', function() {
        return Math.round(this.width * (748 / this.height));
      });

      Handlebars.registerHelper('loader', function(index) {
        if (index > 1) {
          return '<div class="loader-icon"><i class="icon-reload"></i></div>';
        }
      });
        
      var $controls = $('#inline-gallery-controls');
      $controls.find('.sly-prev').click(Inline.prev);
      $controls.find('.sly-next').click(Inline.next);

      this.state.finalSlide = new FinalSlide(Inline.element.gallery);
      this.state.startAgain = new StartAgain($('#inline-gallery-home'), this.reset);

      this.chooseRendering(this.state.loader);
    },

    initialiseSlider: function() {
      Inline.state.sly = new Sly('#inline-gallery-frame', {
        horizontal: 1,
        itemNav: 'centered',
        smart: 1,
        activateOn: 'click',
        touchDragging: 0,
        releaseSwing: 1,
        startAt: 0,
        speed: 300,
        elasticBounds: 1,
        easing: 'swing'
      });

      Inline.state.sly.init();
      Inline.state.sly.on('active', Inline.onActivate);
    },

    chooseRendering: function(loader) {
      if (this.state.responsive.BP3.match() && this.state.isTouch !== true) {
        this.renderFeature();

        LWA.Modules.Loader({
          imageContent: '#tmpl-gallery-images',
          hiddenContent: '#header-gallery .m-wrap',
          loader: loader
        });
        
        this.state.isTouch = true;
      }
      else if (!this.state.responsive.BP3.match() && this.state.isTouch === true) {
        Inline.renderGallery();

        setTimeout(function() {
          $('#header-gallery-wrap').removeClass('m-transparent');
          Inline.state.loader.destroy();
        }, 2000);
        
        this.state.isTouch = false;
      }
    },

    renderGallery: function() {
      Inline.element.overlay.hide();

      var wrap = $('#tmpl-gallery-images').html(this.template(LWA.Data.Gallery));
      Inline.state.lazyImage = new LazyImage(wrap.find('img'));
      Inline.state.lazyImage.load(0);
      Inline.initialiseSlider();
    },

    renderFeature: function() {
      $('#tmpl-gallery-images')
        .css('background-image', 'url(' + LWA.Data.Gallery.feature + ')')
        .addClass('header-feature-bg');
      Inline.element.overlay.show();
      Inline.showTitle();
    },

    destroyFeature: function() {
      $('#tmpl-gallery-images')
        .css('background-image', 'none')
        .removeClass('header-feature-bg');
    },

    destroyGallery: function() {
      $('#tmpl-gallery-images').html('');
      Inline.state.sly.destroy();
    },

    onActivate: function(eventName, position) {
      ga('send', 'event', 'Gallery', 'click', 'Gallery inline navigate', { 'page': location.pathName });
      
      Thumbs.setActive(position);

      if (Inline.state.previousPosition > position) {
        Inline.state.startAgain.show();
      } else {
        Inline.state.startAgain.hide();
      }

      if (position > 0) {
        Inline.hideTitle();
      } else {
        Inline.showTitle();
        Inline.element.gallery.removeClass('gallery-end');
        Inline.state.startAgain.hide();
      }

      // mark end of gallery
      if (Inline.isEnd()) {
        Inline.element.gallery.addClass('gallery-end');
      }
      Inline.state.lazyImage.load(position);
      Inline.state.previousPosition = position;
    },

    next: function() {
      // show next slide
      if (LWA.hasNextPost && Inline.isEnd()) {
        Inline.state.finalSlide.show();
        Inline.state.startAgain.show();
        return;
      }
      Inline.state.sly.next();
    },

    prev: function() {
      if (Inline.state.finalSlide.isActive()) {
        Inline.state.finalSlide.hide();
        Inline.state.startAgain.hide();
        return;
      }
      
      Inline.state.sly.prev();
      Inline.element.gallery.removeClass('gallery-end');
    },

    isEnd: function() {
      return this.state.sly.items.length - 1 === this.state.sly.rel.activeItem;
    },

    showTitle: function() {
      Inline.element.title.css('display', '');
      setTimeout(function() { Inline.element.gallery.removeClass('animate-gallery'); }, 200);
    },

    hideTitle: function() {
      Inline.element.gallery.addClass('animate-gallery');
    },

    onTransitionEnd: function(ev) {
      if (Inline.element.gallery.hasClass('animate-gallery')) {
        Inline.element.title.css('display', 'none');
      }
    },

    setActive: function(position) {
      Inline.state.sly.activate(position);
    },

    reset: function() {
      Inline.state.sly.activate(0);
      Inline.state.finalSlide.hide();
    },

    reload: function() {
      if (this.state.responsive.BP3.match() && this.state.isTouch !== true) {
        this.destroyGallery();
        this.renderFeature();
        this.state.isTouch = true;
      }
      else if (!this.state.responsive.BP3.match() && this.state.isTouch === true) {
        this.destroyFeature();
        this.renderGallery();
        this.state.isTouch = false;
      }
      else if (this.state.isTouch === false) {
        this.state.sly.reload();
      }
    }
  };

  function updateSly() {
    LWA.Modules.Util.delay(function() {
      Inline.reload();
      Thumbs.reload();
      Modal.reload();
    }, 200);
  }

  return {
    init: function() {
      Thumbs.init();
      Inline.init();

      Modal.state.modal =
        LWA.Modules.Modal('#modal-gallery-button', '#modal-gallery', {
          closeable: true,
          open: Modal.init,
          close: Modal.destroy
        });

      $(window).resize(updateSly);
    }
  };

})();

LWA.Views.Gallery.init();