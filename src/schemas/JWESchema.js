/**
 * Dependencies
 */
const JWECompactSerializationSchema = require('./JWECompactSerializationSchema')
const JWEJSONSerializationSchema = require('./JWEJSONSerializationSchema')
const {JSONSchema} = require('json-document')

/**
 * JWE Schema
 */
const JWESchema = new JSONSchema({
  oneOf: [
    JWECompactSerializationSchema,
    JWEJSONSerializationSchema,
  ]
})

/**
 * Export
 */
module.exports = JWESchema
