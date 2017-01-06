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
 * RSASSA-PKCS1-v1_5
 */

var RSASSA_PKCS1_v1_5 = function () {

  /**
   * constructor
   *
   * @param {string} bitlength
   */
  function RSASSA_PKCS1_v1_5(params) {
    _classCallCheck(this, RSASSA_PKCS1_v1_5);

    this.params = params;
  }

  /**
   * sign
   *
   * @description
   * Generate a digital signature for a given input and private key.
   *
   * @param {CryptoKey} key
   * @param {BufferSource} data
   *
   * @returns {Promise}
   */


  _createClass(RSASSA_PKCS1_v1_5, [{
    key: 'sign',
    value: function sign(key, data) {
      var algorithm = this.params;

      // TODO
      //if (!this.sufficientKeySize()) {
      //  return Promise.reject(
      //    new Error(
      //      'A key size of 2048 bits or larger must be used with RSASSA-PKCS1-v1_5'
      //    )
      //  )
      //}

      data = new TextEncoder().encode(data);

      return crypto.subtle.sign(algorithm, key, data).then(function (signature) {
        return base64url(Buffer.from(signature));
      });
    }

    /**
     * verify
     *
     * @description
     * Verify a digital signature for a given input and private key.
     *
     * @param {CryptoKey} key
     * @param {BufferSource} signature
     * @param {BufferSource} data
     *
     * @returns {Promise}
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
      // ...

      return crypto.subtle.verify(algorithm, key, signature, data);
    }

    /**
     * importKey
     *
     * @param {JWK} key
     * @returns {Promise}
     */

  }, {
    key: 'importKey',
    value: function importKey(key) {
      var jwk = Object.assign({}, key);
      var algorithm = this.params;
      var usages = key['key_ops'] || [];

      if (key.use === 'sig') {
        usages.push('verify');
      }

      if (key.use === 'enc') {
        // TODO: handle encryption keys
        return Promise.resolve(key);
      }

      if (key.key_ops) {
        usages = key.key_ops;
      }

      return crypto.subtle.importKey('jwk', jwk, algorithm, true, usages).then(function (cryptoKey) {
        Object.defineProperty(jwk, 'cryptoKey', {
          enumerable: false,
          value: cryptoKey
        });

        return jwk;
      });
    }
  }]);

  return RSASSA_PKCS1_v1_5;
}();

/**
 * Export
 */


module.exports = RSASSA_PKCS1_v1_5;