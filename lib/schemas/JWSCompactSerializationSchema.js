'use strict';

/**
 * Dependencies
 */
var JOSEHeaderSchema = require('./JOSEHeaderSchema');
var JWTClaimsSetSchema = require('./JWTClaimsSetSchema');

var _require = require('json-document'),
    JSONSchema = _require.JSONSchema;

/**
 * JWT Schema
 */


var JWSCompactSerializationSchema = new JSONSchema({
  type: 'object',
  additionalProperties: false,
  properties: {
    header: JOSEHeaderSchema,
    payload: JWTClaimsSetSchema,
    signature: { type: 'string', format: 'base64url' }
  }
});

/**
 * Export
 */
module.exports = JWSCompactSerializationSchema;