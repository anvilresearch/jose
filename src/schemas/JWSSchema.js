/**
 * Dependencies
 */
const JWSCompactSerializationSchema = require('./JWSCompactSerializationSchema')
const JWSJSONSerializationSchema = require('./JWSJSONSerializationSchema')
const JWSFlattenedSerializationSchema = require('./JWSFlattenedSerializationSchema')
const {JSONSchema} = require('json-document')

/**
 * JWS Schema
 */
const JWSSchema = new JSONSchema({
  oneOf: [
    JWSCompactSerializationSchema,
    JWSJSONSerializationSchema,
    JWSFlattenedSerializationSchema
  ]
})

/**
 * Export
 */
module.exports = JWSSchema
