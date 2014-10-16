'use strict';

/**
 * @description
 * Test if a reference is a `undefined`
 * @param {*} value Reference to check.
 * @returns {boolean}
 */
function isUndefined(value) {
  return typeof value === 'undefined';
}

/**
 * @description
 * Test if a reference is a `Function`
 * @param {*} value Reference to check.
 * @returns {boolean}
 */
function isFunction(value) {
  return typeof value === 'function';
}

/**
 * @description
 * Test if a reference is a `String`
 * @param {*} value Reference to check.
 * @returns {boolean}
 */
function isString(value) {
  return typeof value === 'string';
}

/**
 * @description
 * Creates a new object without a prototype.
 * @returns {Object}
 */
function createMap() {
  return Object.create(null);
}

/**
 * @description
 * A function that performs no operations.
 * This function can be useful when writing code in the
 * functional style.
 */
function noop() {}

module.exports = {
  isString: isString,
  isUndefined: isUndefined,
  isFunction: isFunction,
  createMap: createMap,
  noop: noop
};