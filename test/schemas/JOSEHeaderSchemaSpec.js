'use strict'

/**
 * Test dependencies
 */
const chai = require('chai')

/**
 * Assertions
 */
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const JOSEHeaderSchema = require('../../src/schemas/JOSEHeaderSchema')
const {JSONSchema} = require('@trust/json-document')

/**
 * Tests
 */
describe('JOSEHeaderSchema', () => {
  const properties = JOSEHeaderSchema.properties

  it('should be an instance of JSONSchema', () => {
    JOSEHeaderSchema.should.be.an.instanceof(JSONSchema)
  })

  it('should define type', () => {
    JOSEHeaderSchema.type.should.equal('object')
  })

  it('should define "typ" type', () => {
    properties.typ.type.should.equal('string')
  })

  it('should define "cty" type', () => {
    properties.cty.type.should.equal('string')
  })

  it('should define "cty" enum', () => {
    properties.cty.enum.should.eql(['JWT'])
  })

  it('should define "alg" type', () => {
    properties.alg.type.should.equal('string')
  })

  it('should define "alg" format', () => {
    properties.alg.format.should.equal('StringOrURI')
  })

  it('should define "jku" type', () => {
    properties.jku.type.should.equal('string')
  })

  it('should define "jku" format', () => {
    properties.jku.format.should.equal('URI')
  })

  it('should define "jwk" type')

  it('should define "kid" type', () => {
    properties.kid.type.should.equal('string')
  })

  it('should define "x5u" type', () => {
    properties.x5u.type.should.equal('string')
  })

  it('should define "x5u" format', () => {
    properties.x5u.format.should.equal('URI')
  })

  it('should define "x5c" type', () => {
    properties.x5c.type.should.equal('array')
  })

  it('should define "x5c" items format', () => {
    properties.x5c.items.format.should.equal('base64')
  })

  it('should define "x5t" type', () => {
    properties.x5t.type.should.equal('string')
  })

  it('should define "x5t" format', () => {
    properties.x5t.format.should.equal('base64url')
  })

  it('should define "x5t#S256" type')

  it('should define "x5t#S256" format')

  it('should define "crit" type', () => {
    properties.crit.type.should.equal('array')
  })

  it('should define "crit" items type', () => {
    properties.crit.items.type.should.equal('string')
  })

  it('should define "crit" minItems', () => {
    properties.crit.minItems.should.equal(1)
  })

  it('should define "enc" type', () => {
    properties.enc.type.should.equal('string')
  })

  it('should define "enc" format', () => {
    properties.enc.format.should.equal('StringOrURI')
  })

  it('should define "zip" type', () => {
    properties.zip.type.should.equal('string')
  })
})

