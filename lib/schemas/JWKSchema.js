'use strict';

/**
 * Dependencies
 * @ignore
 */

var _require = require('json-document'),
    JSONSchema = _require.JSONSchema;

var _require2 = require('../formats'),
    BASE64_REGEXP = _require2.BASE64_REGEXP;

/**
 * JWK Schema
 */


var JWKSchema = new JSONSchema({
  type: 'object',
  properties: {

    kty: {
      type: 'string',
      //format: 'case-sensitive',
      enum: ['RSA', 'EC', 'oct'] // other values MAY be used
    },

    use: {
      type: 'string',
      //format: 'case-sensitive',
      enum: ['sig', 'enc'] // other values MAY be used
    },

    key_ops: {
      type: 'array',
      //format: 'case-sensitive',
      enum: ['sign', 'verify', 'encrypt', 'decrypt', 'wrapKey', 'unwrapKey', 'deriveKey', 'deriveBits'] // other values MAY be used
    },

    alg: {
      type: 'string',
      //format: 'case-sensitive',
      enum: ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512', 'PS256', 'PS384', 'PS512', 'none'] // other values MAY be used
    },

    kid: {
      type: 'string'
    },

    x5u: {
      type: 'string'
    },

    x5c: {
      type: 'array'
    },

    x5t: {
      type: 'string'
    }

  }
});

/**
 * Export
 */
module.exports = JWKSchema;