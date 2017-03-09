'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Package dependencies
 */
var _require = require('json-document'),
    JSONDocument = _require.JSONDocument;

var _require2 = require('../schemas'),
    JOSEHeaderSchema = _require2.JOSEHeaderSchema;

/**
 * Header
 */


var JOSEHeader = function (_JSONDocument) {
  _inherits(JOSEHeader, _JSONDocument);

  function JOSEHeader() {
    _classCallCheck(this, JOSEHeader);

    return _possibleConstructorReturn(this, (JOSEHeader.__proto__ || Object.getPrototypeOf(JOSEHeader)).apply(this, arguments));
  }

  _createClass(JOSEHeader, [{
    key: 'isJWS',


    /**
     * isJWS
     */
    value: function isJWS() {}

    /**
     * isJWE
     */

  }, {
    key: 'isJWE',
    value: function isJWE() {}
  }], [{
    key: 'schema',


    /**
     * schema
     */
    get: function get() {
      return JOSEHeaderSchema;
    }
  }]);

  return JOSEHeader;
}(JSONDocument);

/**
 * Export
 */


module.exports = JOSEHeader;