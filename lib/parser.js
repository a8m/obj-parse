'use strict';

var _ = require('./utils');

/**
 * @description
 * generate template function
 * @param code
 * @returns {Function}
 */
function fnTemplate(code) {
  return function() {
    return 'function(s, l) {\n\t' +
      code.split('\n').join('\n\t')
      + '\n}';
  }
}

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
      var code = '';

      for(var index = 0; index < keysLen; index++) {
        var key = pathKeys[index];
        code += 'if(s == null) return undefined;\n' +
          's = ' + (index
          ? 's'
          : '(( l && l.hasOwnProperty("' + key +'")) ? l : s)') +
          '["' + key + '"];\n';
      }
      code += 'return s;';

      var getterFn = new Function('s', 'l', code); //scope, local
      getterFn.toString = fnTemplate(code);

      fn = cache[cacheKey] = function(scope, local) {
        return getterFn(scope, local);
      };

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