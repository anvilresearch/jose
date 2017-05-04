/**
 * Dependencies
 */
const Base64URLSchema = require('./Base64URLSchema')
const JWTClaimsSetSchema = require('./JWTClaimsSetSchema')
const JOSEHeaderSchema = require('./JOSEHeaderSchema')
const {JSONSchema} = require('json-document')

/**
 * JWDSchema
 */
const JWDSchema = new JSONSchema({
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
})

/**
 * Export
 */
module.exports = JWDSchema
