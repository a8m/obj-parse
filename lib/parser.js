'use strict';

var _ = require('./utils');

/**
 * @param scope {Object}
 * @param path {Array}
 * @param value {String}
 * @returns {*}
 * return scope object or undefined if the path was wrong
 */
function setterFn(scope, path, value) {
  var s = scope;
  for(var i = 0; i < path.length - 1; i++) {
    s = s[path[i]];
    if(_.isUndefined(s) || _.isUndefined(s[path[i+1]])) {
      return undefined;
    }
  }
  s[path[i]] = value;
  return scope;
}

/**
 * @param pathKeys {Array}
 * @returns Function
 * Constructs and returns a recursive function that will traverse
 * a scope and local object. The end product looks like this:
 *
 * createGetterFn("user", "address", "city") =>
 *
 * function(scope, local) {
 *   function(scope, local) {
 *     function(scope, local) {
 *       function(scope, local) {
 *         if (local && local.hasOwnProperty("city")) return local["city"];
 *         if (scope) return scope["city"];
 *       }
 *     }(scope && scope["address"], local && local["address"])
 *   }(scope && scope["user"], local && local["user"])
 * }
*/
function createGetterFn(pathKeys) {
  var fn = null;
  for (var i = pathKeys.length -1; i >= 0; i--) {
    if (fn === null) {
      fn = finalFn(pathKeys[i]);
    } else {
      fn = stepFn(pathKeys[i], fn);
    }
  }
  return fn;

  function finalFn(key) {
    return function(scope, local) {
      if (local && local.hasOwnProperty(key)) return local[key];
      if (scope) return scope[key];
    }
  }

  function stepFn(key, next) {
    return function(scope, local) {
      return next(scope && scope[key], local && local[key]);
    }
  }
}

/**
 * @description
 * return parse function
 * @returns {Function}
 */
function parseFactory() {

  var cache = _.createMap();

  return function(exp) {
    var fn;

    if(_.isString(exp)) {
      var cacheKey = exp.trim();
      if(cache[cacheKey]) {
        return cache[cacheKey];
      }
      var pathKeys = exp.split('.');
      var keysLen = pathKeys.length;

      fn = cache[cacheKey] = createGetterFn(pathKeys);

      fn.assign = function(scope, value) {
        return setterFn(scope, pathKeys, value);
      };

    } else if(_.isFunction(exp)) {
      fn = function(scope, local) {
        return exp(scope, local);
      }
    }

    return fn || _.noop;
  }

}

/**
 * @export
 */
module.exports = parseFactory();
