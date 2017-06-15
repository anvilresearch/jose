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
const { Base64URLSchema } = require('../../src/index')
const {JSONSchema} = require('@trust/json-document')

/**
 * Tests
 */
describe('Base64URLSchema', () => {
  it('should be an instance of JSONSchema', () => {
    Base64URLSchema.should.be.an.instanceof(JSONSchema)
  })

  it('should define type', () => {
    Base64URLSchema.type.should.equal('string')
  })

  it('should define format', () => {
    Base64URLSchema.format.should.equal('base64url')
  })
})

