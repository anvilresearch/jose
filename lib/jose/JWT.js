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
var JWA = require('./JWA');
var DataError = require('../errors/DataError');

/**
 * Helper Functions
 * @ignore
 */
function clean(input) {
  return JSON.parse(JSON.stringify(input));
}

/**
 * JWT
 */

var JWT = function (_JSONDocument) {
  _inherits(JWT, _JSONDocument);

  /**
   * constructor
   */
  function JWT(data, options) {
    _classCallCheck(this, JWT);

    var _this = _possibleConstructorReturn(this, (JWT.__proto__ || Object.getPrototypeOf(JWT)).call(this, data, options));

    Object.keys(data).forEach(function (key) {
      if (!_this[key]) {
        Object.defineProperty(_this, key, {
          value: data[key],
          enumerable: false,
          configurable: true
        });
      }
    });
    return _this;
  }

  /**
   * schema
   */


  _createClass(JWT, [{
    key: 'isJWE',


    /**
     * isJWE
     */
    value: function isJWE() {
      var unprotectedHeader = this.header,
          protectedHeader = this.protected,
          recipients = this.recipients;


      return !!(unprotectedHeader && unprotectedHeader.enc || protectedHeader && protectedHeader.enc || recipients);
    }

    /**
     * resolveKeys
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
     * Encode a JSON Web Token instance
     *
     * @param {...Object} data
     * @returns {Promise<SerializedToken>}
     */

  }, {
    key: 'encode',
    value: function encode() {
      for (var _len = arguments.length, data = Array(_len), _key = 0; _key < _len; _key++) {
        data[_key] = arguments[_key];
      }

      var params = Object.assign.apply(Object, [{}].concat(data));

      if (this.isJWE()) {
        // TODO
      } else {
        return this.sign(params);
      }
    }

    /**
     * sign
     *
     * @description
     * Sign a JWT instance
     *
     * @todo import different types of key
     *
     * @param {...Object} data
     * @returns {Promise<SerializedToken>}
     */

  }, {
    key: 'sign',
    value: function sign() {
      var _this2 = this;

      for (var _len2 = arguments.length, data = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        data[_key2] = arguments[_key2];
      }

      var validation = this.validate();

      if (!validation.valid) {
        return Promise.reject(validation);
      }

      var params = Object.assign.apply(Object, [{}].concat(data));
      var payload = this.payload;
      var protectedHeader = params.protected,
          unprotectedHeader = params.header,
          signature = params.signature,
          signatures = params.signatures,
          serialization = params.serialization,
          cryptoKey = params.cryptoKey;

      // Override serialization

      if (serialization) {
        Object.defineProperty(this, 'serialization', {
          value: serialization,
          enumerable: false,
          configurable: true
        });
      }

      // Normalize new flat signature
      if (cryptoKey && !signature && (unprotectedHeader || protectedHeader)) {
        var descriptor = {};

        if (!protectedHeader && unprotectedHeader) {
          descriptor.protected = unprotectedHeader;
        } else {
          descriptor.protected = protectedHeader;
          descriptor.header = unprotectedHeader;
        }

        descriptor.cryptoKey = cryptoKey;

        // Add to signatures array
        if (signatures && Array.isArray(signatures)) {
          signatures.push(descriptor);
        } else {
          signatures = [descriptor];
        }
      }

      // Create signatures
      var promises = [];
      if (signatures && Array.isArray(signatures)) {
        // Ignore ambiguous/invalid descriptors
        promises = signatures.filter(function (descriptor) {
          return descriptor.cryptoKey && !descriptor.signature;

          // assemble and sign
        }).map(function (descriptor) {
          var protectedHeader = descriptor.protected,
              unprotectedHeader = descriptor.header,
              signature = descriptor.signature,
              cryptoKey = descriptor.cryptoKey;
          var alg = protectedHeader.alg;

          // Encode signature content

          var encodedHeader = base64url(JSON.stringify(protectedHeader));
          var encodedPayload = base64url(JSON.stringify(payload));
          var data = encodedHeader + '.' + encodedPayload;

          return JWA.sign(alg, cryptoKey, data).then(function (signature) {
            return { protected: protectedHeader, header: unprotectedHeader, signature: signature };
          });
        });
      }

      // Await signatures
      return Promise.all(promises).then(function (signatures) {
        if (signatures.length > 0) {
          if (_this2.signatures && Array.isArray(_this2.signatures)) {
            _this2.signatures = _this2.signatures.concat(signatures);
          } else {
            _this2.signatures = signatures;
          }
        }

        return _this2.serialize();
      });
    }

    /**
     * verify
     *
     * @description
     * Verify a decoded JSON Web Token instance
     *
     * @todo jwk, jwkSet and pem key types
     *
     * @param {...Object} data
     * @returns {Promise<Boolean|Object>}
     */

  }, {
    key: 'verify',
    value: function verify() {
      var _this3 = this;

      for (var _len3 = arguments.length, data = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        data[_key3] = arguments[_key3];
      }

      var params = Object.assign.apply(Object, [{}].concat(data));
      var signatures = this.signatures,
          payload = this.payload,
          serialization = this.serialization;
      var validate = params.validate,
          result = params.result,
          cryptoKey = params.cryptoKey,
          cryptoKeys = params.cryptoKeys;

      // Validate instance

      if (validate) {
        var validation = this.validate();

        if (!validation.valid) {
          throw new Error(validation);
        }
      }

      // Encode payload
      var encodedPayload = base64url(JSON.stringify(payload));

      // Verify all signatures with a key present
      var promises = signatures.map(function (descriptor, index) {

        var key = void 0;
        // Get manually mapped key
        if (descriptor.cryptoKey) {
          key = descriptor.cryptoKey;

          // Get corresponding key
        } else if (cryptoKeys && Array.isArray(cryptoKeys) && index < cryptoKeys.length && cryptoKeys[index]) {

          key = cryptoKeys[index];

          // Attempt to use the single key
        } else if (cryptoKey) {
          key = cryptoKey;

          // No key to verify signature; ignore
        } else {
          return Promise.resolve(true);
        }

        var protectedHeader = descriptor.protected,
            unprotectedHeader = descriptor.header,
            signature = descriptor.signature;

        // no signature to verify

        if (!signature) {
          return Promise.reject(new DataError('Missing signature(s)'));
        }

        var alg = protectedHeader.alg;

        // Encode header and assemble signature verification data

        var encodedHeader = base64url(JSON.stringify(protectedHeader));
        var data = encodedHeader + '.' + encodedPayload;

        // Verify signature and store result on the descriptor
        return JWA.verify(alg, key, signature, data).then(function (verified) {
          Object.defineProperty(signatures[index], 'verified', {
            value: verified,
            enumerable: false,
            configurable: true
          });
          return verified;
        });
      });

      // Await verification results
      return Promise.all(promises).then(function (verified) {
        verified = verified.reduce(function (prev, val) {
          return prev ? val : false;
        }, true);

        Object.defineProperty(_this3, 'verified', {
          value: verified,
          enumerable: false,
          configurable: true
        });

        if (!result || result === 'boolean') {
          return verified;
        } else if (result === 'object' || result === 'instance') {
          return _this3;
        }
      });
    }

    /**
     * toCompact
     */

  }, {
    key: 'toCompact',
    value: function toCompact() {
      var payload = this.payload,
          signatures = this.signatures;

      var protectedHeader = void 0,
          signature = void 0;

      // Signatures present
      if (signatures && Array.isArray(signatures) && signatures.length > 0) {
        protectedHeader = signatures[0].protected;
        signature = signatures[0].signature;
      }

      if (!protectedHeader) {
        throw new DataError('Protected header is required');
      }

      // Encode protected header and payload
      var encodedPayload = base64url(JSON.stringify(payload));
      var encodedHeader = base64url(JSON.stringify(protectedHeader));
      var data = encodedHeader + '.' + encodedPayload;

      if (this.isJWE()) {
        // TODO
      } else {
        // Return compact JWT with signature
        if (signature) {
          return data + '.' + signature;

          // Return compact JWT without signature
        } else {
          return data + '.';
        }
      }
    }

    /**
     * toFlattened
     */

  }, {
    key: 'toFlattened',
    value: function toFlattened() {
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

      // Encode protected header and payload
      var encodedPayload = base64url(JSON.stringify(payload));
      var encodedHeader = base64url(JSON.stringify(protectedHeader));

      if (this.isJWE()) {
        // TODO
      } else {
        return JSON.stringify({
          payload: encodedPayload,
          header: unprotectedHeader,
          protected: encodedHeader,
          signature: signature
        });
      }
    }

    /**
     * toGeneral
     */

  }, {
    key: 'toGeneral',
    value: function toGeneral() {
      var payload = this.payload,
          signatures = this.signatures;

      // Encode payload

      var encodedPayload = base64url(JSON.stringify(payload));

      if (this.isJWE()) {
        // TODO
      } else {
        // Return with signature
        if (signatures) {

          // Serialize signatures
          var serializedSignatures = signatures.map(function (descriptor) {
            var unprotectedHeader = descriptor.header,
                protectedHeader = descriptor.protected,
                signature = descriptor.signature;

            // Encode protected header

            var encodedHeader = base64url(JSON.stringify(protectedHeader));

            return { header: unprotectedHeader, protected: encodedHeader, signature: signature };
          });

          return JSON.stringify({
            payload: encodedPayload,
            signatures: serializedSignatures
          });

          // Return without signatures
        } else {
          return JSON.stringify({ payload: encodedPayload });
        }
      }
    }

    /**
     * toJWD
     *
     * @description
     * Convert a JWT to a JWD
     *
     * @return {JWD}
     */

  }, {
    key: 'toJWD',
    value: function toJWD() {
      var JWD = require('./JWD');
      return new JWD(this);
    }

    /**
     * serialize
     *
     * @description
     * Serialize a JWT instance to the preferred serialization
     *
     * @return {SerializedToken}
     */

  }, {
    key: 'serialize',
    value: function serialize() {
      var serialization = this.serialization;


      switch (serialization) {
        case 'compact':
          return this.toCompact();
        case 'flattened':
          return this.toFlattened();
        case 'json':
          return this.toGeneral();
        case 'document':
          return this.toJWD().toDocumentGeneral();
        case 'flattened-document':
          return this.toJWD().toDocumentFlattened();
        default:
          return this.toGeneral();
      }
    }
  }], [{
    key: 'decode',


    /**
     * decode
     *
     * @description
     * Decode a JSON Web Token
     *
     * @param {String} token
     * @returns {JWT}
     */
    value: function decode(token) {
      var ExtendedJWT = this;

      if (typeof token !== 'string') {
        throw new DataError('Invalid JWT');
      }

      // Parse
      if (token.startsWith('{')) {
        try {
          token = JSON.parse(token);
        } catch (err) {
          throw new DataError('Malformed JWT');
        }
      }

      // Compact
      if (typeof token === 'string') {
        return this.fromCompact(token);
      }

      // JSON General
      if (token.signatures) {
        return this.fromGeneral(token);

        // JSON Flattened
      } else {
        return this.fromFlattened(token);
      }
    }

    /**
     * fromCompact
     *
     * @description
     * Deserialize a Compact JWT and instantiate an instance
     *
     * @param  {String} data
     * @return {JWT}
     */

  }, {
    key: 'fromCompact',
    value: function fromCompact(data) {
      var ExtendedJWT = this;
      var protectedHeader = void 0,
          payload = void 0,
          signature = void 0;

      // Parse
      if (typeof data === 'string') {
        var segments = data.split('.');

        if (![3, 5].includes(segments.length)) {
          throw new DataError('Malformed JWT');
        }

        // Decode base64url
        if (segments.length === 3) {
          try {
            protectedHeader = JSON.parse(base64url.decode(segments[0]));
            payload = JSON.parse(base64url.decode(segments[1]));
            signature = segments[2];
          } catch (err) {
            throw new DataError('Malformed JWS');
          }
        }

        if (segments.length === 5) {
          // TODO JWE
        }
      }

      // Sanity Check
      if ((typeof protectedHeader === 'undefined' ? 'undefined' : _typeof(protectedHeader)) !== 'object' || protectedHeader === null || Array.isArray(protectedHeader)) {
        throw new DataError('JWT Header must be an object');
      }

      // Normalize and return instance
      return new ExtendedJWT(clean({
        payload: payload,
        signatures: [{ protected: protectedHeader, signature: signature }],
        serialization: 'compact',
        type: 'JWS'
      }));
    }

    /**
     * fromFlattened
     *
     * @description
     * Deserialize a JSON Flattened JWT and instantiate an instance
     *
     * @param  {Object|String} data
     * @return {JWT}
     */

  }, {
    key: 'fromFlattened',
    value: function fromFlattened(data) {
      var ExtendedJWT = this;
      var protectedHeader = void 0,
          payload = void 0;

      // Parse
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (err) {
          throw new DataError('Malformed JWT');
        }
      }

      // Input should be an object by now
      if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' || data === null || Array.isArray(data)) {
        throw new DataError('Invalid JWT');
      }

      // Decode base64url
      try {
        payload = JSON.parse(base64url.decode(data.payload));
        protectedHeader = JSON.parse(base64url.decode(data.protected));
      } catch (err) {
        throw new Error('Invalid JWT');
      }

      // Fetch decoded values
      var _data = data,
          unprotectedHeader = _data.header,
          signature = _data.signature;

      // Sanity Check

      if ((typeof protectedHeader === 'undefined' ? 'undefined' : _typeof(protectedHeader)) !== 'object' || protectedHeader === null || Array.isArray(protectedHeader)) {
        throw new DataError('JWT Header must be an object');
      }

      if (unprotectedHeader && ((typeof unprotectedHeader === 'undefined' ? 'undefined' : _typeof(unprotectedHeader)) !== 'object' || unprotectedHeader === null || Array.isArray(unprotectedHeader))) {
        throw new DataError('JWT Header must be an object');
      }

      // Normalize and return instance
      return new ExtendedJWT(clean({
        payload: payload,
        signatures: [{ protected: protectedHeader, header: unprotectedHeader, signature: signature }],
        serialization: 'flattened',
        type: 'JWS'
      }));
    }

    /**
     * fromGeneral
     *
     * @description
     * Deserialize a JSON General JWT and instantiate an instance
     *
     * @param  {Object|String} data
     * @return {JWT}
     */

  }, {
    key: 'fromGeneral',
    value: function fromGeneral(data) {
      var ExtendedJWT = this;
      var payload = void 0,
          signatures = void 0;

      // Parse
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (err) {
          throw new DataError('Malformed JWT');
        }
      }

      // Input should be an object by now
      if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' || data === null || Array.isArray(data)) {
        throw new DataError('Invalid JWT');
      }

      // Signatures must be present and an array
      if (!Array.isArray(data.signatures)) {
        throw new DataError('JWT signatures property must be an array');
      }

      // Decode payload
      try {
        payload = JSON.parse(base64url.decode(data.payload));
      } catch (err) {
        throw new Error('Invalid JWT');
      }

      // Decode signatures
      signatures = data.signatures.map(function (descriptor) {
        var protectedHeader = descriptor.protected,
            unprotectedHeader = descriptor.header,
            signature = descriptor.signature;

        var decodedHeader = void 0;

        try {
          decodedHeader = JSON.parse(base64url.decode(protectedHeader));
        } catch (err) {
          throw new DataError('Invalid JWT');
        }

        if (!decodedHeader || (typeof decodedHeader === 'undefined' ? 'undefined' : _typeof(decodedHeader)) !== 'object' || decodedHeader === null || Array.isArray(decodedHeader)) {
          throw new DataError('JWT Protected Header must be an object');
        }

        if (unprotectedHeader && ((typeof unprotectedHeader === 'undefined' ? 'undefined' : _typeof(unprotectedHeader)) !== 'object' || unprotectedHeader === null || Array.isArray(unprotectedHeader))) {
          throw new DataError('JWT Header must be an object');
        }

        return {
          protected: decodedHeader,
          header: unprotectedHeader,
          signature: signature
        };
      });

      // Normalize and return instance
      return new ExtendedJWT(clean({
        payload: payload,
        signatures: signatures,
        serialization: 'json',
        type: 'JWS'
      }));
    }

    /**
     * from
     *
     * @description
     * Instanciate a JWT from an object descriptor
     *
     * @param {Object|String} data
     * @param {String} [data.serialized] - Existing serialized JWT
     *
     * @return {JWT}
     */

  }, {
    key: 'from',
    value: function from(data) {
      var ExtendedJWT = this;

      // Decode serialized token
      if (typeof data === 'string' || data.serialized) {
        return this.decode(data.serialized || data);
      }

      var payload = data.payload,
          signatures = data.signatures,
          serialization = data.serialization;


      if (!payload) {
        throw new DataError('Invalid JWT');
      }

      // Include compelete signature descriptors only
      if (signatures && Array.isArray(signatures)) {
        signatures = signatures.filter(function (descriptor) {
          return !descriptor.cryptoKey || descriptor.signature;
        });
      } else {
        signatures = [];
      }

      // Normalize existing flat signature
      if (!data.cryptoKey && data.signature) {
        var protectedHeader = data.protected,
            unprotectedHeader = data.header,
            signature = data.signature;

        var descriptor = {};

        if (!protectedHeader && unprotectedHeader) {
          descriptor.protected = unprotectedHeader;
        } else {
          descriptor.protected = protectedHeader;
          descriptor.header = unprotectedHeader;
        }

        descriptor.signature = signature;

        if (signatures && Array.isArray(signatures)) {
          signatures.unshift(descriptor);
        } else {
          signatures = [descriptor];
        }
      }

      return new ExtendedJWT(clean({
        payload: payload,
        signatures: signatures,
        serialization: serialization,
        type: 'JWS'
      }));
    }

    /**
     * sign
     *
     * @description
     * Sign a JSON Web Token
     *
     * @params {...Object} data - Token data
     *
     * @returns {Promise<SerializedToken>}
     */

  }, {
    key: 'sign',
    value: function sign() {
      for (var _len4 = arguments.length, data = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        data[_key4] = arguments[_key4];
      }

      // Shallow merge data
      var params = Object.assign.apply(Object, [{}].concat(data));

      // Try decode
      var instance = void 0;
      try {
        instance = this.from(params);
      } catch (e) {
        return Promise.reject(e);
      }

      return instance.sign(params);
    }

    /**
     * encode
     *
     * @description
     * Encode a JSON Web Token
     *
     * @param {...Object} data
     *
     * @returns {Promise<SerializedToken>}
     */

  }, {
    key: 'encode',
    value: function encode() {
      for (var _len5 = arguments.length, data = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        data[_key5] = arguments[_key5];
      }

      // Shallow merge data
      var params = Object.assign.apply(Object, [{}].concat(data));

      // Try decode
      var instance = void 0;
      try {
        instance = this.from(params);
      } catch (e) {
        return Promise.reject(e);
      }

      return instance.encode(params);
    }

    /**
     * verify
     *
     * @description
     * Decode and verify a JSON Web Token
     *
     * @param {...Object} data
     * @returns {Promise<JWT>}
     */

  }, {
    key: 'verify',
    value: function verify() {
      for (var _len6 = arguments.length, data = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        data[_key6] = arguments[_key6];
      }

      var params = Object.assign.apply(Object, [{}].concat(data));
      var serialized = params.serialized;


      if (!serialized) {
        throw new Error('JWT input required');
      }

      // Try decode
      var instance = void 0;
      try {
        instance = this.from(serialized);
      } catch (e) {
        return Promise.reject(e);
      }

      return instance.verify(params);
    }
  }, {
    key: 'schema',
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