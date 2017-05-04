'use strict';

/**
 * Dependencies
 */
var Base64URLSchema = require('./Base64URLSchema');
var JWTClaimsSetSchema = require('./JWTClaimsSetSchema');
var JOSEHeaderSchema = require('./JOSEHeaderSchema');

var _require = require('json-document'),
    JSONSchema = _require.JSONSchema;

/**
 * JWDSchema
 */


var JWDSchema = new JSONSchema({
  type: 'object',
  properties: {

    /**
     * payload
     */
    payload: JWTClaimsSetSchema,

    /**
     * signatures
     */
    signatures: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          protected: JOSEHeaderSchema,
          header: { type: 'object' },
          signature: Base64URLSchema
        }
      }
    }
  }
});

/**
 * Export
 */
module.exports = JWDSchema;