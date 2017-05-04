'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Dependencies
 * @ignore
 */
var base64url = require('base64url');
var JWT = require('./JWT');
var DataError = require('../errors/DataError');

/**
 * Helper Functions
 * @ignore
 */
function clean(input) {
  return JSON.parse(JSON.stringify(input));
}

/**
 * JWD
 */

var JWD = function (_JWT) {
  _inherits(JWD, _JWT);

  function JWD() {
    _classCallCheck(this, JWD);

    return _possibleConstructorReturn(this, (JWD.__proto__ || Object.getPrototypeOf(JWD)).apply(this, arguments));
  }

  _createClass(JWD, [{
    key: 'toDocumentFlattened',


    /**
     * toDocumentFlattened
     */
    value: function toDocumentFlattened() {
      var payload = this.payload,
          signatures = this.signatures;

      var protectedHeader = void 0,
          unprotectedHeader = void 0,
          signature = void 0;

      // Signatures present
      if (signatures && Array.isArray(signatures) && signatures.length > 0) {
        protectedHeader = signatures[0].protected;
        unprotectedHeader = signatures[0].header;
        signature = signatures[0].signature;
      }

      if (!protectedHeader) {
        throw new DataError('Protected header is required');
      }

      if (this.isJWE()) {
        // TODO
      } else {
        return JSON.stringify({
          payload: payload,
          header: unprotectedHeader,
          protected: protectedHeader,
          signature: signature
        });
      }
    }

    /**
     * toDocumentGeneral
     */

  }, {
    key: 'toDocumentGeneral',
    value: function toDocumentGeneral() {
      var payload = this.payload,
          signatures = this.signatures;


      if (this.isJWE()) {
        // TODO
      } else {
        return JSON.stringify({ payload: payload, signatures: signatures });
      }
    }

    /**
     * toJWT
     *
     * @description
     * Convert a JWD to a JWT
     *
     * @return {JWT}
     */

  }, {
    key: 'toJWT',
    value: function toJWT() {
      var JWT = require('./JWT');
      return new JWT(this);
    }

    /**
     * serialize
     *
     * @description
     * Serialize a JWD instance to the preferred serialization
     *
     * @return {SerializedToken}
     */

  }, {
    key: 'serialize',
    value: function serialize() {
      var serialization = this.serialization;


      switch (serialization) {
        case 'compact':
          return this.toJWT().toCompact();
        case 'flattened':
          return this.toJWT().toFlattened();
        case 'json':
          return this.toJWT().toGeneral();
        case 'document':
          return this.toDocumentGeneral();
        case 'flattened-document':
          return this.toDocumentFlattened();
        default:
          return this.toDocumentGeneral();
      }
    }
  }], [{
    key: 'decode',


    /**
     * decode
     *
     * @description
     * Decode a JSON Web Document
     *
     * @param {String} token
     *
     * @returns {JWT}
     */
    value: function decode(token) {
      var ExtendedJWD = this;

      if (typeof token !== 'string') {
        throw new DataError('Invalid JWD');
      }

      if (!token.startsWith('{')) {
        throw new DataError('Malformed JWD');
      }

      // Parse
      try {
        token = JSON.parse(token);
      } catch (err) {
        throw new DataError('Malformed JWD');
      }

      // Document General
      if (token.signatures) {
        return this.fromDocumentGeneral(token);

        // Document Flattened
      } else {
        return this.fromDocumentFlattened(token);
      }
    }

    /**
     * fromDocumentFlattened
     *
     * @description
     * Deserialize a Compact JWT and instantiate an instance
     *
     * @param  {String} data
     * @return {JWT}
     */

  }, {
    key: 'fromDocumentFlattened',
    value: function fromDocumentFlattened(data) {
      var ExtendedJWD = this;

      // Parse
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (err) {
          throw new DataError('Malformed JWD');
        }
      }

      // Input should be an object by now
      if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' || data === null || Array.isArray(data)) {
        throw new DataError('Invalid JWD');
      }

      var _data = data,
          protectedHeader = _data.protected,
          unprotectedHeader = _data.header,
          payload = _data.payload,
          signature = _data.signature;

      // Sanity Check

      if ((typeof protectedHeader === 'undefined' ? 'undefined' : _typeof(protectedHeader)) !== 'object' || protectedHeader === null || Array.isArray(protectedHeader)) {
        throw new DataError('JWT Header must be an object');
      }

      if (unprotectedHeader && ((typeof unprotectedHeader === 'undefined' ? 'undefined' : _typeof(unprotectedHeader)) !== 'object' || unprotectedHeader === null || Array.isArray(unprotectedHeader))) {
        throw new DataError('JWT Header must be an object');
      }

      // Normalize and return instance
      return new ExtendedJWD(clean({
        payload: payload,
        signatures: [{ protected: protectedHeader, header: unprotectedHeader, signature: signature }],
        serialization: 'document-flattened',
        type: 'JWS'
      }));
    }

    /**
     * fromDocumentGeneral
     *
     * @description
     * Deserialize a General JWD and instantiate an instance
     *
     * @param  {String} data
     * @return {JWD}
     */

  }, {
    key: 'fromDocumentGeneral',
    value: function fromDocumentGeneral(data) {
      var ExtendedJWD = this;

      // Parse
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (err) {
          throw new DataError('Malformed JWD');
        }
      }

      // Input should be an object by now
      if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' || data === null || Array.isArray(data)) {
        throw new DataError('Invalid JWD');
      }

      // Signatures must be present and an array
      if (!Array.isArray(data.signatures)) {
        throw new DataError('JWD signatures property must be an array');
      }

      var _data2 = data,
          payload = _data2.payload,
          signatures = _data2.signatures;

      // Normalize and return instance

      return new ExtendedJWD(clean({
        payload: payload,
        signatures: signatures,
        serialization: 'document',
        type: 'JWS'
      }));
    }
  }]);

  return JWD;
}(JWT);

/**
 * Export
 */


module.exports = JWD;