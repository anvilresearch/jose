/**
 * Dependencies
 */
const {JSONSchema} = require('@trust/json-document')

/**
 * Base64URLSchema
 */
const Base64URLSchema = new JSONSchema({
  type: 'string',
  format: 'base64url'
})

/**
 * Export
 */
module.exports = Base64URLSchema
