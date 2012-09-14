(function() {
  var $, minimalbox;
  $ = jQuery;

  minimalbox = (function() {

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
      $('body').append($('<div/>', {
        "id": 'minimalbox'
      }));
    }

    minimalbox.prototype.putImage = function(url) {
      var _this = this;
      _this.showTrobber();

      $('#minimalbox').append($('<img/>', {
        "src": url
      }).bind('load', function() {
        _this.removeTrobber();
      })).bind('click', function() {
        _this.destroy();
      });
    }

    minimalbox.prototype.showTrobber = function() {
      $('#minimalbox').append($('<span />', {
        "class": 'trobber'
      }).append('loading'));
    }

    minimalbox.prototype.removeTrobber = function() {
      $('#minimalbox > .trobber').remove();
    }

    minimalbox.prototype.destroy = function() {
      var box = $('#minimalbox');
      box.addClass('disappearing');
      var delay = this.getAnimationDuration(box);
      window.setTimeout(function() {
        box.remove();
      }, delay);
      
    }

     minimalbox.prototype.getAnimationDuration = function(element) {
        var prefixes = ['-webkit-', '-o-', '-moz-', ''];
        var duration = 0;
        var delay = 0;
        $.each(prefixes, function(i,v) {
          CSSduration = element.css(v + 'animation-duration');
          if(typeof(CSSduration) == 'string' && parseFloat(CSSduration) != 0 && duration == 0) {
            var multiplier = CSSduration.match(/ms/) ? 1 : 1000; 
            duration = parseFloat(CSSduration) * multiplier;
          }
          CSSdelay = element.css(v + 'animation-delay');
          if(typeof(CSSdelay) == 'string' && parseFloat(CSSdelay) != 0 && delay == 0) {
            var multiplier = CSSdelay.match(/ms/) ? 1 : 1000; 
            delay = parseFloat(CSSdelay) * multiplier;
          }
        });
        return duration + delay;
     }

    return minimalbox;

  })();

  $(function() {
    var Minimalbox;
    return Minimalbox = new minimalbox();
  });

}).call(this);

