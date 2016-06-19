(function (root, factory) {
  if ( typeof define === 'function' && define.amd ) {
    define([], factory(root));
  } else if ( typeof exports === 'object' ) {
    module.exports = factory(root);
  } else {
    root.myPlugin = factory(root); // @todo rename plugin
  }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {
  'use strict';

  //////////////////////////////
  // Variables
  //////////////////////////////

  var myPlugin = {}; // Object for public APIs
  var supports = !!document.querySelector && !!root.addEventListener; // Feature test
  var settings;

  // Default settings
  var defaults = {
    someVar: 123,
    initClass: 'js-myplugin',
    callbackBefore: function () {},
    callbackAfter: function () {}
  };

  //////////////////////////////
  // Private Functions
  //////////////////////////////

  /**
   * A simple forEach() implementation for Arrays, Objects and NodeLists
   * @private
   * @param {Array|Object|NodeList} collection Collection of items to iterate
   * @param {Function} callback Callback function for each iteration
   * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
   */
  function forEach(collection, callback, scope) {
    if (Object.prototype.toString.call(collection) === '[object Object]') {
      for (var prop in collection) {
        if (Object.prototype.hasOwnProperty.call(collection, prop)) {
          callback.call(scope, collection[prop], prop, collection);
        }
      }
    } else {
      for (var i = 0, len = collection.length; i < len; i++) {
        callback.call(scope, collection[i], i, collection);
      }
    }
  };

  /**
   * Merge defaults with user options
   * @private
   * @param {Object} defaults Default settings
   * @param {Object} options User options
   * @returns {Object} Merged values of defaults and options
   */
  function extend( defaults, options ) {
    var extended = {};

    forEach(defaults, function (value, prop) {
      extended[prop] = defaults[prop];
    });

    forEach(options, function (value, prop) {
      extended[prop] = options[prop];
    });

    return extended;
  };

  //////////////////////////////
  // Public APIs
  //////////////////////////////

  /**
   * Destroy the current initialization.
   * @public
   */
  myPlugin.destroy = function() {

    // If plugin isn't already initialized, stop
    if ( !settings ) return;

    // Remove init class for conditional CSS
    document.documentElement.classList.remove( settings.initClass );

    // @todo Undo any other init functions...

    // Remove event listeners
    document.removeEventListener('click', eventHandler, false);

    // Reset variables
    settings = null;
  };

  /**
   * Initialize Plugin
   * @public
   * @param {Object} options User settings
   */
  myPlugin.init = function(options) {

    // Feature test
    if ( !supports ) return;

    // Destroy any existing initializations
    myPlugin.destroy();

    // Merge user options with defaults
    settings = extend( defaults, options || {} );

    // Add class to HTML element to activate conditional CSS
    document.documentElement.classList.add( settings.initClass );

    // @todo Do something...

    // Listen for events
    document.addEventListener('click', eventHandler, false);
  };

  return myPlugin;
});
