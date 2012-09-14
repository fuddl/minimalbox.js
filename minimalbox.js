(function() {
  var $, minimalbox;
  $ = jQuery;

  minimalbox = (function() {
    var container =$('<div/>', {
      "id": 'minimalbox'
    });

    function minimalbox() {
      this.init();
    }

    minimalbox.prototype.init = function() {
      var _this = this;
      $('a[rel=minimalbox]').bind('click', function(e) {
        
        var imageUrl = $(this).attr('href');

        _this.construct();
        _this.putImage(imageUrl);

        return false;
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
      })).bind('click', function() {
        _this.destroy();
      });
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

