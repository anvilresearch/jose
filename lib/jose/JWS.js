'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Dependencies
 */
var base64url = require('base64url');
var JWA = require('./JWA');

var _require = require('../errors'),
    DataError = _require.DataError;

/**
 * JWS
 */


var JWS = function () {
  function JWS() {
    _classCallCheck(this, JWS);
  }

  _createClass(JWS, null, [{
    key: 'sign',


    /**
     * sign
     *
     * @description
     * Encode a JWT instance
     *
     * @param {Object} token
     * @returns {Promise}
     */
    value: function sign(token) {
      var payload = base64url(JSON.stringify(token.payload));

      // compact serialization
      if (token.serialization === 'compact') {
        var _ret = function () {
          var key = token.key,
              alg = token.header.alg;

          var header = base64url(JSON.stringify(token.header));
          var data = header + '.' + payload;

          return {
            v: JWA.sign(alg, key, data).then(function (signature) {
              return data + '.' + signature;
            })
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }

      // JSON serialization
      if (token.serialization === 'json') {}

      // Flattened serialization
      if (token.serialization === 'flattened') {}

      return Promise.reject(new DataError('Unsupported serialization'));
    }

    /**
     * verify
     */

  }, {
    key: 'verify',
    value: function verify(jwt) {
      // multiple signatures
      if (jwt.signatures) {}
      // ...


      // one signature
      if (jwt.signature) {
        var _jwt$segments = _slicedToArray(jwt.segments, 2),
            header = _jwt$segments[0],
            payload = _jwt$segments[1];

        var data = header + '.' + payload;
        var key = jwt.key,
            signature = jwt.signature,
            alg = jwt.header.alg;


        return JWA.verify(alg, key, signature, data).then(function (verified) {
          jwt.verified = verified;
          return verified;
        });
      }

      // no signatures to verify
      return Promise.reject(new DataError('Missing signature(s)'));
    }
  }]);

  return JWS;
}();

/**
 * Export
 */


module.exports = JWS;