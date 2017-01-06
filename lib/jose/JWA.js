'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Dependencies
 *
 * TODO
 * - switch between Node.js webcrypto package and browser implementation
 */
var base64url = require('base64url');
var supportedAlgorithms = require('../algorithms');

var _require = require('../errors'),
    NotSupportedError = _require.NotSupportedError;

/**
 * JWA
 * https://tools.ietf.org/html/rfc7518
 */


var JWA = function () {
  function JWA() {
    _classCallCheck(this, JWA);
  }

  _createClass(JWA, null, [{
    key: 'sign',


    /**
     * Sign
     *
     * @description
     * Create a digital signature.
     *
     * @param {string} alg
     * @param {CryptoKey} key
     * @param {string|Buffer} data
     *
     * @return {Promise}
     */
    value: function sign(alg, key, data) {
      // normalize the algorithm
      var normalizedAlgorithm = supportedAlgorithms.normalize('sign', alg);

      // validate algorithm is supported
      if (normalizedAlgorithm instanceof Error) {
        return Promise.reject(new NotSupportedError(alg));
      }

      // validate type of key
      // TODO
      //  - is the key suitable for the algorithm?
      //  - does that get validated in webcrypto?
      //if (key instanceof CryptoKey) {
      //  return Promise.reject(new InvalidKeyError())
      //}

      // sign the data
      return normalizedAlgorithm.sign(key, data);
    }

    /**
     * Verify
     *
     * @description
     * Verify a digital signature.
     *
     * @param {string} alg
     * @param {CryptoKey} privateKey
     * @param {string|Buffer} signature
     * @param {string|Buffer} data
     *
     * @return {Promise}
     */

  }, {
    key: 'verify',
    value: function verify(alg, key, signature, data) {
      var normalizedAlgorithm = supportedAlgorithms.normalize('verify', alg);

      if (normalizedAlgorithm instanceof Error) {
        return Promise.reject(new NotSupportedError(alg));
      }

      // TODO
      // validate publicKey

      // verify the signature
      return normalizedAlgorithm.verify(key, signature, data);
    }

    /**
     * Encrypt
     */

    /**
     * Decrypt
     */

    /**
     * Import
     */

  }, {
    key: 'importKey',
    value: function importKey(key) {
      var normalizedAlgorithm = supportedAlgorithms.normalize('importKey', key.alg);
      return normalizedAlgorithm.importKey(key);
    }
  }]);

  return JWA;
}();

/**
 * Export
 */


module.exports = JWA;