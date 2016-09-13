/**
 * Dependencies
 */
const JOSEHeaderSchema = require('./JOSEHeaderSchema')
const JWTClaimsSetSchema = require('./JWTClaimsSetSchema')
const {JSONSchema} = require('json-document')

/**
 * JWT Schema
 */
const JWSCompactSerializationSchema = new JSONSchema({
  type: 'object',
  additionalProperties: false,
  properties: {
    header: JOSEHeaderSchema,
    payload: JWTClaimsSetSchema,
    signature: { type: 'string', format: 'base64url' },
  }
})

/**
 * Export
 */
module.exports = JWSCompactSerializationSchema
