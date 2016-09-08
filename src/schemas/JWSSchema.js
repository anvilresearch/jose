/**
 * Dependencies
 */
const JWTSchema = require('./JWTSchema')

/**
 * JWS Schema
 */
const JWSSchema = JWTSchema.extend({
  type: 'object',
  properties: {

    /**
     * JOSE Header
     */
    header: {
      properties: {
        alg: {
          type: 'string',
          format: 'StringOrURI',
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
          ]
        },
        jku: {
          type: 'string',
          format: 'url'
        },
        jwk: {
          $ref: 'https://...#jwk'
        },
        kid: {
          type: 'string'
        },
        x5u: {
          type: 'string',
          format: 'url'
        },
        x5c: {
          type: 'array',
          format: 'base64' // NOT base64url
        },
        x5t: {
          type: 'string',
          format: 'base64url' // NOT base64
        },
        //'x5t#256': {
        //  type: 'string',
        //  format: 'base64url'
        //},

        // TODO
        typ: {
          type: 'string',
          format: 'MediaType'
        },

        // TODO
        cty: {
          type: 'string',
          format: 'MediaType'
        },

        crit: {
          type: 'array',
          enum: [] // is this possible?
        }
      },
      required: [
        'alg'
      ]
    }
  }
})

/**
 * Export
 */
module.exports = JWSSchema
