'use strict';

/**
 * Dependencies
 */

var _require = require('json-document'),
    JSONSchema = _require.JSONSchema;

var JWKSchema = require('./JWKSchema');

/**
 * JWKSetSchema
 */
var JWKSetSchema = new JSONSchema({
  type: 'object',
  properties: {
    keys: {
      type: 'array',
      items: JWKSchema
    }
  }
});

/**
 * Export
 */
module.exports = JWKSetSchema;