(function() {
  var $, minimalbox;
  $ = jQuery;
 
  minimalbox = (function() {
    var container =$('<div/>', {
      'id': 'minimalbox'
    }).bind('minimalboxChange', function() {
      minimalbox.prototype.refreshControls();
    });

    var target = new Array();
    var currentIndex = 0;

    minimalbox.prototype.isNotFirst = function() {
      return currentIndex > 0;
    }

    minimalbox.prototype.isNotLast = function() {
      return currentIndex < (target.length - 1);
    }

    minimalbox.prototype.getNext = function() {
      return currentIndex + 1;
    }

    minimalbox.prototype.getPrev = function() {
      return currentIndex - 1;
    }

    minimalbox.prototype.getFirst = function() {
      return 0;
    }

    minimalbox.prototype.getLast = function() {
      return target.length - 1;
    }

    minimalbox.prototype.removeImage = function() {
      container.children('img').remove();
    }

    minimalbox.prototype.changeImage = function(desiredIndex) {
      minimalbox.prototype.removeImage();
      minimalbox.prototype.putImage($(target[desiredIndex]).attr('href'));
      currentIndex = desiredIndex;
      container.trigger('minimalboxChange');
    }

    minimalbox.prototype.destroy = function() {
      minimalbox.prototype.eliminate(container, function() {
        container.children().remove();
      });      
    }

    var controls = {
      'last': {
        'label': 'Last',
        'visible': false,
        'type': 'goto',
        'callback': minimalbox.prototype.getLast,
        'condition': minimalbox.prototype.isNotLast,
        'hotkeys': [34] // [PAGE DOWN]
      },
      'next': {
        'label': 'Next',
        'type': 'goto',
        'callback': minimalbox.prototype.getNext,
        'condition': minimalbox.prototype.isNotLast,
        'hotkeys': [68,74,39] // [D][J][→]
      },
      'prev': {
        'label': 'Previous',
        'type': 'goto',
        'callback': minimalbox.prototype.getPrev,
        'condition': minimalbox.prototype.isNotFirst,
        'hotkeys': [65,75,37] // [A][K][←]
      },
      'first': {
        'label': 'First',
        'visible': false,
        'type': 'goto',
        'callback': minimalbox.prototype.getFirst,
        'condition': minimalbox.prototype.isNotFirst,
        'hotkeys': [33] // [PAGE UP]
      },
      'close': {
        'label': 'Close',
        'type': 'dest',
        'callback': minimalbox.prototype.destroy,
        'hotkeys': [27,8] // [esc][backspace]
      },
    };
    
    function minimalbox() {
      this.init();
    }

    minimalbox.prototype.init = function() {
      var _this = this;
      
      target = $('a[rel=minimalbox]');

      target.bind('click', function(e) {
        var link = $(this);
        currentIndex = target.index(link);
        var imageUrl = link.attr('href');

        _this.construct();
        _this.putImage(imageUrl);
        _this.addControls(currentIndex);

        return false;
      });
    };

    minimalbox.prototype.addControls = function(index) {
      _this = this;
      jQuery.each(controls, function(name) {
        var cmd = controls[name];
        if(container.find('.' + name).length == 0) {
          var elm = $('<a />', {'class': name })
          .append(cmd.label)
          .bind('click', function() {
            var mayBeExecuted = typeof(cmd.condition) == 'function' ? cmd.condition.call() : true;
            if(mayBeExecuted) {
              if(cmd.type == 'goto') {
                var dest = cmd.callback.call();
                _this.changeImage(dest);
              } else if(cmd.type == 'dest') {
                cmd.callback.call();
              }
            }
          });
          container.prepend(elm);
        }
        if(typeof(cmd.hotkeys) == 'object') {
            $(document).bind('keydown', function(e) {
              var mayBeExecuted = typeof(cmd.condition) == 'function' ? cmd.condition.call() : true;
              if(cmd.hotkeys.indexOf(event.which) != -1 && mayBeExecuted) {
                if(cmd.type == 'goto') {
                  var dest = cmd.callback.call();
                  _this.changeImage(dest);
                } else if(cmd.type == 'dest') {
                  cmd.callback.call();
                }
              }
            });
          }
      });
      _this.refreshControls();
    }


    minimalbox.prototype.refreshControls = function(index) {
      $.each(controls, function(name) {
        var cmd = controls[name];
        var mayBeExecuted = typeof(cmd.condition) == 'function' ? cmd.condition.call() : true;
        elm = container.find('.' + name);
        if(mayBeExecuted) {
          elm.removeClass('disabled');
        } else {
          elm.addClass('disabled');
        }
      });
    };

    minimalbox.prototype.construct = function() {
      $('body').append(container);
    }

    minimalbox.prototype.putImage = function(url) {
      var _this = this;
      _this.showTrobber();

      container.append($('<img/>', {
        "src": url
      }).bind('load', function() {
        _this.removeTrobber();
      }));
    }

    minimalbox.prototype.showTrobber = function() {
      container.append($('<span />', {
        "class": 'throbber'
      }).append('loading'));
    }

    minimalbox.prototype.removeTrobber = function() {
      this.eliminate(container.children('.throbber'));  
    }

    minimalbox.prototype.eliminate = function(el, callback) {
      el.addClass('disappearing');
      var delay = this.getAnimationDuration(el);
      window.setTimeout(function() {
        el.removeClass('disappearing').remove();
        if(typeof(callback) == 'function') {
          callback.call();
        }
      }, delay);
    }

    minimalbox.prototype.getAnimationDuration = function(el) {
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
    }


    return minimalbox;

  })();

  $(function() {
    var Minimalbox;
    return Minimalbox = new minimalbox();
  });

}).call(this);

