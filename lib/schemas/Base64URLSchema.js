'use strict';

/**
 * Dependencies
 */
var _require = require('json-document'),
    JSONSchema = _require.JSONSchema;

/**
 * Base64URLSchema
 */


var Base64URLSchema = new JSONSchema({
  type: 'string',
  format: 'base64url'
});

/**
 * Export
 */
module.exports = Base64URLSchema;