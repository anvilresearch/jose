'use strict'

/**
 * Test dependencies
 */
const chai = require('chai')

/**
 * Assertions
 */
chai.should()

/**
 * Code under test
 */
const {JSONSchema} = require('@trust/json-document')
const {JWKSet, JWKSchema} = require('../../src/index')
const JWKSetSchema = JWKSet.schema

/**
 * Tests
 */
describe('JWKSetSchema', () => {
  const { properties } = JWKSetSchema

  it('should be an instance of JSONSchema', () => {
    JWKSetSchema.should.be.an.instanceof(JSONSchema)
  })

  it('should define type', () => {
    JWKSetSchema.type.should.equal('object')
  })

  it('should define "keys" type', () => {
    properties.keys.type.should.equal('array')
  })

  it('should define "keys" items', () => {
    properties.keys.items.should.equal(JWKSchema)
  })
})

