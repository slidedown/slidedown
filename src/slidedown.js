var marked = require('marked'),
    hljs   = require('highlight.js'),
    deepDefaults = require('deep-defaults');

(function() {

  function Slidedown() {
    this.target = 'body';
  }

  var slideLayouts = {
    'title-only': { pattern: /^H1$/ },
    'title-subtitle': { pattern: /^H1,H2$/ },
    'side-by-side': {
      pattern: /^H1,.+,H1,.+$/,
      postprocess: function(content) {
        var left = document.createElement('DIV');
        left.className = 'left';
        // content.appendChild(left);

        // Insert the first <H1> and the stuff below it (but before the second
        // <H2>) into the left pane.
        do {
          left.appendChild(content.firstChild);
        } while (content.firstChild.tagName !== 'H1');

        var right = document.createElement('DIV');
        right.className = 'right';

        // Insert everything else into the right pane.
        do {
          right.appendChild(content.firstChild);
        } while (content.firstChild);

        content.appendChild(left);
        content.appendChild(right);
      }
    }
  };

  Slidedown.prototype = {
    // default object, can be set by setOptions()
    // must be put here as static variable as all
    // exported functions are staticized
    options: {
      "marked": {
        "breaks": true
      },
      "slidedown": {
        title: false,
        showImageCaption: false
      }
    },

    parseQuery: function parseQuery() {
        var querystring = document.location.search;
        // remove any preceding url and split
        querystring = querystring.substring(querystring.indexOf('?')+1).split('&');
        var params = {}, pair, d = decodeURIComponent;
        // match and parse
        for (var i = querystring.length - 1; i >= 0; i--) {
            pair = querystring[i].split('=');
            params[d(pair[0])] = d(pair[1]);
        }

        return params;
    },

    to: function to(target, cb) {
      this.target = target;

      whenReady(function() {
        if (typeof cb === "function") {
          cb();
        }
      });
    },

    destination: function destination() {
      var destination = typeof this.target === 'string' ?
        document.querySelector(this.target) : this.target;
      return destination;
    },

    append: function append(element) {
      this.destination().appendChild(element);
    },

    fromElements: function fromElements(elements) {
      var slidedown = this;

      whenReady(function() {
        eachSlide(elements, function(slide, number) {
          var element = document.createElement('DIV');
          element.id = 'slide-' + number;
          element.className = 'slide';

          var content = document.createElement('DIV');
          content.className = 'content';
          content.setAttribute('data-layout', slide.layout);
          content.innerHTML = slide.html;
          element.appendChild(content);

          var layout = slideLayouts[slide.layout];
          if (layout && typeof layout.postprocess === 'function') {
            layout.postprocess(content);
          }

          if (number === 1) {
            addNavigationInstructions(element);
          }

          slidedown.append(element);
        });

        // Attach left/right keyboard shortcuts
        handleKey(39, nextSlide);
        handleKey(37, prevSlide);
        handleClick('x > 90%', nextSlide);
        handleClick('x < 10%', prevSlide);

        var numSlides = document.getElementsByClassName('slide').length;

        // more key feature:
        // using `home` key to go to first page
        handleKey(36, goToSlide(1));

        // using `end` key to go to last page
        handleKey(35, goToSlide(numSlides));

        // using `t` to go to toc page;
        handleKey(84, goToToc);

        // using `r` key to go to root page
        // useful when the default md shows a listing of md's
        handleKey(82, goToRoot);

        // Hammer integration with feature detection
        // All gestures are designed for one-handed operation
        if (typeof Hammer !== 'undefined') {
          var slides = document.getElementById('slides');
          var hammer = new Hammer(slides);

          // enable double tap
          hammer.get('tap').set({
            touchAction: 'multitap'
          });

          // swipe left and right to change slide
          hammer.on('swipeleft', nextSlide);
          hammer.on('swiperight', prevSlide);

          // more gesture features:
          // press and hold will go to root page
          // useful when the default md shows a listing of md's
          hammer.on('press', goToRoot);

          // double tap will go to toc page
          hammer.on('doubletap', goToToc);
        }

        // Change title to the first h1 of md
        changeTitle();

        // Generate TOC if #toc is found
        generateTOC();

        // Focus on the target slide (or first, by default)
        focusTargetSlide();
        window.addEventListener('hashchange', focusTargetSlide);
      });

      return slidedown;
    },

    fromHTML: function fromHTML(html) {
      var elements = parseHTML(html);
      return this.fromElements(elements);
    },

    fromMarkdown: function fromMarkdown(markdown) {
      var markedOptions = deepDefaults({
          renderer: new CustomRenderer()
        },
        Slidedown.prototype.options.marked
      );
      marked.setOptions(
        markedOptions
      );

      var html = marked(markdown);
      return this.fromHTML(html);
    },

    fromXHR: function fromXHR(title) {
      var slidedown = this,
          format    = inferFormat(title);

      var request = new XMLHttpRequest();
      request.open('GET', title);

      request.addEventListener('load', function() {
        slidedown['from' + format](request.responseText);
      });

      request.send();

      return this;
    },

    // setOptions() should be run before any other function of Slidedown
    setOptions: function setOptions(options) {
      Slidedown.prototype.options = deepDefaults(
        options, Slidedown.prototype.options);
    }
  };

  function whenReady(callback) {
    if (document.readyState === "complete") {
      setTimeout(callback, 0);
      return;
    }

    window.addEventListener('load', callback);
  }

  function inferFormat(title) {
    var extension = title.split('.').pop();

    switch (extension) {
      case 'htm':
      case 'html':
        return 'HTML';

      case 'md':
      case 'markdown':
      default:
        return 'Markdown';
    }
  }

  function parseHTML(html) {
    var wrapper = document.createElement('DIV');
    wrapper.innerHTML = html;
    return wrapper.children;
  }

  function eachSlide(doc, callback) {
    var parts   = [],
        counter = 1;

    forEach(doc, function(element) {
      if (element.tagName === 'HR') {
        callback(createSlide(parts), counter++);
        parts = [];
        return;
      }

      parts.push(element);
    });

    if (parts.length > 0) {
      callback(createSlide(parts), counter++);
    }
  }

  function forEach(collection, callback) {
    return Array.prototype.forEach.call(collection, callback);
  }

  function createSlide(parts) {
    return {
      layout: getSlideLayout(parts),
      html: parts.map(function(part) { return part.outerHTML; }).join('')
    };
  }

  function getSlideLayout(parts) {
    var key = parts.map(function(part) { return part.tagName; }).join(',');

    for (var layout in slideLayouts) {
      if (slideLayouts[layout].pattern.test(key)) {
        return layout;
      }
    }

    return 'default';
  }

  function addNavigationInstructions(element) {
    var footer = document.createElement('FOOTER');
    element.appendChild(footer);

    var instructions = document.createElement('DIV');
    instructions.className = 'navigation-instructions';
    footer.appendChild(instructions);

    var label = document.createElement('P');
    label.textContent = 'Navigation options:';
    instructions.appendChild(label);

    var list = document.createElement('UL');
    instructions.appendChild(list);

    var options = [
      'Use left + right arrow keys',
      'Click on the left + right sides of the screen',
      'Use home/ end key to go to first/ last page',
      'Use r key to go to root page',
      'Use t key to go to Table of Content'
    ];

    forEach(options, function(option) {
      var listItem = document.createElement('LI');
      listItem.textContent = option;
      list.appendChild(listItem);
    });
  }

  function removeClass(element, className) {
    if (!element) { return; }
    element.classList.remove(className);
  }

  function addClass(element, className) {
    if (!element) { return; }
    element.classList.add(className);
  }

  function handleKey(keyCode, callback) {
    document.addEventListener('keydown', function(e) {
      if (e.keyCode === keyCode) {
        callback();
      }
    });
  }

  function handleClick(conditions, callback) {
    conditions = parseConditions(conditions);

    document.addEventListener('click', function(e) {
      if (conditions(e)) {
        callback();
      }
    });
  }

  function parseConditions(conditions) {
    conditions = conditions.split(/\s+/);

    var property  = conditions[0],
        operator  = conditions[1],
        threshold = conditions[2];

    if (threshold.charAt(threshold.length - 1) === '%') {
      threshold = Number(threshold.substring(0, threshold.length - 1));
      threshold /= 100;
    } else {
      threshold = Number(threshold);
    }

    var comparisonProperty;
    switch (property) {
      case 'x':
        property = 'clientX';
        comparisonProperty = 'innerWidth';
        break;

      case 'y':
        property = 'clientY';
        comparisonProperty = 'innerHeight';
        break;

      default:
        throw "Unrecognized property: '" + property + '"';
    }

    switch (operator) {
      case '<':
        return function(e) {
          return e[property] < (window[comparisonProperty] * threshold);
        };

      case '>':
        return function(e) {
          return e[property] > (window[comparisonProperty] * threshold);
        };

      default:
        throw "Unrecognized operator: '" + operator + '"';
    }
  }

  function nextSlide() {
    var current   = document.querySelector('.slide.current'),
        prev      = current.previousElementSibling,
        next      = current.nextElementSibling,
        following = next && next.nextElementSibling;

    if (next) {
      removeClass(prev, 'previous');
      removeClass(current, 'current');
      removeClass(next, 'next');

      addClass(current, 'previous');
      addClass(next, 'current');
      addClass(following, 'next');

      setSlideId(next.id);
    }
  }

  function prevSlide() {
    var current   = document.querySelector('.slide.current'),
        prev      = current.previousElementSibling,
        next      = current.nextElementSibling,
        preceding = prev && prev.previousElementSibling;

    if (prev) {
      removeClass(next, 'next');
      removeClass(current, 'current');
      removeClass(prev, 'previous');

      addClass(current, 'next');
      addClass(prev, 'current');
      addClass(preceding, 'previous');

      setSlideId(prev.id);
    }
  }

  function setSlideId(id) {
    window.history.pushState({}, '', '#' + id);
  }

  function focusTargetSlide() {
    var current  = document.querySelector('.slide.current'),
        previous = document.querySelector('.slide.previous'),
        next     = document.querySelector('.slide.next');

    removeClass(current, 'current');
    removeClass(previous, 'previous');
    removeClass(next, 'next');

    var targetSlide = document.querySelector(window.location.hash || '.slide:first-child');
    addClass(targetSlide, 'current');
    addClass(targetSlide.previousElementSibling, 'previous');
    addClass(targetSlide.nextElementSibling, 'next');

    // Correct for any rogue dragging that occurred.
    setTimeout(function() {
      window.scrollTo(0, window.scrollY);
    }, 0);
  }

  function changeTitle() {
    var setting = Slidedown.prototype.options.slidedown.title;
    var title;
    switch (true){
      case (typeof setting == 'string'):
        // string (use the string value as title);
        title = setting;
        break;
      case setting:
        // true (use the first h1 of the md as title);
        var firstH1 = document.getElementsByTagName("h1")[0];
        title = firstH1 ? firstH1.textContent : 'Slidedown';
        break;
      default:
        // false, null or undefined (use Slidedown as title);
        title = 'Slidedown';
    }
    document.title = title;
    return title;
  }

  function getElementSlideNo (element) {
    while (!(/slide/.test(element.className) || element === null)) {
        element = element.parentNode;
    }
    return parseInt(element.id.substr(6));
  }

  function generateTOC(){
    var tocElement = document.getElementById('toc');
    if (!tocElement) return ;
    var headings = document.querySelectorAll("h1, h2");
    var tocMarkdownString = "";

    forEach(headings, function (heading){
      switch (heading.tagName) {
        case 'H1':
          tocMarkdownString += '- [' + heading.textContent + '](#slide-' + getElementSlideNo(heading) +')\n';
        break;
        case 'H2':
          tocMarkdownString += '\t+ [' + heading.textContent + '](#slide-' + getElementSlideNo(heading) +')\n';
        break;
        default:
      }
    });

    tocElement.innerHTML = marked(tocMarkdownString);
  }

  function goToSlide(slideNo) {
    return function() {
      setSlideId('slide-' + slideNo);
      focusTargetSlide();
    };
  }

  function goToToc() {
    var tocElement = document.getElementById('toc');
    if (tocElement) {
      goToSlide(getElementSlideNo(tocElement))();
    }
  }

  function goToRoot() {
    location.assign(location.pathname);
  }

  function CustomRenderer() {}

  CustomRenderer.prototype = new marked.Renderer();

  CustomRenderer.prototype.image = function(href, title, text) {
    if (Slidedown.prototype.options.slidedown.showImageCaption === true) {
      return '<img src="' + href + '" alt="' + text + '"/><div class="caption">' + text + '</div>';
    }
    return '<img src="' + href + '" alt="' + text +'"/>';
  };

  CustomRenderer.prototype.code = function code(code, lang) {
    if (!lang) {
      return '<pre class="hljs">' + code + '</pre>';
    }

    var html = hljs.highlight(lang, code).value;
    return '<pre class="hljs ' + lang + '">' + html + '</pre>';
  };

  function staticize(constructor, properties) {
    var staticized = {};

    forEach(properties, function(property) {
      staticized[property] = function() {
        var instance = new constructor();
        return instance[property].apply(instance, arguments);
      };
    });

    return staticized;
  }

  window.Slidedown = staticize(Slidedown, [
    'fromElements',
    'fromHTML',
    'fromMarkdown',
    'fromXHR',
    'parseQuery',
    'setOptions'
  ]);

})();
