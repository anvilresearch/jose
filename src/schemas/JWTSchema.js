/**
 * Dependencies
 */
const {JSONSchema} = require('json-document')

/**
 * JWT Schema
 */
const JWTSchema = new JSONSchema({
  type: 'object',
  properties: {

    /**
     * JOSE Header
     */
    header: {
      type: 'object',
      properties: {
        typ: { type: 'string' },
        cty: { type: 'string' }
      }
    },

    /**
     * Registered Claim Names
     *
     * NOTES:
     *
     * 1. The `type` of payload is not explicitly set here as it is possible
     *    for the payload to contain a value other than an object.
     *
     * 2. By default, additional claims are allowed. Additional claims can be
     *    disallowed by extending schemas by setting the value of
     *    `payload.additionalProperties` to `false`.
     */
    payload: {
      properties: {
        iss: { type: 'string', format: 'StringOrURI' },
        sub: { type: 'string', format: 'StringOrURI' },
        aud: { type: ['array', 'string'], format: 'StringOrURI' },
        exp: { type: 'number', format: 'NumericDate' }, // uhm... how do we validate NumericDate?
        nbf: { type: 'number', format: 'NumericDate' },
        iat: { type: 'number', format: 'NumericDate' },
        jti: { type: 'string' }
      }
    }
  }
})

/**
 * Export
 */
module.exports = JWTSchema
