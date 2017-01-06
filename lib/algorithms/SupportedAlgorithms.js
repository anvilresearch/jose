'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Dependencies
 */
var NotSupportedError = require('../errors/NotSupportedError');

/**
 * Operations
 */
var operations = ['sign', 'verify', 'encrypt', 'decrypt', 'importKey'];

/**
 * SupportedAlgorithms
 */

var SupportedAlgorithms = function () {

  /**
   * constructor
   */
  function SupportedAlgorithms() {
    var _this = this;

    _classCallCheck(this, SupportedAlgorithms);

    operations.forEach(function (op) {
      _this[op] = {};
    });
  }

  /**
   * Supported Operations
   */


  _createClass(SupportedAlgorithms, [{
    key: 'define',


    /**
     * define
     *
     * @description
     * Register Web Crypto API algorithm parameter for an algorithm
     * and operation.
     *
     * @param {string} alg
     * @param {string} op
     * @param {Object} argument
     */
    value: function define(alg, op, argument) {
      var registeredAlgorithms = this[op];
      registeredAlgorithms[alg] = argument;
    }

    /**
     * normalize
     *
     * @description
     * Map JWA alg name to Web Crypto API algorithm parameter
     *
     * @param {string} op
     * @param {Object} alg
     *
     * @returns {Object}
     */

  }, {
    key: 'normalize',
    value: function normalize(op, alg) {
      var registeredAlgorithms = this[op];

      if (!registeredAlgorithms) {
        return new SyntaxError(); // what kind of error should this be?
      }

      var argument = registeredAlgorithms[alg];

      if (!argument) {
        return new NotSupportedError(alg);
      }

      return argument;
    }
  }], [{
    key: 'operations',
    get: function get() {
      return operations;
    }
  }]);

  return SupportedAlgorithms;
}();

/**
 * Export
 */


module.exports = SupportedAlgorithms;