'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Dependencies
 */
var base64url = require('base64url');

var _require = require('json-document'),
    JSONDocument = _require.JSONDocument;

var JWTSchema = require('../schemas/JWTSchema');
var JWS = require('./JWS');
var DataError = require('../errors/DataError');

/**
 * JWT
 */

var JWT = function (_JSONDocument) {
  _inherits(JWT, _JSONDocument);

  function JWT() {
    _classCallCheck(this, JWT);

    return _possibleConstructorReturn(this, (JWT.__proto__ || Object.getPrototypeOf(JWT)).apply(this, arguments));
  }

  _createClass(JWT, [{
    key: 'isJWE',


    /**
     * isJWE
     */
    value: function isJWE() {
      return !!this.header.enc;
    }

    /**
     * resolveKeys
     * @param jwks {Array<JWK>|JWK|JWKSet}
     * @returns {Boolean}
     */

  }, {
    key: 'resolveKeys',
    value: function resolveKeys(jwks) {
      var kid = this.header.kid;
      var keys = void 0,
          match = void 0;

      // treat an array as the "keys" property of a JWK Set
      if (Array.isArray(jwks)) {
        keys = jwks;
      }

      // presence of keys indicates object is a JWK Set
      if (jwks.keys) {
        keys = jwks.keys;
      }

      // wrap a plain object they is not a JWK Set in Array
      if (!jwks.keys && (typeof jwks === 'undefined' ? 'undefined' : _typeof(jwks)) === 'object') {
        keys = [jwks];
      }

      // ensure there are keys to search
      if (!keys) {
        throw new DataError('Invalid JWK argument');
      }

      // match by "kid" or "use" header
      if (kid) {
        match = keys.find(function (jwk) {
          return jwk.kid === kid;
        });
      } else {
        match = keys.find(function (jwk) {
          return jwk.use === 'sig';
        });
      }

      // assign matching key to JWT and return a boolean
      if (match) {
        console.log(match);
        this.key = match.cryptoKey;
        return true;
      } else {
        return false;
      }
    }

    /**
     * encode
     *
     * @description
     * Encode a JWT instance
     *
     * @returns {Promise}
     */

  }, {
    key: 'encode',
    value: function encode() {
      // validate
      var validation = this.validate();

      if (!validation.valid) {
        return Promise.reject(validation);
      }

      var token = this;

      if (this.isJWE()) {
        return JWE.encrypt(token);
      } else {
        return JWS.sign(token);
      }
    }

    /**
     * verify
     *
     * @description
     * Verify a decoded JWT instance
     *
     * @returns {Promise}
     */

  }, {
    key: 'verify',
    value: function verify() {
      var validation = this.validate();

      if (!validation.valid) {
        return Promise.reject(validation);
      }

      return JWS.verify(this);
    }
  }], [{
    key: 'decode',


    /**
     * decode
     *
     * @description
     * Decode a JSON Web Token
     *
     * @param {string} data
     * @returns {JWT}
     */
    value: function decode(data) {
      var ExtendedJWT = this;
      var jwt = void 0;

      if (typeof data !== 'string') {
        throw new DataError('JWT must be a string');
      }

      // JSON of Flattened JSON Serialization
      if (data.startsWith('{')) {
        try {
          data = JSON.parse(data, function () {});
        } catch (error) {
          throw new DataError('Invalid JWT serialization');
        }

        if (data.signatures || data.recipients) {
          data.serialization = 'json';
        } else {
          data.serialization = 'flattened';
        }

        jwt = new ExtendedJWT(data);

        // Compact Serialization
      } else {
        try {
          var serialization = 'compact';
          var segments = data.split('.');
          var length = segments.length;

          if (length !== 3 && length !== 5) {
            throw new Error('Malformed JWT');
          }

          var header = JSON.parse(base64url.decode(segments[0]));

          // JSON Web Signature
          if (length === 3) {
            var type = 'JWS';
            var payload = JSON.parse(base64url.decode(segments[1]));
            var signature = segments[2];

            jwt = new ExtendedJWT({ type: type, segments: segments, header: header, payload: payload, signature: signature, serialization: serialization });
          }

          // JSON Web Encryption
          if (length === 5) {
            //let type = 'JWE'
            //let [protected, encryption_key, iv, ciphertext, tag] = segments

            //jwt = new ExtendedJWT({
            //  type,
            //  protected: base64url.decode(JSON.parse(protected)),
            //  encryption_key,
            //  iv,
            //  ciphertext,
            //  tag,
            //  serialization
            //})
          }
        } catch (error) {
          throw new DataError('Invalid JWT compact serialization');
        }
      }

      return jwt;
    }

    /**
     * encode
     *
     * @description
     * Encode a JSON Web Token
     *
     * @param {Object} header
     * @param {Object} payload
     * @param {CryptoKey} key
     *
     * @returns {Promise}
     */

  }, {
    key: 'encode',
    value: function encode(header, payload, key) {
      var jwt = new JWT(header, payload);
      return jwt.encode(key);
    }

    /**
     * verify
     *
     * @description
     *
     * @param {CryptoKey} key
     * @param {string} token
     *
     * @returns {Promise}
     */

  }, {
    key: 'verify',
    value: function verify(key, token) {
      var jwt = JWT.decode(token);
      jwt.key = key;
      return jwt.verify().then(function (verified) {
        return jwt;
      });
    }
  }, {
    key: 'schema',


    /**
     * schema
     */
    get: function get() {
      return JWTSchema;
    }
  }]);

  return JWT;
}(JSONDocument);

/**
 * Export
 */


module.exports = JWT;