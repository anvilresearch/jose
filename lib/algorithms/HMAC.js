'use strict';

/**
 * Dependencies
 * @ignore
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var base64url = require('base64url');
var crypto = require('webcrypto');
var TextEncoder = require('../text-encoder');

/**
 * HMAC with SHA-2 Functions
 */

var HMAC = function () {

  /**
   * Constructor
   *
   * @param {string} bitlength
   */
  function HMAC(params) {
    _classCallCheck(this, HMAC);

    this.params = params;
  }

  /**
   * Sign
   *
   * @description
   * Generate a hash-based message authentication code for a
   * given input and key. Enforce the key length is equal to
   * or greater than the bitlength.
   *
   * @param {CryptoKey} key
   * @param {string} data
   *
   * @returns {string}
   */


  _createClass(HMAC, [{
    key: 'sign',
    value: function sign(key, data) {
      var algorithm = this.params;

      // TODO: validate key length

      data = new TextEncoder().encode(data);

      return crypto.subtle.sign(algorithm, key, data).then(function (signature) {
        return base64url(Buffer.from(signature));
      });
    }

    /**
     * Verify
     *
     * @description
     * Verify a digital signature for a given input and private key.
     *
     * @param {CryptoKey} key
     * @param {string} signature
     * @param {string} data
     *
     * @returns {Boolean}
     */

  }, {
    key: 'verify',
    value: function verify(key, signature, data) {
      var algorithm = this.params;

      if (typeof signature === 'string') {
        signature = Uint8Array.from(base64url.toBuffer(signature));
      }

      if (typeof data === 'string') {
        data = new TextEncoder().encode(data);
      }

      return crypto.subtle.verify(algorithm, key, signature, data);
    }

    /**
     * Assert Sufficient Key Length
     *
     * @description Assert that the key length is sufficient
     * @param {string} key
     */

  }, {
    key: 'assertSufficientKeyLength',
    value: function assertSufficientKeyLength(key) {
      if (key.length < this.bitlength) {
        throw new Error('The key is too short.');
      }
    }
  }]);

  return HMAC;
}();

/**
 * Export
 */


module.exports = HMAC;