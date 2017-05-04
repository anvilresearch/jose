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
 * JWTSchema
 *
 * @description
 * This schema represents all the things a deserialized JWT can be, i.e.,
 * either a JWS or JWE, and any serialization of them. Validation of well-
 * formedness for a given serialization is accomplished at the time of
 * encoding.
 */


var JWTSchema = new JSONSchema({
  type: 'object',
  properties: {

    /**
     * iv
     */
    iv: Base64URLSchema,

    /**
     * aad
     */
    aad: Base64URLSchema,

    /**
     * ciphertext
     */
    ciphertext: Base64URLSchema,

    /**
     * tag
     */
    tag: Base64URLSchema,

    /**
     * recipients
     */
    recipients: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          header: JOSEHeaderSchema,
          encrypted_key: Base64URLSchema
        }
      }
    },

    /**
     * payload
     */
    payload: JWTClaimsSetSchema,

    /**
     * signatures
     */
    signatures: {
      type: 'array'
    }
  }
});

/**
 * Export
 */
module.exports = JWTSchema;