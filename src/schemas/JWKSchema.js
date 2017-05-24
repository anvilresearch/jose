'use strict'

/**
 * Dependencies
 * @ignore
 */
const {JSONSchema} = require('json-document')
const {BASE64_REGEXP} = require('../formats')

/**
 * JWK Schema
 */
const JWKSchema = new JSONSchema({
  type: 'object',
  properties: {

    kty: {
      type: 'string',
      //format: 'case-sensitive',
      enum: [
        'RSA',
        'EC',
        'oct'
      ] // other values MAY be used
    },

    use: {
      type: 'string',
      //format: 'case-sensitive',
      enum: [
        'sig',
        'enc'
      ] // other values MAY be used
    },

    key_ops: {
      type: 'array',
      //format: 'case-sensitive',
      items: {
        enum: [
          'sign',
          'verify',
          'encrypt',
          'decrypt',
          'wrapKey',
          'unwrapKey',
          'deriveKey',
          'deriveBits'
        ] // other values MAY be used
      }
    },

    alg: {
      type: 'string',
      //format: 'case-sensitive',
      enum: [
        'HS256',
        'HS384',
        'HS512',
        'RS256',
        'RS384',
        'RS512',
        'ES256',
        'ES384',
        'ES512',
        'PS256',
        'PS384',
        'PS512',
        'none'
      ] // other values MAY be used
    },

    kid: {
      type: 'string'
    },

    x5u: {
      type: 'string',
      //format: 'url'
    },

    x5c: {
      type: 'array',
      //format: BASE64_REGEXP
    },

    x5t: {
      type: 'string',
      //format: BASE64_REGEXP
    },

    //'x5t#S256': {
    //  type: 'string',
    //  //format: BASE64_REGEXP
    //}
  }
})

/**
 * Export
 */
module.exports = JWKSchema
