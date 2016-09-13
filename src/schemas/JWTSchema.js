/**
 * Dependencies
 */
const JWESchema = require('./JWESchema')
const JWSSchema = require('./JWSSchema')
const {JSONSchema} = require('json-document')

/**
 * JWT Schema
 */
const JWTSchema = new JSONSchema({
  oneOf: [
    JWESchema,
    JWSSchema
  ]
})

/**
 * Export
 */
module.exports = JWTSchema
