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

    var controls = {
      /*
      'last': {
        'label': 'Last',
        'index_callback': function() {
          return target.length - 1;
        },
        'visibility_callback': function () {
          return currentIndex < (target.length - 1);
        }
      },
      */
      'next': {
        'label': 'Next',
        'index_callback': function() {
          return currentIndex + 1;
        },
        'visibility_callback': function () {
          return currentIndex < (target.length - 1);
        }
      },
      'prev': {
        'label': 'Previous',
        'index_callback': function() {
          return currentIndex - 1;
        },
        'visibility_callback': function () {
          return currentIndex > 0;
        }
      },
      /*
      'first': {
        'label': 'First',
        'index_callback': function() {
          return 0;
        },
        'visibility_callback': function () {
          return currentIndex > 0;
        }
      },
      */
      'close': {
        'label': 'Close',
        'callback': function() {
          minimalbox.prototype.destroy(); 
        }
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

    minimalbox.prototype.changeImage = function(desiredIndex) {
      this.removeImage();
      this.putImage($(target[desiredIndex]).attr('href'));
      currentIndex = desiredIndex;
      container.trigger('minimalboxChange');
    }

    minimalbox.prototype.addControls = function(index) {
      _this = this;
      jQuery.each(controls, function(name) {
        if(container.find('.' + name).length == 0) {
        container.prepend($('<a />', {
          'class': name
          })
          .append(controls[name].label).bind('click', function() {
          if(typeof(controls[name].index_callback) == 'function') {
            desiredIndex = controls[name].index_callback.call();
            _this.changeImage(desiredIndex);
          }
          if(typeof(controls[name].callback) == 'function') {
            controls[name].callback.call();
          }
        }));
      }
      });
      _this.refreshControls();
    }

    minimalbox.prototype.refreshControls = function(index) {
      $.each(controls, function(name) {
        if(typeof(controls[name].visibility_callback) == 'function') {
          var isVisible = controls[name].visibility_callback.call();
          if(!isVisible) {
            container.find('.' + name).hide();
          } else {
            container.find('.' + name).show();
          }
        }
      });
    };

    minimalbox.prototype.construct = function() {
      $('body').append(container);
    }

    minimalbox.prototype.removeImage = function() {
      container.children('img').remove();
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

    minimalbox.prototype.destroy = function() {
      this.eliminate(container, function() {
        container.children().remove();
      });      
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

