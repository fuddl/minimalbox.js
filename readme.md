# minimalbox.js

This is a very small Lightbox-like image overlay script. Compared to other libraries like [lightbox](http://lokeshdhakar.com/projects/lightbox2/), [shadowbox](http://shadowbox-js.com/), or [thickbox](http://ajaxdaddy.com/demo-jquery-thickbox.html) it creates a very tiny DOM object at the end of the document which looks like this:


    <div id="minimalbox">
      <img src="image.jpg">
    </div>

As you may notice ther is **no inline css**. So everything can be styled seperatly. It's sensitive to [CSS-Animation](https://developer.mozilla.org/en-US/docs/CSS/CSS_animations?redirect=no). As a result everything, opening, closing, resizing the window runs very fast.

## Browser support

As the sript itself is very simple it *should* work in all browsers. But the css yet delivered with the lib works in:

* Opera
* Chrome 
* Firefox
* IE 8+

## Contribute

The current theme minimalbox.css uses [compass](http://compass-style.org/).
