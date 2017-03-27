'use strict';

/**
 * Dependencies
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('json-document'),
    JSONDocument = _require.JSONDocument;

var JWKSetSchema = require('../schemas/JWKSetSchema');
var JWK = require('./JWK');

/**
 * JWKSet
 *
 * @class
 * JWKSet represents a JSON Web Key Set as described in Section 5 of RFC 7517:
 * https://tools.ietf.org/html/rfc7517#section-5
 */

var JWKSet = function (_JSONDocument) {
  _inherits(JWKSet, _JSONDocument);

  function JWKSet() {
    _classCallCheck(this, JWKSet);

    return _possibleConstructorReturn(this, (JWKSet.__proto__ || Object.getPrototypeOf(JWKSet)).apply(this, arguments));
  }

  _createClass(JWKSet, null, [{
    key: 'importKeys',


    /**
     * importKeys
     */
    value: function importKeys(jwks) {
      var _this2 = this;

      var imported = void 0;

      return Promise.resolve().then(function () {
        var validation = _this2.schema.validate(jwks);

        if (!validation.valid) {
          throw new Error('Invalid JWKSet: ' + JSON.stringify(validation, null, 2));
        }

        if (!jwks.keys) {
          throw new Error('Cannot import JWKSet: keys property is empty');
        }

        imported = new JWKSet(jwks);
        var importing = jwks.keys.map(function (key) {
          return JWK.importKey(key);
        });

        return Promise.all(importing);
      }).then(function (keys) {
        imported.keys = keys;
        return imported;
      });
    }
  }, {
    key: 'schema',


    /**
     * schema
     */
    get: function get() {
      return JWKSetSchema;
    }
  }]);

  return JWKSet;
}(JSONDocument);

/**
 * Export
 */


module.exports = JWKSet;