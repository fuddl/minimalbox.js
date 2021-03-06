(function( $ ) {
  var currentIndex = 0;
  var container = $('<div/>', {
    'id': 'minimalbox'
  }).append('<!--before--><!--content--><!--after-->');
  var itemContainer = $('<span/>', {
    'class': 'image'
  }).append('<!--inner_before--><!--inner_content--><!--inner_after-->');
  var settings;
  var methods = {
    init : function(options) {
      _this = this;
      settings = $.extend({
        'controls': {
          'last': {
            'label': 'Last',
            'visible': false,
            'type': 'goto',
            'callback': 'getLast',
            'condition': 'isNotLast',
            'hotkeys': [34] // [PAGE DOWN]
          },
          'next': {
            'label': 'Next',
            'type': 'goto',
            'callback': 'getNext',
            'condition': 'isNotLast',
            'hotkeys': [68,74,39], // [D][J][→]
            'region': 'after',
            'weight': 0
          },
          'prev': {
            'label': 'Previous',
            'type': 'goto',
            'callback': 'getPrev',
            'condition': 'isNotFirst',
            'hotkeys': [65,75,37], // [A][K][←]
            'region': 'before',
            'weight': 0
          },
          'first': {
            'label': 'First',
            'visible': false,
            'type': 'goto',
            'callback': 'getFirst',
            'condition': 'isNotFirst',
            'hotkeys': [33] // [PAGE UP]
          },
          'close': {
            'label': 'Close',
            'type': 'execute',
            'callback': 'destroy',
            'hotkeys': [27,8], // [esc][backspace]
            'region': 'after',
            'weight': 0
          }
        }
      }, options);
      this.bind('click', function() {
        var link = $(this);
        currentIndex = _this.index(link);
        var imageUrl = link.attr('href');
        _this.minimalbox('construct');
        _this.minimalbox('putImage', imageUrl);
        _this.minimalbox('addControls', currentIndex);

        container.find('.image').removeClass('new');
        return false;
      });
    },
    isNotFirst: function() {
      return currentIndex > 0;
    },
    isNotLast: function() {
      return currentIndex < (this.length - 1);
    },
    getNext: function() {
      return currentIndex + 1;
    },
    getPrev: function() {
      return currentIndex - 1;
    },
    getFirst: function() {
      return 0;
    },
    getLast: function() {
      return this.length - 1;
    },
    removeImage: function() {
      container.children('img').remove();
    },
    destroy: function() {
      this.minimalbox('eliminate', container, function() {
        container.children().remove();
        $('body.has-minimalbox').removeClass('has-minimalbox');
      });
    },
    construct: function() {
      $('body').addClass('has-minimalbox').append(container);
    },
    changeImage: function(desiredIndex) {
      currentIndex = desiredIndex;
      this.minimalbox('refreshControls');
      var oldImg = container.children('.image');
      if(!oldImg.hasClass('disappearing')) {
        this.minimalbox('putImage', $(this[desiredIndex]).attr('href'));
        this.minimalbox('eliminate', oldImg, function() {
          oldImg.removeClass('new');
        });
        container.trigger('minimalboxChange');
        this.minimalbox('preload', 'next');
        this.minimalbox('preload', 'prev');
      }
    },
    preload: function(image) {
      switch (image) {
        case 'next':
          cond = 'isNotLast';
          call = 'getNext';
          break;
        case 'prev':
          cond = 'isNotFirst';
          call = 'getPrev';
          break;
      }
      if (this.minimalbox(cond)) {
        var preloadNext = new Image;
        preloadNext.src = this[this.minimalbox(call)].link;
      }
    },
    addControls: function(index) {
      _this = this;
      jQuery.each(settings.controls, function(name) {
        var cmd = settings.controls[name];
        if(container.find('.' + name).length == 0 && cmd.visible != false) {
          var elm = $('<a />', {'class': name })
          .append(cmd.label)
          .bind('click', function() {
            var mayBeExecuted = typeof(cmd.condition) == 'undefined' ? true : _this.minimalbox(cmd.condition);
            if(mayBeExecuted) {
              if(cmd.type == 'goto') {
                _this.minimalbox('changeImage', _this.minimalbox(cmd.callback));
              } else if(cmd.type == 'execute') {
                _this.minimalbox(cmd.callback);
              }
            }
          });
          container.minimalbox('addToRegion', elm, cmd.region);
        }
        if(typeof(cmd.hotkeys) == 'object')  {
            $(document).bind('keydown', function(e) {
              var mayBeExecuted = typeof(cmd.condition) == 'undefined' ? true : _this.minimalbox(cmd.condition);
              if(cmd.hotkeys.indexOf(e.which) != -1 && mayBeExecuted) {
                e.preventDefault();
                if(cmd.type == 'goto') {
                  _this.minimalbox('changeImage', _this.minimalbox(cmd.callback));
                } else if(cmd.type == 'execute') {
                  _this.minimalbox(cmd.callback);
                }
              }
            });
          }
      });
      _this.minimalbox('refreshControls');
    },
    addToRegion: function(elem, region) {
      $.each(this.contents(), function() {
        if(this.nodeType === 8 && this.nodeValue === region) {
          $(this).after(elem);
        }
      });
    },
    refreshControls: function() {
      $.each(settings.controls, function(name) {
        var cmd = settings.controls[name];
        var mayBeExecuted = typeof(cmd.condition) == 'undefined' ? true : _this.minimalbox(cmd.condition);
        elm = container.find('.' + name);
        if(mayBeExecuted) {
          elm.removeClass('disabled');
        } else {
          elm.addClass('disabled');
        }
      });
    },
    putImage: function(url) {
      var _this = this;
      _this.minimalbox('showTrobber');
      var img = $('<img/>', {
        "src": url,
        "class": 'new'
      }).bind('load', function() {
        _this.minimalbox('removeTrobber');
      });
      var thisItemContainer = itemContainer.clone();
      thisItemContainer.minimalbox('addToRegion', img, 'inner_content')
      container.minimalbox('addToRegion', thisItemContainer, 'content');
    },
    showTrobber: function() {
      container.append($('<span />', {
        "class": 'throbber'
      }).append('loading'));
    },
    getAnimationDuration: function(el) {
      var duration = 0;
      var delay = 0;
      var iterationCount = 1;
      durationAttr = el.css('animation-duration');
      if(typeof(durationAttr) == 'string' && parseFloat(durationAttr) != 0 && duration == 0) {
        var multiplier = durationAttr.match(/ms/) ? 1 : 1000;
        duration = parseFloat(durationAttr) * multiplier;
      }
      delayAttr = el.css('animation-delay');
      if(typeof(delayAttr) == 'string' && parseFloat(delayAttr) != 0 && delay == 0) {
        var multiplier = delayAttr.match(/ms/) ? 1 : 1000;
        delay = parseFloat(delayAttr) * multiplier;
      }
      iterationCountAttr = el.css('animation-iteration-count');
      if(iterationCountAttr != 'infinite') {
        iterationCount = parseInt(iterationCountAttr);
      } else {
        return 0;
      }
      return (duration + delay) * iterationCount;
    },
    eliminate: function(el, callback) {
      _this = this;
      el.addClass('disappearing');
      var delay = _this.minimalbox('getAnimationDuration', el);
      animating = true;
      window.setTimeout(function() {
        el.removeClass('disappearing').remove();
        if(typeof(callback) == 'function') {
          callback.call();
        }
      }, delay);
    },
    removeTrobber: function() {
      _this.minimalbox('eliminate', container.children('.throbber'));
    }
  };
  $.fn.minimalbox = function(method) {
    if (methods[method]) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist in minimalbox.js' );
    }
  };
  $(function() {
    $('a[rel=minimalbox]').minimalbox();
  });
})( jQuery );

