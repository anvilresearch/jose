'use strict'

/**
 * Dependencies
 */

/**
 * JWK
 */
class JWK {
  static get schema () {
    return {
      type: 'object',
      properties: {

        kty: {
          type: 'string',
          format: 'case-sensitive',
          enum: ['RSA', 'EC', 'oct'] // other values MAY be used
        },

        use: {
          type: 'string',
          format: 'case-sensitive',
          enum: ['sig', 'enc'] // other values MAY be used
        },

        key_ops: {
          type: 'array',
          format: 'case-sensitive',
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
        },

        alg: {
          type: 'string',
          format: 'case-sensitive',
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
          format: 'url'
        },

        x5c: {},

        x5t: {},

        'x5t#S256': {}
      }
    }
  }
}

/**
 * Export
 */
module.exports = JWK
