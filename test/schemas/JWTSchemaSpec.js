'use strict'

/**
 * Test dependencies
 */
const chai = require('chai')

/**
 * Assertions
 */
chai.use(require('dirty-chai'))
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const { JWTSchema, JOSEHeaderSchema, Base64URLSchema } = require('../../src/index')
const { JWTClaimsSetSchema } = require('../../src/index')
const { JSONSchema } = require('@trust/json-document')

/**
 * Tests
 */
describe('JWTSchema', () => {
  const properties = JWTSchema.properties

  it('should be an instance of JSONSchema', () => {
    JWTSchema.should.be.an.instanceof(JSONSchema)
  })

  it('should define type', () => {
    JWTSchema.type.should.equal('object')
  })

  it('should define "segments" type')
  it('should define "header"')
  it('should define "protected"')
  it('should define "unprotected"')

  it('should define "iv"', () => {
    properties.iv.should.equal(Base64URLSchema)
  })

  it('should define "aad"', () => {
    properties.aad.should.equal(Base64URLSchema)
  })

  it('should define "ciphertext"', () => {
    properties.ciphertext.should.equal(Base64URLSchema)
  })

  it('should define "tag"', () => {
    properties.tag.should.equal(Base64URLSchema)
  })

  describe('recipients', () => {
    const recipients = properties.recipients

    it('should define "recipients" type', () => {
      recipients.type.should.equal('array')
    })

    it('should define "recipients" items', () => {
      recipients.items.should.exist()
    })

    it('should define "recipients" items type', () => {
      recipients.items.type.should.equal('object')
    })

    it('should define "recipients" items "header"', () => {
      recipients.items.properties.header.should.equal(JOSEHeaderSchema)
    })

    it('should define "recipients" items "encrypted_key"', () => {
      recipients.items.properties.encrypted_key.should.equal(Base64URLSchema)
    })
  })

  it('should define "payload"', () => {
    properties.payload.should.equal(JWTClaimsSetSchema)
  })

  describe('signatures', () => {
    const signatures = properties.signatures

    it('should define "signatures" type', () => {
      signatures.type.should.equal('array')
    })

    it('should define "signatures" items')

    it('should define "signatures" items type')

    it('should define "signatures" items "protected"')

    it('should define "signatures" items "header"')

    it('should define "signatures" items "signature"')

    it('should define "signatures" items "key"')

    it('should define "signatures" items "key" type')

    it('should define "signature"')
  })

  it('should define "verified" type')
  it('should define "verified" default')
  it('should define "key" type')
  it('should define "serialization" type')
  it('should define "serialization" enum')
  it('should define "serialization" default')
})

