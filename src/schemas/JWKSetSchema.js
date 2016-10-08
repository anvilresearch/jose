'use strict'

/**
 * Dependencies
 */
const {JSONSchema} = require('json-document')
const JWKSchema = require('./JWKSchema')

/**
 * JWKSetSchema
 */
const JWKSetSchema = new JSONSchema({
  type: 'object',
  properties: {
    keys: {
      type: 'array',
      items: JWKSchema
    }
  }
})

/**
 * Export
 */
module.exports = JWKSetSchema
