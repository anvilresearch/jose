"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * DataError
 */
var DataError = function (_Error) {
  _inherits(DataError, _Error);

  function DataError(message) {
    _classCallCheck(this, DataError);

    return _possibleConstructorReturn(this, (DataError.__proto__ || Object.getPrototypeOf(DataError)).call(this, message));
  }

  return DataError;
}(Error);

/**
 * Export
 */


module.exports = DataError;